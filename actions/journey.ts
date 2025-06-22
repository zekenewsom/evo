// actions/journey.ts
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { unstable_cache as cache, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function startSaaSJourney() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to start a journey.' };
  }

  // Directly query for the template here, as getJourneyForUser is for existing user journeys.
  const { data: blueprint, error: blueprintError } = await supabase
    .from('journey_templates')
    .select(`*, stages(*, steps(*, tasks(*)))`)
    .eq('title', 'SaaS Founder Blueprint')
    .single();

  if (blueprintError || !blueprint) {
    console.error('Blueprint Fetch Error:', blueprintError);
    return { error: 'Could not find the SaaS Founder Blueprint template.' };
  }

  // --- Create the user's personal journey instance ---
  const { data: userJourney, error: journeyError } = await supabase
    .from('user_journeys')
    .insert({
      user_id: user.id,
      journey_template_id: blueprint.id,
      status: 'active',
    })
    .select()
    .single();

  if (journeyError) {
    console.error('Error creating user journey:', journeyError);
    return { error: 'Failed to start your journey. Please try again.' };
  }

  // --- Initialize progress for every item in the blueprint ---
  const progressItems: any[] = [];
  for (const stage of blueprint.stages) {
    progressItems.push({ user_journey_id: userJourney.id, item_id: stage.id, item_type: 'stage' });
    for (const step of stage.steps) {
      progressItems.push({ user_journey_id: userJourney.id, item_id: step.id, item_type: 'step' });
      for (const task of step.tasks) {
        progressItems.push({ user_journey_id: userJourney.id, item_id: task.id, item_type: 'task' });
      }
    }
  }

  const { error: progressError } = await supabase.from('user_progress').insert(progressItems);

  if (progressError) {
    console.error('Error initializing journey progress:', progressError);
    return { error: 'Failed to initialize your journey progress.' };
  }

  revalidatePath('/dashboard');
  redirect(`/journey/${userJourney.id}`);
}

export async function toggleTaskStatus(
  userJourneyId: string,
  taskId: string,
  currentStatus: string
) {
  const supabase = await createSupabaseServerClient();
  const newStatus = currentStatus === 'completed' ? 'not_started' : 'completed';

  const { error } = await supabase
    .from('user_progress')
    .update({ 
      status: newStatus, 
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null 
    })
    .eq('user_journey_id', userJourneyId)
    .eq('item_id', taskId)
    .eq('item_type', 'task');

  if (error) {
    console.error('Error toggling task status:', error);
    return { error: 'Could not update the task status.' };
  }

  // Revalidate the path of the journey page to show the change
  revalidatePath(`/journey/${userJourneyId}`);
  return { success: true };
}
