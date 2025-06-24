// components/journey/JourneySidebar.tsx
'use client';

import { useState } from 'react';
import type { StepWithDetails, StageWithDetails, JourneyWorkspaceData } from '@/lib/types';
import { CheckCircleIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { CircleIcon } from '@/components/icons';

const ProgressCircle = ({ percentage }: { percentage: number }) => {
    const strokeWidth = 2.5;
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="h-7 w-7 -rotate-90" viewBox="0 0 28 28">
            <circle className="text-border" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx="14" cy="14" />
            <circle
                className="text-primary"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="14"
                cy="14"
            />
        </svg>
    );
};

const StepProgressCircle = ({ percentage }: { percentage: number }) => {
    const strokeWidth = 2;
    const radius = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="h-6 w-6 -rotate-90" viewBox="0 0 24 24">
            <circle className="text-border" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx="12" cy="12" />
            <circle
                className="text-primary"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="12"
                cy="12"
            />
        </svg>
    );
};

const StepItem = ({ step, isSelected, isActive, onStepSelect }: { step: StepWithDetails; isSelected: boolean; isActive: boolean; onStepSelect: (id: string) => void }) => {
  // Calculate task completion percentage
  const getTaskCompletionPercentage = () => {
    if (!step.tasks || step.tasks.length === 0) return 0;
    const completedTasks = step.tasks.filter(task => task.status === 'done').length;
    return (completedTasks / step.tasks.length) * 100;
  };

  const taskCompletionPercentage = getTaskCompletionPercentage();
  const isCompleted = taskCompletionPercentage === 100;

  const getIcon = () => {
    if (isCompleted) {
      return <CheckCircleIcon className="h-6 w-6 text-success" />;
    }
    if (taskCompletionPercentage > 0 || isActive) {
      return <StepProgressCircle percentage={taskCompletionPercentage} />;
    }
    return <CircleIcon className="h-6 w-6 text-border" />;
  };

  return (
    <div
      onClick={() => onStepSelect(step.id)}
      className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors ${isSelected ? 'bg-primary-light' : 'hover:bg-gray-100'}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div>
        <h4 className={`${isSelected ? 'text-primary' : 'text-text'}`}>{step.title}</h4>
      </div>
    </div>
  );
};

export function JourneySidebar({ journeyData, selectedStepId, onStepSelect }: { journeyData: JourneyWorkspaceData; selectedStepId: string | null; onStepSelect: (id: string) => void; }) {
  const [collapsedStages, setCollapsedStages] = useState<Set<string>>(new Set());

  const toggleStage = (stageId: string) => {
    setCollapsedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const getStageProgress = (stage: StageWithDetails) => {
    if (!stage.steps || stage.steps.length === 0) return 0;
    
    // Calculate total tasks and completed tasks across all steps in the stage
    let totalTasks = 0;
    let completedTasks = 0;
    
    stage.steps.forEach((step: StepWithDetails) => {
      if (step.tasks) {
        totalTasks += step.tasks.length;
        completedTasks += step.tasks.filter(task => task.status === 'done').length;
      }
    });
    
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };
  
  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar p-4">
      <div className="px-2 pb-4">
        <p className="text-sm font-medium text-text-light">SaaS Blueprint</p>
      </div>
      <div className="flex-grow space-y-4 overflow-y-auto">
        {journeyData.stages.map((stage: StageWithDetails) => {
          const stageProgress = getStageProgress(stage);
          const isStageCompleted = stageProgress === 100;
          const isCollapsed = collapsedStages.has(stage.id);
          
          return (
            <div key={stage.id} className="relative">
              <div className="flex items-center justify-between pl-9 mb-2">
                <div className="absolute left-0 top-0">
                  {isStageCompleted ? (
                    <CheckCircleIcon className="h-7 w-7 text-success" />
                  ) : (
                    <ProgressCircle percentage={stageProgress} />
                  )}
                </div>
                <h3 className="font-bold text-text text-left">{stage.title}</h3>
                <button
                  onClick={() => toggleStage(stage.id)}
                  className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRightIcon className="h-4 w-4 text-text-light" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-text-light" />
                  )}
                </button>
              </div>
              <div className={`space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
              }`}>
                {stage.steps.map((step: StepWithDetails) => (
                  <StepItem
                    key={step.id}
                    step={step}
                    isSelected={selectedStepId === step.id}
                    isActive={selectedStepId === step.id}
                    onStepSelect={onStepSelect}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}