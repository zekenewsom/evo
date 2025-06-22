'use client';

import { useState } from 'react';
import type { Tables } from '@/lib/database.types';
import StageCard from './StageCard';
import GuidancePanel from './GuidancePanel';
import type { StepWithDetails } from './StepItem';

// Define the full blueprint type with all nested details
type JourneyBlueprint = Tables<'journey_templates'> & {
  stages: (Tables<'stages'> & {
    steps: StepWithDetails[];
  })[];
};

type JourneyNavigatorProps = {
  blueprint: JourneyBlueprint;
};

export default function JourneyNavigator({ blueprint }: JourneyNavigatorProps) {
  // State to manage which step is selected to show guidance for
  const [selectedStep, setSelectedStep] = useState<StepWithDetails | null>(null);

  if (!blueprint || !blueprint.stages) {
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
      {blueprint.stages.map((stage) => (
        <StageCard
          key={stage.id}
          stage={stage}
          onStepSelect={handleStepSelect}
        />
      ))}

      {/* Conditionally render the guidance panel */}
      {selectedStep && selectedStep.guidance_content && (
        <GuidancePanel
          guidance={selectedStep.guidance_content}
          onClose={handleClosePanel}
        />
      )}
    </div>
  );
}
