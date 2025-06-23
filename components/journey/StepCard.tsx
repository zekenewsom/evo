import type { StepWithDetails } from '@/lib/types';
import Link from 'next/link';

export type StepCardProps = {
  step: StepWithDetails;
  userJourneyId: string;
  isSelected: boolean;
  onClick: () => void;
};

export default function StepCard({ step, userJourneyId, isSelected, onClick }: StepCardProps) {
  const statusClass = step.status === 'completed' ? 'opacity-60' : '';
  const selectedClass = isSelected ? 'border-primary shadow-lg' : 'border-slate-700';

  return (
    // This div handles the selection for the preview panel
    <div
      onClick={onClick}
      className={`p-4 bg-slate-800 rounded-lg border-2 cursor-pointer transition-all ${selectedClass} ${statusClass}`}
    >
      <h4 className="font-semibold text-slate-100">{step.title}</h4>
      <p className="text-xs text-slate-400 mt-1">
         {/* You can display task progress here */}
      </p>
      {isSelected && (
        // This Link handles the navigation to the full workspace page
        <Link
          href={`/journey/${userJourneyId}/${step.id}`}
          className="btn btn-primary btn-sm w-full mt-4"
        >
          Open Workspace
        </Link>
      )}
    </div>
  );
}
