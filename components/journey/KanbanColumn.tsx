'use client';

import { SortableContext, useSortable } from '@dnd-kit/sortable';
import type { TaskWithStatus } from '@/lib/types';
import KanbanTaskCard from './KanbanTaskCard';
import { useMemo } from 'react';

type KanbanColumnProps = {
  id: string;
  title: string;
  tasks: TaskWithStatus[];
};

export default function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: 'Column',
    },
  });

  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-full min-w-[300px] max-w-[320px] bg-slate-800/50 rounded-lg p-3 gap-4"
    >
      <h3 className="font-bold text-slate-300 px-1">{title}</h3>
      <div className="flex flex-col gap-3 flex-grow">
        <SortableContext items={taskIds}>
          {tasks.map(task => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
