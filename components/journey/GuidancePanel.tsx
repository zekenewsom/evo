// components/journey/GuidancePanel.tsx (Corrected)
'use client';

import type { Tables } from '@/lib/database.types'; // Use generated types
import { XMarkIcon } from '@heroicons/react/24/solid';

type GuidancePanelProps = {
  guidance: Tables<'guidance_content'>; // Use the real type
  onClose: () => void;
};

export default function GuidancePanel({ guidance, onClose }: GuidancePanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Evo Perspective</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
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
                {guidance.key_questions.map((q, index) => (
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