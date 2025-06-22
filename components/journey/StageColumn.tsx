import type { StageWithDetails } from '@/lib/types';
import StepCard from './StepCard';

export type StageColumnProps = {
  stage: StageWithDetails;
  userJourneyId: string;
  selectedStepId: string | null;
  setSelectedStepId: (stepId: string) => void;
};

export default function StageColumn({ stage, userJourneyId, selectedStepId, setSelectedStepId }: StageColumnProps) {
  return (
    <div className="flex flex-col items-start min-w-[220px] max-w-xs bg-slate-900 rounded-2xl p-4 shadow-lg border border-slate-800">
      <h3 className="text-lg font-bold text-slate-100 mb-1">{stage.title}</h3>
      <p className="text-xs text-slate-400 mb-4">{stage.objective}</p>
      <div className="flex flex-col gap-3 w-full">
        {stage.steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            userJourneyId={userJourneyId}
            isSelected={selectedStepId === step.id}
            onClick={() => setSelectedStepId(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
