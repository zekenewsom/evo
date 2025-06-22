// lib/data.ts (Corrected)
import { cache } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

// The function now accepts the Supabase client as an argument
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

  // Supabase returns one-to-one relations as a single-element array.
  // We need to flatten this for each step.
  if (data && data.stages) {
    for (const stage of data.stages) {
      if (stage.steps) {
        for (const step of stage.steps as any) { // Use 'as any' to modify the type in-place
          if (Array.isArray(step.guidance_content)) {
            step.guidance_content = step.guidance_content[0] || null;
          }
        }
      }
    }
  }

  // Sort the nested stages, steps, and tasks by their order
  if (data && data.stages) {
    data.stages.sort((a, b) => a.order_in_journey - b.order_in_journey);
    for (const stage of data.stages) {
      if (stage.steps) {
        stage.steps.sort((a, b) => a.order_in_stage - b.order_in_stage);
        for (const step of stage.steps) {
          if (step.tasks) {
            step.tasks.sort((a, b) => a.order_in_step - b.order_in_step);
          }
        }
      }
    }
  }

  return data;
});