// components/journey/GuidancePanel.tsx
'use client';

// Local type for guidance content, matching your DB fields
export type GuidanceContent = {
  id: string;
  strategic_rationale?: string | null;
  actionable_how_to?: string | null;
  founder_wisdom_pitfalls?: string | null;
  key_questions?: string[] | null;
};
import { XMarkIcon } from '@heroicons/react/24/solid';

type GuidancePanelProps = {
  guidance: GuidanceContent;
  onClose: () => void;
};

export default function GuidancePanel({ guidance, onClose }: GuidancePanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Evo Perspective</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          {guidance.strategic_rationale && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-300 mb-2">Strategic Rationale (The "Why")</h3>
              <p className="text-slate-400">{guidance.strategic_rationale}</p>
            </div>
          )}
          {guidance.actionable_how_to && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-300 mb-2">Actionable How-To (The "How")</h3>
              <p className="text-slate-400 whitespace-pre-line">{guidance.actionable_how_to}</p>
            </div>
          )}
          {guidance.founder_wisdom_pitfalls && (
            <div className="mb-6 p-4 bg-slate-800 border border-yellow-500/30 rounded-lg">
              <h3 className="font-semibold text-yellow-400 mb-2">Founder Wisdom & Pitfalls</h3>
              <p className="text-slate-400">{guidance.founder_wisdom_pitfalls}</p>
            </div>
          )}
          {guidance.key_questions && guidance.key_questions.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-300 mb-2">Key Questions to Ask Yourself</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                {guidance.key_questions.map((q: string, index: number) => (
                  <li key={index}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
