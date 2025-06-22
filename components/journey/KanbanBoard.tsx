'use client';

import { useState, useMemo, useTransition } from 'react';
import type { TaskWithStatus } from '@/lib/types';
import KanbanColumn from './KanbanColumn';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import KanbanTaskCard from './KanbanTaskCard';
import { updateTaskStatus } from '@/actions/journey';

type KanbanBoardProps = {
  tasks: TaskWithStatus[];
  userJourneyId: string;
  stepId: string;
};

export default function KanbanBoard({ tasks, userJourneyId, stepId }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskWithStatus | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const columns = useMemo(() => [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ], []);

  const tasksByStatus = useMemo(() => {
    return {
      todo: tasks.filter(t => t.status === 'todo'),
      inprogress: tasks.filter(t => t.status === 'inprogress'),
      done: tasks.filter(t => t.status === 'done'),
    };
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px drag needed to start
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    const overColumnId = over.id.toString();
    const task = active.data.current?.task as TaskWithStatus;

    if (task && task.status !== overColumnId) {
       // Call server action to update the status
       startTransition(() => {
          updateTaskStatus(userJourneyId, stepId, task.id, overColumnId as any);
       });
    }
  }

  return (
    <div className="flex gap-6 overflow-x-auto h-full p-1">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={columns.map(c => c.id)}>
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasksByStatus[col.id as keyof typeof tasksByStatus]}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeTask && <KanbanTaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
