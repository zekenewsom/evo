// components/journey/KanbanBoard.tsx
'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { TaskWithStatus } from '@/lib/types';
import { KanbanColumn } from './KanbanColumn';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { KanbanTaskCard } from './KanbanTaskCard';
import { updateTaskStatus } from '@/actions/journey';
import { Squares2X2Icon, Bars3Icon } from '@heroicons/react/24/solid';

type KanbanBoardProps = {
  tasks: TaskWithStatus[];
  userJourneyId: string;
  stepId: string;
  stepTitle: string;
};

type TaskStatus = 'todo' | 'inprogress' | 'done';

// Helper function to normalize task status
function normalizeTaskStatus(status: string): TaskStatus {
  if (status === 'done') return 'done';
  if (status === 'inprogress') return 'inprogress';
  return 'todo'; // Default for 'todo', 'not_started', or any other status
}

export function KanbanBoard({ tasks: initialTasks, userJourneyId, stepId, stepTitle }: KanbanBoardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeTask, setActiveTask] = useState<TaskWithStatus | null>(null);
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const columns = useMemo(() => [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ], []);

  const tasksByStatus = useMemo(() => {
    const tasksWithMockPriority = tasks.map((t, i) => ({ ...t, priority: i % 2 === 0 ? 'High' : 'Medium' }));
    
    return columns.reduce((acc, col) => {
        acc[col.id as TaskStatus] = tasksWithMockPriority.filter(task => {
            const normalizedStatus = normalizeTaskStatus(task.status);
            return normalizedStatus === col.id;
        });
        return acc;
    }, {} as Record<TaskStatus, (TaskWithStatus & { priority?: string })[]>);
  }, [tasks, columns]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeTask = active.data.current?.task as TaskWithStatus;
    const overId = over.data.current?.type === 'Column' ? over.id : over.data.current?.sortable?.containerId;

    if (!activeTask || !overId) return;

    const originalStatus = normalizeTaskStatus(activeTask.status);
    const newStatus = overId as TaskStatus;

    if (originalStatus === newStatus) return;

    setTasks(currentTasks => currentTasks.map(t => 
        t.id === activeTask.id ? { ...t, status: newStatus } : t
    ));

    startTransition(() => {
      updateTaskStatus(userJourneyId, stepId, activeTask.id, newStatus);
    });
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => normalizeTaskStatus(t.status) === 'done').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex h-full flex-col bg-workspace p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{stepTitle}</h1>
          <p className="text-text-medium">Conduct structured interviews with potential customers to validate your assumptions and gather insights about their pain points and needs.</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          <button onClick={() => setView('list')} className={`rounded-md p-1.5 transition-colors flex items-center gap-2 ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
            <Bars3Icon className="h-5 w-5"/>
          </button>
          <button onClick={() => setView('kanban')} className={`rounded-md p-1.5 transition-colors flex items-center gap-2 ${view === 'kanban' ? 'bg-white text-primary shadow-sm' : 'text-text-light hover:text-text'}`}>
            <Squares2X2Icon className="h-5 w-5"/>
          </button>
        </div>
      </div>
      <div className="mb-2 h-1 w-full rounded-full bg-border">
        <div className="h-1 rounded-full bg-primary" style={{ width: `${progressPercentage}%` }} />
      </div>
      <p className="mb-4 text-sm text-text-medium">{completedTasks} of {totalTasks} tasks complete</p>
      {view === 'list' ? (
        <div className="w-full max-w-2xl mx-auto space-y-3">
          {tasks.map(task => {
            const t = task as TaskWithStatus & { description?: string };
            const isSelected = selectedTaskId === t.id;
            const normalizedStatus = normalizeTaskStatus(t.status);
            const isInProgress = normalizedStatus === 'inprogress';
            const isCompleted = normalizedStatus === 'done';
            return (
              <div
                key={t.id}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all shadow-sm bg-white ${isSelected ? 'border-primary/70 bg-primary/5' : 'border-slate-200'} ${isCompleted ? 'opacity-70' : ''}`}
                onClick={() => setSelectedTaskId(t.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const newStatus = isCompleted ? 'todo' : 'done';
                      setTasks(currentTasks => currentTasks.map(ct =>
                        ct.id === t.id ? { ...ct, status: newStatus } : ct
                      ));
                      startTransition(() => {
                        updateTaskStatus(userJourneyId, stepId, t.id, newStatus);
                      });
                    }}
                    className={`w-5 h-5 flex items-center justify-center rounded border-2 ${isCompleted ? 'border-primary bg-primary' : 'border-slate-300 bg-white'} transition-colors`}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    )}
                  </button>
                  <div>
                    <div className={`font-medium text-base text-slate-900`}>{t.title}</div>
                    {t.description && (
                      <div className="text-xs text-slate-500">
                        {t.description}
                      </div>
                    )}
                  </div>
                </div>
                {isInProgress && (
                  <span className="ml-4 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">In Progress</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-grow gap-5 overflow-x-auto">
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetection={closestCorners}>
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={`${col.title} (${tasksByStatus[col.id as TaskStatus]?.length || 0})`}
                tasks={tasksByStatus[col.id as TaskStatus] || []}
              />
            ))}
            <DragOverlay>{activeTask && <KanbanTaskCard task={activeTask} />}</DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}