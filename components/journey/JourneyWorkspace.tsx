'use client';

import { useState, useMemo } from 'react';
import type { JourneyData, StepWithDetails } from '@/lib/types';
import JourneySidebar from './JourneySidebar';
import KanbanBoard from './KanbanBoard';
import GuidanceColumn from './GuidanceColumn';


type JourneyWorkspaceProps = {
  journeyData: JourneyData;
};

export default function JourneyWorkspace({ journeyData }: JourneyWorkspaceProps) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    if (journeyData.stages?.[0]?.steps?.[0]) {
      return journeyData.stages[0].steps[0].id;
    }
    return null;
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
    <div className="flex w-full h-[calc(100vh-120px)] max-w-screen-2xl mx-auto gap-4 p-4">
      {/* ===== Left Column: Navigation Sidebar ===== */}
      <div className="w-[22rem] flex-shrink-0 bg-slate-900/70 rounded-lg shadow-md overflow-hidden">
        <JourneySidebar
          journeyData={journeyData}
          selectedStepId={selectedStepId}
          onStepSelect={setSelectedStepId}
        />
      </div>

      {/* ===== Center Column: Kanban Workspace ===== */}
      <div className="flex-grow rounded-lg min-w-0">
        {selectedStep ? (
          <KanbanBoard
            key={selectedStep.id} // Re-mount board when step changes
            tasks={selectedStep.tasks}
            userJourneyId={journeyData.id} // This needs fixing - journey ID is on user_journeys not templates
            stepId={selectedStep.id}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">Select a step to begin.</div>
        )}
      </div>

      {/* ===== Right Column: Guidance Panel ===== */}
      <div className="w-[24rem] flex-shrink-0 bg-slate-900/70 rounded-lg shadow-md overflow-hidden">
        <GuidanceColumn guidance={selectedStep?.guidance_content || null} />
      </div>
    </div>
  );
}
