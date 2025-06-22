// components/journey/JourneyNavigator.tsx (Corrected)
'use client';
import { useState } from 'react';
import StageCard from './StageCard';
import GuidancePanel from './GuidancePanel';
import type { JourneyData, StepWithDetails } from '@/lib/types'; // Import from our new types file

type JourneyNavigatorProps = {
  journeyData: JourneyData;
  userJourneyId: string;
};

export default function JourneyNavigator({ journeyData, userJourneyId }: JourneyNavigatorProps) {
  const [selectedStep, setSelectedStep] = useState<StepWithDetails | null>(null);

  if (!journeyData || !journeyData.stages) {
    return <p>No journey data available.</p>;
  }

  const handleStepSelect = (step: StepWithDetails) => {
    setSelectedStep(step);
  };

  const handleClosePanel = () => {
    setSelectedStep(null);
  };

  return (
    <div className="w-full relative">
      {journeyData.stages.map((stage) => (
        <StageCard
          key={stage.id}
          stage={stage}
          onStepSelect={handleStepSelect}
          userJourneyId={userJourneyId}
        />
      ))}
      {selectedStep && selectedStep.guidance_content && (
        <GuidancePanel
          guidance={selectedStep.guidance_content}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}