// app/journey/[journeyId]/page.tsx (Refactored)
import UserJourney from '@/components/journey/UserJourney';

type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

export default async function UserJourneyPage({ params }: JourneyPageProps) {
  const { journeyId } = await params;
  return <UserJourney journeyId={journeyId} />;
}