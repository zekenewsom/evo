// components/journey/JourneyNavigator.tsx (Refactored for Roadmap View)
'use client';
import StageCard from './StageCard';
import type { JourneyData } from '@/lib/types';

type JourneyNavigatorProps = {
  journeyData: JourneyData;
  userJourneyId: string;
};

export default function JourneyNavigator({ journeyData, userJourneyId }: JourneyNavigatorProps) {
  if (!journeyData || !journeyData.stages) {
    return <p>No journey data available.</p>;
  }

  return (
    <div className="flex items-start p-4 space-x-8 overflow-x-auto">
      {journeyData.stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center">
          {/* Render the Stage Node */}
          <StageCard
            stage={stage}
            userJourneyId={userJourneyId}
          />
          {/* Render a connector line, but not after the last stage */}
          {index < journeyData.stages.length - 1 && (
            <div className="w-16 h-1 bg-slate-700 mx-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}