// components/journey/TaskItem.tsx
'use client';

import type { Tables } from '@/lib/database.types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTransition } from 'react';
import { updateTaskStatus } from '@/actions/journey'; // Corrected import

// Define a reusable icon component
const CircleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

type TaskWithStatus = Tables<'tasks'> & {
  status: string;
};

type TaskItemProps = {
  task: TaskWithStatus;
  userJourneyId: string;
  stepId: string;
};

export default function TaskItem({ task, userJourneyId, stepId }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = task.status === 'done';

  const handleToggle = () => {
    // If the task is already done, set it back to 'todo'. Otherwise, set it to 'done'.
    const newStatus = isCompleted ? 'todo' : 'done';
    startTransition(() => {
      // Use the new, correct server action with the right parameters
      updateTaskStatus(userJourneyId, stepId, task.id, newStatus);
    });
  };

  return (
    <div 
      onClick={handleToggle}
      className="flex items-center gap-3 py-2 cursor-pointer group"
    >
      {isCompleted ? (
        <CheckCircleIcon className="w-6 h-6 text-green-500" />
      ) : (
        <CircleIcon className="w-6 h-6 text-slate-500 group-hover:text-slate-300 transition-colors" />
      )}
      <p className={`transition-colors ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-slate-100'}`}>
        {task.title}
      </p>
      {isPending && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400 ml-auto"></div>}
    </div>
  );
}