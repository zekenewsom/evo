import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { JourneyData, StageWithDetails, StepWithDetails } from './types';

export const getJourneyForUser = cache(
  async (supabase: SupabaseClient, userJourneyId: string): Promise<JourneyData | null> => {
    const { data, error } = await supabase
      .from('user_journeys')
      .select(`
        journey_template_id,
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

    if (error || !data || !data.journey_templates) {
      console.error('Error fetching user journey or template:', error?.message);
      return null;
    }

    const journeyTemplate = (Array.isArray(data.journey_templates) ? data.journey_templates[0] : data.journey_templates) as unknown as JourneyData;

    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('item_id, status')
      .eq('user_journey_id', userJourneyId);

    if (progressError) {
      console.error('Error fetching user progress:', progressError.message);
      // Return the template without progress if progress fetch fails
      return journeyTemplate;
    }

    const progressMap = new Map(progressData.map(p => [p.item_id, p.status]));

    // Use our proper types for iteration
    journeyTemplate.stages.forEach((stage: StageWithDetails) => {
      stage.status = progressMap.get(stage.id) ?? 'not_started';
      stage.steps.forEach((step: StepWithDetails) => {
        step.status = progressMap.get(step.id) ?? 'not_started';
        
        // This check is safe because the type for guidance_content is now correct
        if (Array.isArray(step.guidance_content)) {
          // This is a workaround for Supabase returning one-to-one as an array
          (step as any).guidance_content = step.guidance_content[0] || null;
        }

        step.tasks.forEach((task) => {
          task.status = progressMap.get(task.id) ?? 'not_started';
        });
        step.tasks.sort((a: { order_in_step: number }, b: { order_in_step: number }) => a.order_in_step - b.order_in_step);
      });
      stage.steps.sort((a: { order_in_stage: number }, b: { order_in_stage: number }) => a.order_in_stage - b.order_in_stage);
    });
    journeyTemplate.stages.sort((a: { order_in_journey: number }, b: { order_in_journey: number }) => a.order_in_journey - b.order_in_journey);

    return journeyTemplate;
  }
);

export const getStepDetailsForUser = cache(
  async (supabase: SupabaseClient, userJourneyId: string, stepId: string): Promise<(StepWithDetails & { userInput: string | null }) | null> => {
    // 1. Fetch the specific step and its related data
    const { data: stepData, error: stepError } = await supabase
      .from('steps')
      .select(`
        *,
        tasks(*),
        guidance_content(*)
      `)
      .eq('id', stepId)
      .single();

    if (stepError || !stepData) {
      console.error('Error fetching step details:', stepError?.message);
      return null;
    }

    // 2. Fetch progress for the tasks in this step
    const taskIds = stepData.tasks.map((t: { id: string }) => t.id);
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('item_id, status')
      .eq('user_journey_id', userJourneyId)
      .in('item_id', taskIds);

    if (progressError) {
      console.error('Error fetching task progress:', progressError.message);
      // Continue without progress if it fails
    }

    // 3. Fetch user input for this step
    const { data: inputData, error: inputError } = await supabase
      .from('user_inputs')
      .select('input_content')
      .eq('user_journey_id', userJourneyId)
      .eq('step_id', stepId)
      .maybeSingle();

    if (inputError) {
      console.error('Error fetching user input:', inputError.message);
      // Continue without input if it fails
    }

    // 4. Merge all the data together
    const progressMap = new Map(progressData?.map(p => [p.item_id, p.status]));
    const tasksWithStatus = stepData.tasks.map((task: any) => ({
      ...task,
      status: progressMap.get(task.id) || 'not_started',
    }));

    const finalStepData = {
      ...stepData,
      tasks: tasksWithStatus.sort((a: any, b: any) => a.order_in_step - b.order_in_step),
      guidance_content: Array.isArray(stepData.guidance_content) ? stepData.guidance_content[0] || null : stepData.guidance_content,
      userInput: inputData?.input_content || null,
    };

    return finalStepData as (StepWithDetails & { userInput: string | null });
  }
);