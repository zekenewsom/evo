import { unstable_cache as cache, revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function saveUserInput(formData: FormData) {
  const journeyId = formData.get('journeyId') as string;
  const stepId = formData.get('stepId') as string;
  const inputContent = formData.get('inputContent') as string;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const { data, error } = await supabase
    .from('user_inputs')
    .upsert(
      {
        user_journey_id: journeyId,
        step_id: stepId,
        input_content: inputContent,
        // The primary key is (user_journey_id, step_id) if you set one,
        // so upsert knows whether to create or update.
        // We need to add this constraint to our table.
      },
      { onConflict: 'user_journey_id,step_id' }
    );

  if (error) {
    console.error('Error saving user input:', error);
    return { error: 'Failed to save your notes.' };
  }
  
  // Revalidate the path to show the new data
  revalidatePath(`/journey/${journeyId}/${stepId}`);
  return { success: true, message: 'Saved!' };
}
