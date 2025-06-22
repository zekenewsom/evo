import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { JourneyData, StageWithDetails, StepWithDetails } from './types';

// Add return type for breadcrumbs
export type StepDetailsForWorkspace = StepWithDetails & {
  userInput: string | null;
  journeyTitle: string;
  stageTitle: string;
};

export const getJourneyForUser = cache(
  async (supabase: SupabaseClient, userJourneyId: string): Promise<JourneyData | null> => {
    // ... (the initial query remains the same)
    const { data: userJourneyData, error: userJourneyError } = await supabase
    .from('user_journeys')
    .select(`
      id,
      status,
      journey_templates (
        *,
        stages (
          *,
          steps (
            *,
            guidance_content(*),
            tasks (*)
          )
        )
      )
    `)
    .eq('id', userJourneyId)
    .single();

    if (userJourneyError || !userJourneyData) {
        console.error('Error fetching user journey:', userJourneyError?.message);
        return null;
    }

    const journey = userJourneyData.journey_templates as any; // Cast for modification

    const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('item_id, status')
        .eq('user_journey_id', userJourneyId);

    if (progressError) { return null; }

    const progressMap = new Map(progressData.map(p => [p.item_id, p.status]));

    // Merge progress and CALCULATE completion percentage
    journey.stages.forEach((stage: any) => {
        stage.status = progressMap.get(stage.id) || 'not_started';
        let completedSteps = 0;
        stage.steps.forEach((step: any) => {
            step.status = progressMap.get(step.id) || 'not_started';
            if (step.status === 'completed') {
                completedSteps++;
            }
            if (Array.isArray(step.guidance_content)) {
                step.guidance_content = step.guidance_content[0] || null;
            }
            step.tasks.forEach((task: any) => {
                task.status = progressMap.get(task.id) || 'not_started';
            });
            step.tasks.sort((a: any, b: any) => a.order_in_step - b.order_in_step);
        });
        // Add completion percentage to the stage object
        stage.completionPercentage = stage.steps.length > 0 ? (completedSteps / stage.steps.length) * 100 : 0;
        stage.steps.sort((a: any, b: any) => a.order_in_stage - b.order_in_stage);
    });
    journey.stages.sort((a: any, b: any) => a.order_in_journey - b.order_in_journey);

    return journey as JourneyData;
  }
);

export const getStepDetailsForUser = cache(
  async (supabase: SupabaseClient, userJourneyId: string, stepId: string): Promise<StepDetailsForWorkspace | null> => {
    const { data: stepData, error: stepError } = await supabase
      .from('steps')
      .select(`
        *,
        tasks(*),
        guidance_content(*),
        stages ( title, journey_templates ( title ) )
      `)
      .eq('id', stepId)
      .single();

    if (stepError || !stepData) {
      console.error('Error fetching step details:', stepError?.message);
      return null;
    }

    const taskIds = stepData.tasks.map((t: any) => t.id);
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('item_id, status')
      .eq('user_journey_id', userJourneyId)
      .in('item_id', taskIds);

    if (progressError) { return null; }

    const { data: inputData, error: inputError } = await supabase
      .from('user_inputs')
      .select('input_content')
      .eq('user_journey_id', userJourneyId)
      .eq('step_id', stepId)
      .maybeSingle();

    if (inputError) { return null; }

    const progressMap = new Map(progressData?.map(p => [p.item_id, p.status]));
    const tasksWithStatus = stepData.tasks.map((task: any) => ({
      ...task,
      status: progressMap.get(task.id) || 'not_started',
    }));

    const finalStepData = {
      ...stepData,
      tasks: tasksWithStatus.sort((a: any,b: any) => a.order_in_step - b.order_in_step),
      guidance_content: Array.isArray(stepData.guidance_content) ? stepData.guidance_content[0] || null : stepData.guidance_content,
      userInput: inputData?.input_content || null,
      // Add breadcrumb titles
      stageTitle: stepData.stages?.title || 'Stage',
      journeyTitle: (stepData.stages?.journey_templates as any)?.title || 'Journey',
    };
    delete (finalStepData as any).stages; // Clean up the nested object

    return finalStepData as StepDetailsForWorkspace;
  }
);