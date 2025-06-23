// components/journey/KanbanColumn.tsx
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { TaskWithStatus } from '@/lib/types';
import { KanbanTaskCard } from './KanbanTaskCard';
import { useMemo } from 'react';

export function KanbanColumn({ id, title, tasks }: { id: string; title: string; tasks: TaskWithStatus[] }) {
  // Include type metadata so the drag handlers can
  // differentiate between dropping on a column vs. a task
  const { setNodeRef } = useDroppable({
    id,
    data: { type: 'Column' },
  });
  const taskIds = useMemo(() => tasks.map(t => t.id), [tasks]);

  return (
    <div className="flex w-80 flex-shrink-0 flex-col gap-4">
      <h3 className="font-semibold text-text-DEFAULT px-1">{title}</h3>
      <div ref={setNodeRef} className="flex flex-col gap-4 flex-grow rounded-md bg-transparent p-1">
        <SortableContext items={taskIds}>
          {tasks.map(task => (
            <KanbanTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}