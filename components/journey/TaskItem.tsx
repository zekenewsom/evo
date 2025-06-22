import type { Tables } from '@/lib/database.types';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

type TaskItemProps = {
  task: Tables<'tasks'>;
};

export default function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <CheckCircleIcon className="w-3 h-3 text-slate-500" width={12} height={12} />
      <p className="text-slate-300">{task.title}</p>
    </div>
  );
}
