// actions/journey.ts (Corrected & Consolidated)
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function startSaaSJourney() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { return { error: 'You must be logged in to start a journey.' }; }

  const { data: blueprint, error: blueprintError } = await supabase
    .from('journey_templates')
    .select(`*, stages(*, steps(*, tasks(*)))`)
    .eq('title', 'SaaS Founder Blueprint')
    .single();

  if (blueprintError || !blueprint) { return { error: 'Could not find the blueprint template.' }; }

  const { data: userJourney, error: journeyError } = await supabase
    .from('user_journeys')
    .insert({ user_id: user.id, journey_template_id: blueprint.id, status: 'active' })
    .select()
    .single();

  if (journeyError) { return { error: 'Failed to start your journey.' }; }

  const progressItems: any[] = [];
  (blueprint.stages as import('@/lib/types').StageWithDetails[]).forEach((stage: import('@/lib/types').StageWithDetails) => {
    progressItems.push({ user_journey_id: userJourney.id, item_id: stage.id, item_type: 'stage' });
    (stage.steps as import('@/lib/types').StepWithDetails[]).forEach((step: import('@/lib/types').StepWithDetails) => {
      progressItems.push({ user_journey_id: userJourney.id, item_id: step.id, item_type: 'step' });
      (step.tasks as import('@/lib/types').TaskWithStatus[]).forEach((task: import('@/lib/types').TaskWithStatus) => {
        progressItems.push({ user_journey_id: userJourney.id, item_id: task.id, item_type: 'task' });
      });
    });
  });

  const { error: progressError } = await supabase.from('user_progress').insert(progressItems);

  if (progressError) { return { error: 'Failed to initialize your journey progress.' }; }

  revalidatePath('/dashboard');
  redirect(`/journey/${userJourney.id}`);
}


export async function saveUserInput(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { return { error: 'You must be logged in.' }; }

  const journeyId = formData.get('journeyId') as string;
  const stepId = formData.get('stepId') as string;
  const inputContent = formData.get('inputContent') as string;

  if (!journeyId || !stepId) { return { error: 'Missing required IDs.' }; }

  const { error } = await supabase
    .from('user_inputs')
    .upsert({ user_journey_id: journeyId, step_id: stepId, input_content: inputContent }, { onConflict: 'user_journey_id,step_id' });

  if (error) { console.error('Error saving input:', error); return { error: 'Failed to save notes.' }; }
  
  revalidatePath(`/journey/${journeyId}/${stepId}`);
  return { success: true, message: 'Saved!' };
}

// New helper function to check and update parent statuses
async function updateParentStatuses(supabase: any, userJourneyId: string, stepId: string) {
  // Check if all tasks for the step are completed
  const { data: tasks, error: tasksError } = await supabase
    .from('steps')
    .select(`*, tasks!inner(user_progress!inner(status))`)
    .eq('id', stepId)
    .eq('tasks.user_progress.user_journey_id', userJourneyId)
    .single();

  if (tasksError) return;

  const allTasksCompleted = tasks.tasks.every((t: any) => t.user_progress[0].status === 'completed');

  if (allTasksCompleted) {
    // If all tasks are complete, mark the step as complete
    await supabase
      .from('user_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_journey_id', userJourneyId)
      .eq('item_id', stepId);

    // Now, check if all steps for the parent stage are completed
    const stageId = tasks.stage_id;
    const { data: steps, error: stepsError } = await supabase
      .from('stages')
      .select(`*, steps!inner(user_progress!inner(status))`)
      .eq('id', stageId)
      .eq('steps.user_progress.user_journey_id', userJourneyId)
      .single();

    if (stepsError) return;

    const allStepsCompleted = steps.steps.every((s: any) => s.user_progress[0].status === 'completed');

    if (allStepsCompleted) {
      // If all steps are complete, mark the stage as complete
      await supabase
        .from('user_progress')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('user_journey_id', userJourneyId)
        .eq('item_id', stageId);
    }
  }
}

// Updated toggleTaskStatus function
export async function toggleTaskStatus(userJourneyId: string, stepId: string, taskId: string, currentStatus: string) {
  const supabase = await createSupabaseServerClient();
  const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';

  const { error } = await supabase
    .from('user_progress')
    .update({ status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null })
    .eq('user_journey_id', userJourneyId)
    .eq('item_id', taskId)
    .eq('item_type', 'task');

  if (error) {
    return { error: 'Could not update the task status.' };
  }

  // After toggling a task, check if its parents should be updated
  await updateParentStatuses(supabase, userJourneyId, stepId);

  revalidatePath(`/journey/${userJourneyId}`);
  revalidatePath(`/journey/${userJourneyId}/${stepId}`);
  
  return { success: true };
}