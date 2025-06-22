'use client';

import { useState } from 'react';
import type { JourneyData } from '@/lib/types';

type JourneyWorkspaceProps = {
  journeyData: JourneyData;
};

export default function JourneyWorkspace({ journeyData }: JourneyWorkspaceProps) {
  // This state will control which step is displayed in the workspace and guidance panel.
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    // Default to selecting the first step of the first stage
    if (journeyData.stages && journeyData.stages.length > 0) {
      if (journeyData.stages[0].steps && journeyData.stages[0].steps.length > 0) {
        return journeyData.stages[0].steps[0].id;
      }
    }
    return null;
  });

  return (
    <div className="flex w-full h-[calc(100vh-120px)] max-w-screen-2xl mx-auto gap-6 px-4">
      {/* ===== Left Column: Navigation Sidebar ===== */}
      <div className="w-1/4 max-w-xs bg-slate-900 rounded-lg p-4 shadow-md">
        <h2 className="text-lg font-bold text-white mb-4">Journey Overview</h2>
        <p className="text-slate-400">Phase 2: JourneySidebar will be implemented here.</p>
        {/* We will pass journeyData and the setSelectedStepId function here */}
      </div>

      {/* ===== Center Column: Kanban Workspace ===== */}
      <div className="flex-grow bg-slate-800/50 rounded-lg p-4 shadow-md">
         <h2 className="text-lg font-bold text-white mb-4">Workspace</h2>
         <p className="text-slate-400">Phase 2: KanbanBoard will be implemented here.</p>
         <p className="text-slate-500 mt-4">Selected Step ID: {selectedStepId || 'None'}</p>
         {/* We will find the selected step from journeyData and pass its tasks here */}
      </div>

      {/* ===== Right Column: Guidance Panel ===== */}
      <div className="w-1/4 max-w-md bg-slate-900 rounded-lg p-4 shadow-md">
         <h2 className="text-lg font-bold text-white mb-4">Evo Guidance</h2>
         <p className="text-slate-400">Phase 2: Guidance column will be implemented here.</p>
         {/* We will find the selected step from journeyData and pass its guidance content here */}
      </div>
    </div>
  );
}
