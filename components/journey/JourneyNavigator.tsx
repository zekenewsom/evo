// components/journey/JourneyNavigator.tsx (Refactored for Roadmap View)
'use client';
import StageColumn from './StageColumn';
import type { JourneyData } from '@/lib/types';

type JourneyNavigatorProps = {
  journeyData: JourneyData;
  userJourneyId: string;
  selectedStepId: string | null;
  setSelectedStepId: (stepId: string) => void;
};

export default function JourneyNavigator({ journeyData, userJourneyId, selectedStepId, setSelectedStepId }: JourneyNavigatorProps) {
  if (!journeyData || !journeyData.stages) {
    return <p>No journey data available.</p>;
  }

  return (
    <div className="flex items-start p-4 gap-8 overflow-x-auto">
      {journeyData.stages.map((stage, index) => (
        <StageColumn
          key={stage.id}
          stage={stage as any}
          userJourneyId={userJourneyId}
          selectedStepId={selectedStepId}
          setSelectedStepId={setSelectedStepId}
        />
      ))}
    </div>
  );
}