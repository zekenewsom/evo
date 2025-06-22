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
      business_type_tag,
      created_at,
      version,
      stages (
        id,
        title,
        objective,
        order_in_journey,
        created_at,
        journey_template_id,
        steps (
          id,
          title,
          is_essential,
          order_in_stage,
          created_at,
          stage_id,
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

  // Map guidance_content arrays to a single object (or null) for each step
  if (data && data.stages) {
    for (const stage of data.stages) {
      if (stage.steps) {
        for (const step of stage.steps) {
          if (Array.isArray(step.guidance_content)) {
            step.guidance_content = step.guidance_content[0] || null;
          }
        }
      }
    }
  }

  return data;
});
