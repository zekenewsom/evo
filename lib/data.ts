import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

// Fetch the SaaS blueprint template (legacy/blueprint page usage)
export const getSaaSBlueprint = cache(async (supabase: SupabaseClient) => {
  const { data, error } = await supabase
    .from('journey_templates')
    .select(`
      id,
      title,
      description,
      stages (
        id,
        title,
        objective,
        order_in_journey,
        steps (
          id,
          title,
          is_essential,
          order_in_stage,
          guidance_content(*),
          tasks (
            id,
            title,
            order_in_step
          )
        )
      )
    `)
    .eq('title', 'SaaS Founder Blueprint')
    .single();

  if (error) {
    console.error('Error fetching journey blueprint:', error.message);
    return null;
  }

  // Flatten guidance_content for each step
  if (data && data.stages) {
    for (const stage of data.stages) {
      if (stage.steps) {
        for (const step of stage.steps as any) {
          if (Array.isArray(step.guidance_content)) {
            step.guidance_content = step.guidance_content[0] || null;
          }
        }
      }
    }
  }

  // Sort the nested stages, steps, and tasks by their order
  if (data && data.stages) {
    data.stages.sort((a: any, b: any) => a.order_in_journey - b.order_in_journey);
    for (const stage of data.stages) {
      if (stage.steps) {
        stage.steps.sort((a: any, b: any) => a.order_in_stage - b.order_in_stage);
        for (const step of stage.steps) {
          if (step.tasks) {
            step.tasks.sort((a: any, b: any) => a.order_in_step - b.order_in_step);
          }
        }
      }
    }
  }
  return data;
});

// Fetch the user's journey and the associated template
export const getJourneyForUser = cache(async (supabase: SupabaseClient, userJourneyId: number) => {
  const { data: userJourneyData, error: userJourneyError } = await supabase
    .from('user_journeys')
    .select(`
      id,
      status,
      journey_templates (
        id,
        title,
        description,
        stages (
          id,
          title,
          objective,
          order_in_journey,
          steps (
            id,
            title,
            is_essential,
            order_in_stage,
            guidance_content(*),
            tasks (
              id,
              title,
              order_in_step
            )
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

  const { data: progressData, error: progressError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_journey_id', userJourneyId);

  if (progressError) {
    console.error('Error fetching user progress:', progressError.message);
    return null;
  }

  const progressMap = new Map(progressData.map((p: any) => [p.item_id, p.status]));

  const journey = userJourneyData.journey_templates;
  const journeyObj = Array.isArray(journey) ? journey[0] : journey;
  if (journeyObj && journeyObj.stages) {
    for (const stage of journeyObj.stages as any[]) {
      stage.status = progressMap.get(stage.id) || 'not_started';
      for (const step of stage.steps) {
        step.status = progressMap.get(step.id) || 'not_started';
        if (Array.isArray(step.guidance_content)) {
          step.guidance_content = step.guidance_content[0] || null;
        }
        for (const task of step.tasks) {
          task.status = progressMap.get(task.id) || 'not_started';
        }
      }
    }
  }

  if (journeyObj && journeyObj.stages) {
    journeyObj.stages.sort((a: any, b: any) => a.order_in_journey - b.order_in_journey);
    for (const stage of journeyObj.stages) {
      if (stage.steps) {
        stage.steps.sort((a: any, b: any) => a.order_in_stage - b.order_in_stage);
        for (const step of stage.steps) {
          if (step.tasks) {
            step.tasks.sort((a: any, b: any) => a.order_in_step - b.order_in_step);
          }
        }
      }
    }
  }

  return journeyObj;
});