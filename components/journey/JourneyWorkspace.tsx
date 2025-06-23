// components/journey/JourneyWorkspace.tsx
'use client';

import { useState, useMemo } from 'react';
import type { JourneyWorkspaceData, StepWithDetails } from '@/lib/types';
import { JourneySidebar } from './JourneySidebar';
import { KanbanBoard } from './KanbanBoard';
import { GuidanceColumn } from './GuidanceColumn';
import { Bars3Icon } from '@heroicons/react/24/solid';

export function JourneyWorkspace({ journeyData }: { journeyData: JourneyWorkspaceData }) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    return journeyData.stages?.[0]?.steps?.[0]?.id || null;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      {/* Collapsible Sidebar */}
      <div className={`relative transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-[22rem]'} flex-shrink-0`}>
        <div className={`h-full ${sidebarCollapsed ? 'bg-white border-r border-slate-200' : ''}`}>
          <button
            className="absolute top-4 right-4 z-10 bg-white border border-slate-300 rounded-full p-2 shadow-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Bars3Icon className="h-6 w-6 text-slate-700" />
          </button>
          {!sidebarCollapsed && (
            <JourneySidebar
              journeyData={journeyData}
              selectedStepId={selectedStepId}
              onStepSelect={setSelectedStepId}
            />
          )}
        </div>
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