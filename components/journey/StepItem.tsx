'use client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';
import type { StepWithDetails } from '@/lib/types';
import Link from 'next/link';

type StepItemProps = {
  step: StepWithDetails;
  userJourneyId: string;
};

export default function StepItem({ step, userJourneyId }: StepItemProps) {
  const hasGuidance = !!step.guidance_content;

  return (
    <div className="pl-6 py-4 border-l ml-6 transition-colors border-slate-700 rounded-r-lg">
      <Link 
        href={`/journey/${userJourneyId}/${step.id}`} 
        className="block p-3 rounded-md hover:bg-slate-700/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-200">{step.title}</h3>
          {hasGuidance && (
            <InformationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} className="text-primary" title="Guidance available" />
          )}
        </div>
      </Link>

      <div className="flex flex-col mt-2">
        {step.tasks.map((task) => (
          <TaskItem key={task.id} task={task} userJourneyId={userJourneyId} stepId={step.id} />
        ))}
      </div>
     </div>
  );
}