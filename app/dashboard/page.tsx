import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import ExampleCard from "@/components/ExampleCard";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    redirect('/login');
  }
  const { session } = data;

  return (
    <div className="p-6 w-full max-w-5xl mx-auto bg-slate-700 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-slate-100">Welcome to your Evo Dashboard,</h1>
      <p className="text-lg text-primary mb-8">{session.user.email}</p>

      {/* Example DaisyUI Card */}
      <div className="flex justify-center mb-8">
        <ExampleCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-slate-600 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-slate-100">Your Guided Journeys</h2>
            <p className="text-slate-300">Manage your existing business journeys or start a new one.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/journey/new" className="btn btn-secondary"> {/* Placeholder link */}
                Start New Journey
              </Link>
              <button className="btn btn-outline btn-accent">View My Journeys</button> {/* Placeholder */}
            </div>
          </div>
        </div>

        <div className="card bg-slate-600 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-slate-100">Evo Curriculum</h2>
            <p className="text-slate-300">Access learning modules to support your entrepreneurial path.</p>
            <div className="card-actions justify-end mt-4">
              <Link href="/learn" className="btn btn-secondary"> {/* Placeholder link */}
                Browse Curriculum
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* More dashboard widgets and content will go here */}
    </div>
  );
}
