// app/journey/[journeyId]/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import { JourneyWorkspace } from '@/components/journey/JourneyWorkspace';

type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

export default async function UserJourneyPage({ params }: JourneyPageProps) {
  // MODIFICATION: No longer changing the order, this is the standard pattern.
  const journeyId = params.journeyId;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const journeyData = await getJourneyForUser(supabase, journeyId);

  if (!journeyData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Journey Not Found</h1>
        <p>This journey could not be loaded or you do not have access.</p>
      </div>
    );
  }

  // MODIFICATION: Pass the data directly without creating a new variable.
  return <JourneyWorkspace journeyData={journeyData} />;
}