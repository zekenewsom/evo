// app/journey/blueprint/page.tsx (Corrected)
// app/journey/blueprint/page.tsx (Corrected)
import { getSaaSBlueprint } from '@/lib/data';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

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
    <div className="w-full max-w-5xl mx-auto p-4 bg-slate-900 rounded-lg">
      <h1 className="text-3xl font-bold mb-4">SaaS Founder Blueprint (Raw Data)</h1>
      <p className="mb-4 text-slate-400">
        This page confirms that we can successfully fetch the entire journey structure from the database.
        The next step is to build the beautiful Journey Navigator UI to display this data.
      </p>
      <pre className="p-4 bg-slate-800 rounded-md text-xs overflow-x-auto text-slate-200">
        {JSON.stringify(blueprint, null, 2)}
      </pre>
    </div>
  );
}