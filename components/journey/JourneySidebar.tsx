'use client';

import type { JourneyData, StageWithDetails, StepWithDetails } from '@/lib/types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type JourneySidebarProps = {
  journeyData: JourneyData;
  selectedStepId: string | null;
  onStepSelect: (stepId: string) => void;
};

// Internal component for a single selectable step
const StepItem = ({ step, isSelected, onStepSelect }: { step: StepWithDetails, isSelected: boolean, onStepSelect: (stepId: string) => void}) => {
  const selectedClasses = isSelected ? 'bg-primary/20 border-l-primary' : 'border-l-transparent hover:bg-slate-800/50';
  const completedClasses = step.status === 'completed' ? 'text-slate-500' : 'text-slate-200';

  return (
    <div
      onClick={() => onStepSelect(step.id)}
      className={`flex items-center gap-3 p-2 pl-4 cursor-pointer border-l-2 transition-all duration-150 ${selectedClasses}`}
    >
      {step.status === 'completed' ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
      ) : (
        // Placeholder for a different icon if needed
        <div className="h-5 w-5 border-2 border-slate-600 rounded-full flex-shrink-0"></div>
      )}
      <span className={`text-sm font-medium ${completedClasses}`}>{step.title}</span>
    </div>
  );
};


export default function JourneySidebar({ journeyData, selectedStepId, onStepSelect }: JourneySidebarProps) {
  return (
    <div className="flex flex-col h-full">
       <h2 className="text-xl font-bold text-white mb-2 px-2">SaaS Founder Blueprint</h2>
       <p className="text-sm text-slate-400 mb-6 px-2">{journeyData.description}</p>
       <div className="flex-grow overflow-y-auto space-y-4">
        {journeyData.stages.map((stage: StageWithDetails) => (
          <div key={stage.id}>
            <h3 className="text-xs font-bold uppercase text-slate-500 px-2 mb-2">{stage.title}</h3>
            <div className="space-y-1">
              {stage.steps.map((step: StepWithDetails) => (
                <StepItem 
                  key={step.id}
                  step={step}
                  isSelected={selectedStepId === step.id}
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
