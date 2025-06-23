// components/journey/JourneySidebar.tsx
'use client';

import type { JourneyData, StepWithDetails } from '@/lib/types';
import { CheckCircleIcon, RadioIcon as InProgressIcon } from '@heroicons/react/24/solid';
import { CircleIcon } from '@/components/icons';

const ProgressCircle = ({ percentage }: { percentage: number }) => {
    const strokeWidth = 2.5;
    const radius = 12;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="h-7 w-7 -rotate-90">
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

const StepItem = ({ step, isSelected, isActive, onStepSelect }: { step: StepWithDetails; isSelected: boolean; isActive: boolean; onStepSelect: (id: string) => void }) => {
  const isCompleted = step.status === 'completed';
  const getIcon = () => {
    if (isCompleted) return <CheckCircleIcon className="h-6 w-6 text-success" />;
    if (isActive) return <InProgressIcon className="h-6 w-6 text-primary" />;
    return <CircleIcon className="h-6 w-6 text-border" />;
  };

  return (
    <div
      onClick={() => onStepSelect(step.id)}
      className={`flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors ${isSelected ? 'bg-primary-light' : 'hover:bg-gray-100'}`}
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <div>
        <h4 className={`font-semibold ${isSelected ? 'text-primary-DEFAULT' : 'text-text-DEFAULT'}`}>{step.title}</h4>
      </div>
    </div>
  );
};

export function JourneySidebar({ journeyData, selectedStepId, onStepSelect }: { journeyData: any; selectedStepId: string | null; onStepSelect: (id: string) => void; }) {
  const getStageProgress = (stage: any) => {
    if (!stage.steps || stage.steps.length === 0) return 0;
    const completedSteps = stage.steps.filter((s: any) => s.status === 'completed').length;
    return (completedSteps / stage.steps.length) * 100;
  };
  
  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar p-4">
      <div className="px-2 pb-4">
        <p className="text-sm font-medium text-text-light">SaaS Blueprint</p>
      </div>
      <div className="flex-grow space-y-6 overflow-y-auto">
        {journeyData.stages.map((stage: any, index: number) => (
          <div key={stage.id} className="relative pl-9">
            {index < journeyData.stages.length - 1 && <div className="absolute left-[13px] top-[28px] h-full w-px bg-border" />}
            <div className="absolute left-0 top-0">
              <ProgressCircle percentage={getStageProgress(stage)} />
            </div>
            <h3 className="mb-2 font-bold text-text-DEFAULT">{stage.title}</h3>
            <div className="space-y-1">
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
        ))}
      </div>
    </div>
  );
}