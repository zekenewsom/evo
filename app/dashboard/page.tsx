import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { startSaaSJourney } from "@/actions/journey";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if the user has an active journey
  const { data: activeJourney } = await supabase
    .from('user_journeys')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-3xl bg-slate-800 rounded-lg shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-slate-100">Welcome to your Evo Dashboard,</h1>
        <p className="text-lg text-primary mb-8">{user.email}</p>

      {activeJourney ? (
        <div className="bg-slate-600 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-slate-100">You&apos;re on your way!</h2>
          <p className="text-slate-300 mt-2 mb-6">You have an active journey in progress. Keep up the momentum!</p>
          <Link href={`/journey/${activeJourney.id}`} className="btn btn-primary btn-lg">
            Continue Your Journey
          </Link>
        </div>
      ) : (
        <div className="bg-slate-600 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-slate-100">Ready to build your dream?</h2>
          <p className="text-slate-300 mt-2 mb-6">Start the &quot;SaaS Founder Blueprint&quot; to get a step-by-step guide from idea to revenue.</p>
          <form action={startSaaSJourney}>
            <button type="submit" className="btn btn-primary btn-lg">
              Start SaaS Journey
            </button>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
