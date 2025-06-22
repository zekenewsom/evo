// components/journey/StepItem.tsx (Corrected)
'use client'; // This was missing before, it's a client component because it has onClick handlers
import type { Tables } from '@/lib/database.types';
import TaskItem from './TaskItem';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { StepWithDetails } from '@/lib/types'; // Import from our new types file

type StepItemProps = {
  step: StepWithDetails;
  onSelect: (step: StepWithDetails) => void;
  userJourneyId: string;
};

export default function StepItem({ step, onSelect, userJourneyId }: StepItemProps) {
  const hasGuidance = !!step.guidance_content;

  return (
    <div
      className={`pl-6 py-4 border-l ml-6 transition-colors ${hasGuidance ? 'border-primary cursor-pointer hover:bg-slate-700/50 rounded-r-lg' : 'border-slate-700'}`}
      onClick={() => hasGuidance && onSelect(step)}
    >
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-semibold text-slate-200">{step.title}</h3>
        {hasGuidance && (
          <InformationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} className="text-primary" title="Guidance available" />
        )}
      </div>
      <div className="flex flex-col">
        {step.tasks.map((task) => (
          <TaskItem key={task.id} task={task} userJourneyId={userJourneyId} />
        ))}
      </div>
    </div>
  );
}