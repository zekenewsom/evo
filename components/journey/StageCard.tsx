// components/journey/StageCard.tsx
'use client';
import StepItem from './StepItem';
import type { StageWithDetails } from '@/lib/types';
import { CheckIcon } from '@heroicons/react/24/solid';



type StageCardProps = {
  stage: StageWithDetails;
  userJourneyId: string;
};

export default function StageCard({ stage, userJourneyId }: StageCardProps) {
  // Determine the visual state based on progress
  const isCompleted = stage.status === 'completed';
  const isActive = stage.status === 'active'; // Note: We haven't implemented 'active' status yet, but the UI is ready
  const borderClass = isCompleted ? 'border-green-500' : isActive ? 'border-primary' : 'border-slate-700';

  return (
    <div
      className={`flex flex-col w-80 flex-shrink-0 bg-slate-800 rounded-lg border-2 shadow-lg transition-all ${borderClass}`}
    >
      {/* Node Header */}
      <div className="flex items-center p-4 border-b border-slate-700">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isCompleted ? 'bg-green-500' : 'bg-slate-700'}`}> 
          {isCompleted ? (
            <CheckIcon className="w-6 h-6 text-white" />
          ) : (
            <span className="text-lg font-bold text-primary">{stage.order_in_journey}</span>
          )}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-slate-100">{stage.title}</h2>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-4 flex-grow">
        <p className="text-slate-400 text-sm mb-4">{stage.objective}</p>
        {/* Render Steps within the node */}
        <div className="space-y-2">
            {stage.steps.map((step) => (
                <StepItem key={step.id} step={step} userJourneyId={userJourneyId} />
            ))}
        </div>
      </div>
    </div>
  );
}