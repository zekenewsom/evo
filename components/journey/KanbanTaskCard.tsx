// components/journey/KanbanTaskCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskWithStatus } from '@/lib/types';
import { ClockIcon, CheckCircleIcon as CheckOutline } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

export function KanbanTaskCard({ task }: { task: TaskWithStatus & { priority?: string } }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'Task', task } });
    const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, };

    const priorityClasses: { [key: string]: string } = {
        'High': 'bg-warning-light text-warning',
        'Medium': 'bg-blue-100 text-blue-600',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-neutral-100">
            <h4 className="font-semibold text-neutral-900">{task.title}</h4>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {task.priority && (
                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${priorityClasses[task.priority] || 'bg-neutral-100 text-neutral-600'}`}>
                            {task.priority} Priority
                        </span>
                    )}
                </div>
                {task.status === 'done' ? (
                     <span className="flex items-center gap-1 text-xs text-success-600">
                        <CheckSolid className="h-4 w-4" />
                        Completed
                    </span>
                ) : (
                    <div className="flex items-center gap-2">
                         <span className="mt-1 text-sm text-neutral-400">0/10</span>
                         <div className="h-1 w-14 rounded-full bg-neutral-200">
                            <div className="h-1 w-1/2 rounded-full bg-primary-600" />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}