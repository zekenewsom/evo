import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// We will create the following two files in the next steps
import { getStepDetailsForUser } from '@/lib/data'; 
import StepWorkspace from '../../../components/journey/StepWorkspace';

type StepPageProps = {
  params: {
    journeyId: string;
    stepId: string;
  };
};

export default async function StepPage({ params }: StepPageProps) {
  const { journeyId, stepId } = params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // We will create this data fetching function next
  const stepData = await getStepDetailsForUser(supabase, journeyId, stepId);

  if (!stepData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Step Not Found</h1>
        <p>This step could not be loaded or you do not have access.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* The StepWorkspace will contain the entire layout for this page */}
      <StepWorkspace initialStepData={stepData} journeyId={journeyId} />
    </div>
  );
}
