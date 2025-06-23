// components/journey/JourneyWorkspace.tsx
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { JourneyWorkspaceData, StepWithDetails } from '@/lib/types';
import { JourneySidebar } from './JourneySidebar';
import { KanbanBoard } from './KanbanBoard';
import { GuidanceColumn } from './GuidanceColumn';
import { Bars3Icon } from '@heroicons/react/24/solid';

const ResizableDivider = ({ onDrag, position }: { onDrag: (deltaX: number) => void; position: 'left' | 'right' }) => {
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = position === 'left' ? e.movementX : -e.movementX;
      onDrag(deltaX);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onDrag, position]);

  return (
    <div
      className="w-6 bg-transparent hover:bg-slate-100/30 transition-colors cursor-col-resize z-20"
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
    />
  );
};

export function JourneyWorkspace({ journeyData }: { journeyData: JourneyWorkspaceData }) {
  const [selectedStepId, setSelectedStepId] = useState<string | null>(() => {
    return journeyData.stages?.[0]?.steps?.[0]?.id || null;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [guidanceCollapsed, setGuidanceCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(352); // 22rem = 352px
  const [guidanceWidth, setGuidanceWidth] = useState(384); // 24rem = 384px

  const selectedStep = useMemo(() => {
    if (!selectedStepId) return null;
    for (const stage of journeyData.stages) {
      const step = stage.steps.find(s => s.id === selectedStepId);
      if (step) return step as StepWithDetails;
    }
    return null;
  }, [selectedStepId, journeyData.stages]);

  const handleSidebarResize = (deltaX: number) => {
    const newWidth = Math.max(100, Math.min(1200, sidebarWidth + deltaX));
    setSidebarWidth(newWidth);
  };

  const handleGuidanceResize = (deltaX: number) => {
    const newWidth = Math.max(100, Math.min(1200, guidanceWidth + deltaX));
    setGuidanceWidth(newWidth);
  };

  return (
    <div className="flex h-full w-full">
      {/* Collapsible Sidebar */}
      <div className={`relative transition-all duration-300 ${sidebarCollapsed ? 'w-10' : ''} flex-shrink-0`} style={{ width: sidebarCollapsed ? '40px' : `${sidebarWidth}px` }}>
        <div className={`h-full ${sidebarCollapsed ? 'bg-white border-r border-slate-200' : ''}`}>
          <button
            className="absolute top-2 right-2 z-10 bg-white border border-slate-300 rounded-md p-1.5 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Bars3Icon className="h-4 w-4 text-slate-600" />
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
      
      {/* Resizable divider for sidebar */}
      {!sidebarCollapsed && (
        <ResizableDivider onDrag={handleSidebarResize} position="left" />
      )}
      
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
      
      {/* Resizable divider for guidance */}
      {!guidanceCollapsed && (
        <ResizableDivider onDrag={handleGuidanceResize} position="right" />
      )}
      
      <div className={`relative transition-all duration-300 ${guidanceCollapsed ? 'w-10' : ''} flex-shrink-0`} style={{ width: guidanceCollapsed ? '40px' : `${guidanceWidth}px` }}>
        <div className={`h-full ${guidanceCollapsed ? 'bg-white border-l border-slate-200' : ''}`}>
          <button
            className="absolute top-2 right-2 z-10 bg-white border border-slate-300 rounded-md p-1.5 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            onClick={() => setGuidanceCollapsed((c) => !c)}
            aria-label={guidanceCollapsed ? 'Expand guidance' : 'Collapse guidance'}
          >
            <Bars3Icon className="h-4 w-4 text-slate-600" />
          </button>
          {!guidanceCollapsed && (
            <GuidanceColumn
              guidance={selectedStep?.guidance_content || null}
              stepTitle={selectedStep?.title || 'Guidance'}
            />
          )}
        </div>
      </div>
    </div>
  );
}