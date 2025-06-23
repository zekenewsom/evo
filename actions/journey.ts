// actions/journey.ts
'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { StageWithDetails, StepWithDetails, TaskWithStatus } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function startSaaSJourney() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to start a journey.' };
  }

  const { data: blueprint, error: blueprintError } = await supabase
    .from('journey_templates')
    .select(`*, stages(*, steps(*, tasks(*)))`)
    .eq('title', 'SaaS Founder Blueprint')
    .single();

  if (blueprintError || !blueprint) {
    return { error: 'Could not find the blueprint template.' };
  }

  const { data: userJourney, error: journeyError } = await supabase
    .from('user_journeys')
    .insert({ user_id: user.id, journey_template_id: blueprint.id, status: 'active' })
    .select()
    .single();

  if (journeyError) { return { error: 'Failed to start your journey.' }; }

  const progressItems: { user_journey_id: string; item_id: string; item_type: string; status: string; }[] = [];
  (blueprint.stages as StageWithDetails[]).forEach((stage: StageWithDetails) => {
    progressItems.push({ user_journey_id: userJourney.id, item_id: stage.id, item_type: 'stage', status: 'not_started' });
    (stage.steps as StepWithDetails[]).forEach((step: StepWithDetails) => {
      progressItems.push({ user_journey_id: userJourney.id, item_id: step.id, item_type: 'step', status: 'not_started' });
      (step.tasks as TaskWithStatus[]).forEach((task: TaskWithStatus) => {
        progressItems.push({
          user_journey_id: userJourney.id,
          item_id: task.id,
          item_type: 'task',
          status: 'todo'
        });
      });
    });
  });

  const { error: progressError } = await supabase.from('user_progress').insert(progressItems);

  if (progressError) {
    return { error: 'Failed to initialize your journey progress.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/journey/${userJourney.id}`);
  redirect(`/journey/${userJourney.id}`);
}

export async function saveUserInput(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return { error: 'You must be logged in.' }; }

  const journeyId = formData.get('journeyId') as string;
  const stepId = formData.get('stepId') as string;
  const inputContent = formData.get('inputContent') as string;

  if (!journeyId || !stepId) { return { error: 'Missing required IDs.' }; }

  const { error } = await supabase
    .from('user_inputs')
    .upsert({ user_journey_id: journeyId, step_id: stepId, input_content: inputContent }, { onConflict: 'user_journey_id,step_id' });
  
  if (error) { 
    console.error('Error saving input:', error); 
    return { error: 'Failed to save notes.' };
  }
  
  revalidatePath(`/journey/${journeyId}/${stepId}`);
  return { success: true, message: 'Saved!' };
}


async function updateParentStatuses(supabase: SupabaseClient, userJourneyId: string, stepId: string) {
  const { data: stepDetails, error: tasksError } = await supabase
    .from('steps')
    .select('id, stage_id, tasks(id)')
    .eq('id', stepId)
    .single();

  if (tasksError || !stepDetails) return;

  const taskIds = stepDetails.tasks.map((t: { id: string }) => t.id);
  const { data: taskProgress, error: taskProgressError } = await supabase
    .from('user_progress')
    .select('status')
    .eq('user_journey_id', userJourneyId)
    .in('item_id', taskIds)
    .eq('item_type', 'task');

  if (taskProgressError) return;

  const allTasksCompleted = taskProgress.every((p: { status: string }) => p.status === 'done');

  if (allTasksCompleted) {
    await supabase
      .from('user_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_journey_id', userJourneyId)
      .eq('item_id', stepId)
      .eq('item_type', 'step');

    const stageId = stepDetails.stage_id;
    const { data: stageDetails, error: stageDetailsError } = await supabase
      .from('stages')
      .select('id, steps(id)')
      .eq('id', stageId)
      .single();

    if (stageDetailsError || !stageDetails) return;

    const stepIds = stageDetails.steps.map((s: { id: string }) => s.id);
    const { data: stepProgress, error: stepProgressError } = await supabase
      .from('user_progress')
      .select('status')
      .eq('user_journey_id', userJourneyId)
      .in('item_id', stepIds)
      .eq('item_type', 'step');

    if (stepProgressError) return;

    const allStepsCompleted = stepProgress.every((p: { status: string }) => p.status === 'completed');

    if (allStepsCompleted) {
      await supabase
        .from('user_progress')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('user_journey_id', userJourneyId)
        .eq('item_id', stageId)
        .eq('item_type', 'stage');
    }
  }
}

export async function updateTaskStatus(userJourneyId: string, stepId: string, taskId: string, newStatus: 'todo' | 'inprogress' | 'done') {
  const supabase = createSupabaseServerClient();
  const completed_at = newStatus === 'done' ? new Date().toISOString() : null;

  const { error } = await supabase
    .from('user_progress')
    .update({ status: newStatus, completed_at: completed_at })
    .eq('user_journey_id', userJourneyId)
    .eq('item_id', taskId)
    .eq('item_type', 'task');

  if (error) {
    console.error("Failed to update task status:", error);
    return { error: 'Could not update the task status.' };
  }

  await updateParentStatuses(supabase, userJourneyId, stepId);
  revalidatePath(`/journey/${userJourneyId}`);
  
  return { success: true };
}