// app/journey/[journeyId]/page.tsx (Refactored)
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import UserJourney from '@/components/journey/UserJourney';

// Server component fetches data and passes to client component

type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

export default async function UserJourneyPage({ params }: JourneyPageProps) {
  const { journeyId } = params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const journeyData = await getJourneyForUser(supabase, journeyId);

  if (!journeyData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Journey Not Found</h1>
        <p>This journey could not be loaded or you do not have access.</p>
      </div>
    );
  }

  return <UserJourney journeyId={journeyId} journeyData={journeyData} />;
}