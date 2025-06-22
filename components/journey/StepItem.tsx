'use client';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';
import type { StepWithDetails } from '@/lib/types';
import Link from 'next/link';

type StepItemProps = {
  step: StepWithDetails;
  userJourneyId: string;
};

// Removed onSelect from props as we will navigate instead
export default function StepItem({ step, userJourneyId }: StepItemProps) {
  const hasGuidance = !!step.guidance_content;

  return (
    // Wrap the entire component in a Link
    <Link 
      href={`/journey/${userJourneyId}/${step.id}`} 
      className="block"
    >
      <div
        className="pl-6 py-4 border-l ml-6 transition-colors border-slate-700 hover:bg-slate-700/50 rounded-r-lg cursor-pointer"
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
    </Link>
  );
}