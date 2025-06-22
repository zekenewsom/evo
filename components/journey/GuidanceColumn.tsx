'use client';

import type { Tables } from '@/lib/database.types';

type GuidanceColumnProps = {
  guidance: Tables<'guidance_content'> | null;
};

export default function GuidanceColumn({ guidance }: GuidanceColumnProps) {
  if (!guidance) {
    return (
      <div className="flex flex-col h-full p-6 items-center justify-center text-center">
        <h3 className="font-semibold text-slate-300">No Guidance Available</h3>
        <p className="text-sm text-slate-400">This step does not have associated guidance content.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-primary">Evo Guidance</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {guidance.strategic_rationale && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-300 mb-2">Why This Matters</h3>
            <p className="text-slate-400 text-sm prose">{guidance.strategic_rationale}</p>
          </div>
        )}
        {guidance.actionable_how_to && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-300 mb-2">Key Actions</h3>
            <div className="text-slate-400 text-sm prose whitespace-pre-line">{guidance.actionable_how_to}</div>
          </div>
        )}
        {guidance.key_questions && guidance.key_questions.length > 0 && (
           <div className="mb-6">
            <h3 className="font-semibold text-slate-300 mb-2">Reflection Questions</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
              {guidance.key_questions.map((q, index) => (
                <li key={index}>{q}</li>
              ))}
            </ul>
          </div>
        )}
        {guidance.founder_wisdom_pitfalls && (
          <div className="p-4 bg-slate-800 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Common Pitfalls</h3>
            <p className="text-slate-400 text-sm prose">{guidance.founder_wisdom_pitfalls}</p>
          </div>
        )}
      </div>
    </div>
  );
}
