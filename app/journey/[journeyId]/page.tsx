// app/journey/[journeyId]/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import { JourneyWorkspace } from '@/components/journey/JourneyWorkspace';

// Define the correct type for the props
type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

// The function is async, and we now await params
export default async function UserJourneyPage({ params }: JourneyPageProps) {
  // CORRECTED: 'await' is used here to satisfy the Next.js runtime
  const { journeyId } = await params;
  
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const journeyData = await getJourneyForUser(supabase, journeyId, user.id);

  if (!journeyData) {
    return (
      <div className="p-8 text-center h-full flex items-center justify-center">
        <div>
            <h1 className="text-2xl font-bold">Journey Not Found</h1>
            <p>This journey could not be loaded or you do not have access.</p>
        </div>
      </div>
    );
  }

  const journeyWorkspaceData = {
      ...journeyData,
      userJourneyId: journeyId,
  };

  return <JourneyWorkspace journeyData={journeyWorkspaceData} />;
}
