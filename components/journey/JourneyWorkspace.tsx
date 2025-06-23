// components/journey/JourneyWorkspace.tsx
'use client';

import { useState, useMemo } from 'react';
import type { JourneyData, StepWithDetails } from '@/lib/types';
import { JourneySidebar } from './JourneySidebar';
import { KanbanBoard } from './KanbanBoard';
import { GuidanceColumn } from './GuidanceColumn';
import type { JourneyWorkspaceData } from '@/lib/types';

export function JourneyWorkspace({ journeyData }: { journeyData: JourneyWorkspaceData }) {
  // Set the initial selected step to the first step of the first stage.
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    return journeyData.stages?.[0]?.steps?.[0]?.id || null;
  });

  // Memoize the selected step data to avoid re-calculating on every render.
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
      {/* Left Sidebar */}
      <div className="w-[22rem] flex-shrink-0">
        <JourneySidebar
          journeyData={journeyData}
          selectedStepId={selectedStepId}
          onStepSelect={setSelectedStepId}
        />
      </div>

      {/* Main Content: Kanban Board */}
      <div className="flex-grow min-w-0">
        {selectedStep ? (
          <KanbanBoard
            key={selectedStep.id} // Use key to force re-mount on step change
            tasks={selectedStep.tasks}
            userJourneyId={journeyData.userJourneyId}
            stepId={selectedStep.id}
            stepTitle={selectedStep.title}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-light">Select a step to begin.</div>
        )}
      </div>

      {/* Right Guidance Panel */}
      <div className="w-[24rem] flex-shrink-0">
        <GuidanceColumn
          guidance={selectedStep?.guidance_content || null}
          stepTitle={selectedStep?.title || 'Guidance'}
        />
      </div>
    </div>
  );
}