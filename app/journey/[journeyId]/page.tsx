// app/journey/[journeyId]/page.tsx (Refactored)
import UserJourney from '@/components/journey/UserJourney';

type JourneyPageProps = {
  params: {
    journeyId: string;
  };
};

export default function UserJourneyPage({ params }: JourneyPageProps) {
  return <UserJourney journeyId={params.journeyId} />;
}