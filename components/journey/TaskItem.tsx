import type { Tables } from '@/lib/database.types';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

type TaskItemProps = {
  task: Tables<'tasks'>;
};

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* FIX: Using inline style for guaranteed sizing */}
      <CheckCircleIcon className="text-slate-500" style={{ width: '1.25rem', height: '1.25rem' }} />
      <p className="text-slate-300">{task.title}</p>
    </div>
  );
}
