// components/journey/UserJourney.tsx (New File)
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import JourneyNavigator from './JourneyNavigator';

type UserJourneyProps = {
  journeyId: string;
};

export default async function UserJourney({ journeyId }: UserJourneyProps) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect('/login'); }

  const journeyData = await getJourneyForUser(supabase, journeyId);

  if (!journeyData) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Journey Not Found</h1>
        <p>This journey could not be loaded or you do not have access.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-100 mb-2">{journeyData.title}</h1>
        <p className="text-lg text-slate-400">{journeyData.description}</p>
      </div>
      <JourneyNavigator journeyData={journeyData} userJourneyId={journeyId} />
    </div>
  );
}