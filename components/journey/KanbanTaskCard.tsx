'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskWithStatus } from '@/lib/types';

type KanbanTaskCardProps = {
  task: TaskWithStatus;
};

export default function KanbanTaskCard({ task }: KanbanTaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-slate-800 p-4 rounded-lg shadow-md border border-slate-700 touch-none"
        >
            <p className="font-semibold text-slate-100">{task.title}</p>
            {/* Future placeholders for priority tags, progress, etc. */}
        </div>
    );
}
