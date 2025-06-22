// components/journey/StageCard.tsx
'use client';
import StepItem from './StepItem';
import type { StageWithDetails } from '@/lib/types';






// A new component for the progress circle
const ProgressCircle = ({ percentage }: { percentage: number }) => {
    const strokeWidth = 4;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg className="w-10 h-10 transform -rotate-90">
            <circle
                className="text-slate-700"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="20"
                cy="20"
            />
            <circle
                className="text-primary"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="20"
                cy="20"
            />
        </svg>
    );
};

type StageCardProps = {
  stage: StageWithDetails & { completionPercentage: number }; // Add new prop
  userJourneyId: string;
};

export default function StageCard({ stage, userJourneyId }: StageCardProps) {
  // Determine the visual state based on progress
  const borderClass = stage.completionPercentage === 100 ? 'border-green-500' : 'border-slate-700';

    return (
        <div
        className={`flex flex-col w-80 flex-shrink-0 bg-slate-800 rounded-lg border-2 shadow-lg transition-all ${borderClass}`}
        >
        <div className="flex items-center p-4 border-b border-slate-700">
            <div className="flex-shrink-0 w-10 h-10 mr-3 relative">
                <ProgressCircle percentage={stage.completionPercentage} />
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-300">
                    {Math.round(stage.completionPercentage)}%
                </span>
            </div>
            <div className="flex-grow">
            <h2 className="text-xl font-bold text-slate-100">{stage.title}</h2>
            </div>
        </div>
        <div className="p-4 flex-grow">
            <p className="text-slate-400 text-sm mb-4">{stage.objective}</p>
            <div className="space-y-2">
                {stage.steps.map((step) => (
                    <StepItem key={step.id} step={step} userJourneyId={userJourneyId} />
                ))}
            </div>
        </div>
        </div>
    );
}