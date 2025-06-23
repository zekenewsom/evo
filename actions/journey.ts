// actions/journey.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { StageWithDetails, StepWithDetails, TaskWithStatus } from '@/lib/types';

export async function startSaaSJourney() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser(); // 

  if (!user) {
    return { error: 'You must be logged in to start a journey.' }; // 
  }

  const { data: blueprint, error: blueprintError } = await supabase
    .from('journey_templates')
    .select(`*, stages(*, steps(*, tasks(*)))`)
    .eq('title', 'SaaS Founder Blueprint')
    .single(); // 

  if (blueprintError || !blueprint) {
    return { error: 'Could not find the blueprint template.' }; // 
  }

  const { data: userJourney, error: journeyError } = await supabase
    .from('user_journeys')
    .insert({ user_id: user.id, journey_template_id: blueprint.id, status: 'active' })
    .select()
    .single(); // 

  if (journeyError) { return { error: 'Failed to start your journey.' }; } // 

  const progressItems: any[] = [];
  (blueprint.stages as StageWithDetails[]).forEach((stage: StageWithDetails) => {
    progressItems.push({ user_journey_id: userJourney.id, item_id: stage.id, item_type: 'stage' });
    (stage.steps as StepWithDetails[]).forEach((step: StepWithDetails) => {
      progressItems.push({ user_journey_id: userJourney.id, item_id: step.id, item_type: 'step' });
      (step.tasks as TaskWithStatus[]).forEach((task: TaskWithStatus) => {
        // MODIFICATION: Set the default status for new tasks to 'todo'.
        progressItems.push({ 
          user_journey_id: userJourney.id, 
          item_id: task.id, 
          item_type: 'task',
          status: 'todo' // This aligns with our new Kanban states.
        });
      });
    });
  }); // 

  const { error: progressError } = await supabase.from('user_progress').insert(progressItems); // 

  if (progressError) {
    return { error: 'Failed to initialize your journey progress.' }; // 
  }

  revalidatePath('/dashboard'); // 
  redirect(`/journey/${userJourney.id}`); // 
}

export async function saveUserInput(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser(); // 
  if (!user) { return { error: 'You must be logged in.' }; } // 

  const journeyId = formData.get('journeyId') as string; // 
  const stepId = formData.get('stepId') as string; // 
  const inputContent = formData.get('inputContent') as string; // 

  if (!journeyId || !stepId) { return { error: 'Missing required IDs.' }; } // 

  const { error } = await supabase
    .from('user_inputs')
    .upsert({ user_journey_id: journeyId, step_id: stepId, input_content: inputContent }, { onConflict: 'user_journey_id,step_id' }); // 
  
  if (error) { 
    console.error('Error saving input:', error); 
    return { error: 'Failed to save notes.' }; // 
  }
  
  revalidatePath(`/journey/${journeyId}/${stepId}`); // 
  return { success: true, message: 'Saved!' }; // 
}

async function updateParentStatuses(supabase: any, userJourneyId: string, stepId: string) {
  const { data: tasks, error: tasksError } = await supabase
    .from('steps')
    .select(`*, tasks!inner(user_progress!inner(status))`)
    .eq('id', stepId)
    .eq('tasks.user_progress.user_journey_id', userJourneyId)
    .single(); // 

  if (tasksError) return; // 

  // MODIFICATION: Check if all tasks are 'done'
  const allTasksCompleted = tasks.tasks.every((t: any) => t.user_progress[0].status === 'done'); // 
  
  if (allTasksCompleted) {
    // MODIFICATION: Update step status to 'completed'
    await supabase
      .from('user_progress')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('user_journey_id', userJourneyId)
      .eq('item_id', stepId); // 
    
    const stageId = tasks.stage_id; // 
    const { data: steps, error: stepsError } = await supabase
      .from('stages')
      .select(`*, steps!inner(user_progress!inner(status))`)
      .eq('id', stageId)
      .eq('steps.user_progress.user_journey_id', userJourneyId)
      .single(); // 

    if (stepsError) return; // 

    // MODIFICATION: Check if all steps are 'completed'
    const allStepsCompleted = steps.steps.every((s: any) => s.user_progress[0].status === 'completed'); // 
    
    if (allStepsCompleted) {
      await supabase
        .from('user_progress')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('user_journey_id', userJourneyId)
        .eq('item_id', stageId); // 
    }
  }
}

// NEW FUNCTION: Replaces toggleTaskStatus to support Kanban states
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
    return { error: 'Could not update the task status.' };
  }

  // After updating a task, check if its parents should be marked as complete.
  await updateParentStatuses(supabase, userJourneyId, stepId);

  // Revalidate the main journey path. The specific stepId path will be deprecated.
  revalidatePath(`/journey/${userJourneyId}`);
  
  return { success: true };
}