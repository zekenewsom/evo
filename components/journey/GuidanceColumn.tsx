// components/journey/GuidanceColumn.tsx
'use client';

import type { Tables } from '@/lib/database.types';
import { XMarkIcon, LightBulbIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';

export function GuidanceColumn({ guidance, stepTitle }: { guidance: Tables<'guidance_content'> | null; stepTitle: string; }) {
  return (
    <div className="flex h-full flex-col border-l border-border bg-guidance">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <p className="text-sm font-semibold text-text-DEFAULT">Evo Guidance</p>
          <p className="text-sm text-text-light">{stepTitle}</p>
        </div>
        <button className="text-text-light transition-colors hover:text-text-DEFAULT"><XMarkIcon className="h-5 w-5" /></button>
      </div>

      <div className="flex-grow space-y-6 overflow-y-auto p-6">
        {guidance?.strategic_rationale && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-text">Why This Matters</h3>
            <p className="text-sm text-text-medium">{guidance.strategic_rationale}</p>
          </div>
        )}
        
        <div>
            <h3 className="mb-3 text-sm font-semibold text-text-DEFAULT">Key Actions</h3>
            <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-text-medium">
                    <LightBulbIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-DEFAULT" />
                    <span>Prepare open-ended questions that encourage storytelling.</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-text-medium">
                    <LightBulbIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-DEFAULT" />
                    <span>Focus on understanding problems, not selling solutions.</span>
                </li>
                 <li className="flex items-start gap-3 text-sm text-text-medium">
                    <LightBulbIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary-DEFAULT" />
                    <span>Record interviews for later analysis.</span>
                </li>
            </ul>
        </div>
        
        {guidance?.key_questions && (
            <div>
                <h3 className="mb-2 text-sm font-semibold text-text-DEFAULT">Reflection Questions</h3>
                <p className="text-sm text-text-medium">{guidance.key_questions[0]}</p>
            </div>
        )}

         <div>
            <h3 className="mb-3 text-sm font-semibold text-text-DEFAULT">Tools & Resources</h3>
             <div className="space-y-2">
                <button className="flex w-full items-center gap-2 rounded-md border border-border bg-panel p-2 text-left text-sm font-medium text-text-DEFAULT transition-colors hover:bg-gray-50">
                    <DocumentTextIcon className="h-5 w-5 text-primary-DEFAULT" />
                    Open Interview Template
                </button>
                 <button className="flex w-full items-center gap-2 rounded-md border border-border bg-panel p-2 text-left text-sm font-medium text-text-DEFAULT transition-colors hover:bg-gray-50">
                    <LinkIcon className="h-5 w-5 text-primary-DEFAULT" />
                    Read: Interview Best Practices
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}