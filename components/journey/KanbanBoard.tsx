// components/journey/KanbanBoard.tsx
'use client';

import { useState, useMemo, useTransition } from 'react';
import type { TaskWithStatus } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { KanbanTaskCard } from './KanbanTaskCard';
import { updateTaskStatus } from '@/actions/journey';
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/solid';

type KanbanBoardProps = {
  tasks: TaskWithStatus[];
  userJourneyId: string;
  stepId: string;
  stepTitle: string;
};

export function KanbanBoard({ tasks, userJourneyId, stepId, stepTitle }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<TaskWithStatus | null>(null);
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  
  const columns = useMemo(() => [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ], []);

  const tasksByStatus = useMemo(() => {
    const tasksWithMockPriority = tasks.map((t, i) => ({ ...t, priority: i % 2 === 0 ? 'High' : 'Medium' }));
    return {
      todo: tasksWithMockPriority.filter(t => t.status === 'todo'),
      inprogress: tasksWithMockPriority.filter(t => t.status === 'inprogress'),
      done: tasksWithMockPriority.filter(t => t.status === 'done'),
    };
  }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') setActiveTask(event.active.data.current.task);
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const overId = over.data.current?.type === 'Column' ? over.id : over.data.current?.sortable?.containerId;
    if (!overId) return;

    const task = active.data.current?.task as TaskWithStatus;
    if (task && task.status !== overId) {
       startTransition(() => { updateTaskStatus(userJourneyId, stepId, task.id, overId as any); });
    }
  }

  return (
    <div className="flex h-full flex-col bg-workspace p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{stepTitle}</h1>
          <p className="text-text-medium">Conduct structured interviews with potential customers to validate your assumptions and gather insights about their pain points and needs.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button onClick={() => setView('list')} className={`rounded-md p-1.5 transition-colors ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
            <Bars3Icon className="h-5 w-5"/>
          </button>
           <button onClick={() => setView('kanban')} className={`rounded-md p-1.5 transition-colors ${view === 'kanban' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
            <Squares2X2Icon className="h-5 w-5"/>
          </button>
        </div>
      </div>
      <div className="mb-2 h-1 w-full rounded-full bg-border">
          <div className="h-1 w-1/3 rounded-full bg-primary" />
      </div>
      <p className="mb-4 text-sm text-text-medium">2 of 6 tasks complete</p>
      <div className="flex flex-grow gap-5 overflow-x-auto">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={`${col.title} (${tasksByStatus[col.id as keyof typeof tasksByStatus].length})`}
                tasks={tasksByStatus[col.id as keyof typeof tasksByStatus]}
              />
            ))}
          <DragOverlay>{activeTask && <KanbanTaskCard task={activeTask} />}</DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}