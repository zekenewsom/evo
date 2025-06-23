// components/journey/UserJourney.tsx (New File)
'use client';
import { useState } from 'react';
import JourneyNavigator from './JourneyNavigator';
import StepSummaryPanel from './StepSummaryPanel';
import type { JourneyData } from '@/lib/types';

type UserJourneyProps = {
  journeyId: string;
  journeyData: JourneyData;
};

export default function UserJourney({ journeyId, journeyData }: UserJourneyProps) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);

  return (
    <div className="flex w-full h-full max-w-screen-2xl mx-auto gap-6 px-4">
      {/* Main Content (Navigator) */}
      <div className="flex-grow">
        <JourneyNavigator
          journeyData={journeyData}
          userJourneyId={journeyId}
          selectedStepId={selectedStepId}
          setSelectedStepId={setSelectedStepId}
        />
      </div>
      {/* Right Column (Summary Panel) */}
      <div className="w-full max-w-md lg:max-w-lg flex-shrink-0">
        <StepSummaryPanel
          key={selectedStepId}
          userJourneyId={journeyId}
          selectedStepId={selectedStepId}
        />
      </div>
    </div>
  );
}