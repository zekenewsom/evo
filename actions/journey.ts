// actions/journey.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { StageWithDetails, StepWithDetails, TaskWithStatus } from '@/lib/types';

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

  const progressItems: any[] = [];
  (blueprint.stages as StageWithDetails[]).forEach((stage: StageWithDetails) => {
    // A stage is either not started or completed.
    progressItems.push({ user_journey_id: userJourney.id, item_id: stage.id, item_type: 'stage', status: 'not_started' });
    (stage.steps as StepWithDetails[]).forEach((step: StepWithDetails) => {
      // A step is either not started or completed.
      progressItems.push({ user_journey_id: userJourney.id, item_id: step.id, item_type: 'step', status: 'not_started' });
      (step.tasks as TaskWithStatus[]).forEach((task: TaskWithStatus) => {
        // A task follows the todo -> inprogress -> done flow.
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

async function updateParentStatuses(supabase: any, userJourneyId: string, stepId: string) {
  // First, check if all tasks for the current step are now 'done'
  const { data: stepDetails, error: stepDetailsError } = await supabase
    .from('steps')
    .select('id, stage_id, tasks(id)')
    .eq('id', stepId)
    .single();

  if (stepDetailsError || !stepDetails) return;

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
    // If all tasks are done, mark the step as 'completed'
    await supabase
      .from('user_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_journey_id', userJourneyId)
      .eq('item_id', stepId)
      .eq('item_type', 'step');

    // Now, check if all steps in the parent stage are completed
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
      // If all steps are complete, mark the stage as 'completed'
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

  // After updating a task, check if its parent step/stage should be marked as complete.
  await updateParentStatuses(supabase, userJourneyId, stepId);

  // Revalidate the entire journey path to update progress circles and stage indicators.
  revalidatePath(`/journey/${userJourneyId}`);
  
  return { success: true };
}