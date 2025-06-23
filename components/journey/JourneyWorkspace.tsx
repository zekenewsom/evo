// components/journey/JourneyWorkspace.tsx
'use client';

import { useState, useMemo } from 'react';
import type { JourneyWorkspaceData, StepWithDetails } from '@/lib/types';
import { JourneySidebar } from './JourneySidebar';
import { KanbanBoard } from './KanbanBoard';
import { GuidanceColumn } from './GuidanceColumn';

export function JourneyWorkspace({ journeyData }: { journeyData: JourneyWorkspaceData }) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    return journeyData.stages?.[0]?.steps?.[0]?.id || null;
  });

  const selectedStep = useMemo(() => {
    if (!selectedStepId) return null;
    for (const stage of journeyData.stages) {
      const step = stage.steps.find(s => s.id === selectedStepId);
      if (step) return step as StepWithDetails;
    }
    return null;
  }, [selectedStepId, journeyData.stages]);

  return (
    <div className="flex h-full w-full max-w-screen-2xl mx-auto">
      <div className="w-[22rem] flex-shrink-0">
        <JourneySidebar
          journeyData={journeyData}
          selectedStepId={selectedStepId}
          onStepSelect={setSelectedStepId}
        />
      </div>
      <div className="flex-grow min-w-0">
        {selectedStep ? (
          <KanbanBoard
            key={selectedStep.id}
            tasks={selectedStep.tasks}
            userJourneyId={journeyData.userJourneyId}
            stepId={selectedStep.id}
            stepTitle={selectedStep.title}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-light">Select a step to begin.</div>
        )}
      </div>
      <div className="w-[24rem] flex-shrink-0">
        <GuidanceColumn
          guidance={selectedStep?.guidance_content || null}
          stepTitle={selectedStep?.title || 'Guidance'}
        />
      </div>
    </div>
  );
}