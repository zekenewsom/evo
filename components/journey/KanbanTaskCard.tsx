// components/journey/KanbanTaskCard.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskWithStatus } from '@/lib/types';
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

export function KanbanTaskCard({ task }: { task: TaskWithStatus & { priority?: string } }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { type: 'Task', task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const priorityClasses: { [key: string]: string } = {
        'High': 'bg-warning-light text-amber-700', // Adjusted for new palette
        'Medium': 'bg-primary-light text-primary', // Adjusted for new palette
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-none rounded-lg border border-border bg-white p-4 shadow-panel"
        >
            <h4 className="font-semibold text-text">{task.title}</h4>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {task.priority && (
                        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${priorityClasses[task.priority] || 'bg-gray-100 text-gray-600'}`}>
                            {task.priority}
                        </span>
                    )}
                </div>
                {task.status === 'done' ? (
                     <span className="flex items-center gap-1 text-xs text-success font-medium">
                        <CheckSolid className="h-4 w-4" />
                        Completed
                    </span>
                ) : (
                    // Placeholder for future sub-task progress
                    <div className="flex items-center gap-2">
                         <span className="text-sm text-text-light"></span>
                         <div className="h-1 w-14 rounded-full bg-transparent">
                            <div className="h-1 w-0 rounded-full bg-primary" />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}