// app/journey/blueprint/page.tsx (Corrected)
// app/journey/blueprint/page.tsx (Corrected)
import { getSaaSBlueprint } from '@/lib/data';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import JourneyNavigator from '@/components/journey/JourneyNavigator'; // Import the new component

// Fix: Make business_type_tag, created_at, and version optional in JourneyBlueprint type if not always present, or ensure your query always selects them.
import type { StepWithDetails } from '@/components/journey/StepItem';

interface StageWithDetails {
  id: string;
  title: string;
  objective: string | null;
  order_in_journey: number;
  created_at: string | null;
  journey_template_id: string;
  steps: StepWithDetails[];
}

interface JourneyBlueprint {
  id: string;
  title: string;
  description: string;
  business_type_tag: string;
  created_at: string | null;
  version: number;
  stages: StageWithDetails[];
}

export default async function JourneyBlueprintPage() {
  const supabase = await createSupabaseServerClient();

  // THE FIX: Destructure more safely
  const { data, error } = await supabase.auth.getSession();

  // Redirect if there's an error or no session
  if (error || !data.session) {
    redirect('/login');
  }

  // Pass the supabase client created here into the function
  const blueprint = await getSaaSBlueprint(supabase);

  if (!blueprint) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Journey Blueprint Not Found</h1>
        <p>Could not load the SaaS Founder Blueprint from the database.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-100 mb-2">{blueprint.title}</h1>
        <p className="text-lg text-slate-400">{blueprint.description}</p>
      </div>
      {/* Render the new component instead of the raw JSON */}
      <JourneyNavigator journeyData={blueprint} />
    </div>
  );
}