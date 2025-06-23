// app/journey/[journeyId]/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import { JourneyWorkspace } from '@/components/journey/JourneyWorkspace';

// import type { JourneyData } from '@/lib/types'; // Removed unused import

type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

export default async function UserJourneyPage({ params }: JourneyPageProps) {
  const { journeyId } = await params;
  
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const journeyResult = await getJourneyForUser(supabase, journeyId, user.id);

  if (!journeyResult) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Journey Not Found</h1>
        <p>This journey could not be loaded or you do not have access.</p>
      </div>
    );
  }

  // The journeyData now includes the userJourneyId from the getJourneyForUser function.
  const journeyData = {
      ...journeyResult,
      userJourneyId: journeyId,
  };

  return <JourneyWorkspace journeyData={journeyData} />;
}