// components/journey/GuidanceColumn.tsx
'use client';

import type { Tables } from '@/lib/database.types';
import type { ResourceLink as ResourceLinkType, ResourceLinks } from '@/lib/types';
import { XMarkIcon, LightBulbIcon, DocumentTextIcon, LinkIcon, BeakerIcon } from '@heroicons/react/24/outline';

// A helper to render different resource link types
const ResourceLink = ({ link }: { link: ResourceLinkType }) => {
  const Icon = link.type === 'template' ? DocumentTextIcon : LinkIcon;
  return (
    <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex w-full items-center gap-2 rounded-md border border-border bg-panel p-2 text-left text-sm font-medium text-text transition-colors hover:bg-gray-50"
    >
        <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
        <span>{link.text}</span>
    </a>
  );
};

export function GuidanceColumn({ guidance, stepTitle }: { guidance: Tables<'guidance_content'> | null; stepTitle: string; }) {
  // Safely cast the JSON 'resource_links' to our new type
  const resourceLinks = guidance?.resource_links as ResourceLinks | null;

  return (
    <div className="flex h-full flex-col border-l border-border bg-guidance">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-border p-4">
        <div>
          <p className="text-sm font-semibold text-text">Evo Guidance</p>
          <p className="text-sm text-text-light">{stepTitle}</p>
        </div>
        <button className="text-text-light transition-colors hover:text-text"><XMarkIcon className="h-5 w-5" /></button>
      </div>

      {/* Content */}
      <div className="flex-grow space-y-6 overflow-y-auto p-6">
        {!guidance ? (
            <div className="text-center text-sm text-text-light">
                <p>No guidance available for this step.</p>
            </div>
        ) : (
            <>
                {guidance.strategic_rationale && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text"><LightBulbIcon className="h-4 w-4"/> Why This Matters</h3>
                    <p className="text-sm text-text-medium">{guidance.strategic_rationale}</p>
                  </div>
                )}
                
                {guidance.actionable_how_to && (
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text"><BeakerIcon className="h-4 w-4"/> Key Actions</h3>
                    <div className="prose prose-sm text-text-medium" dangerouslySetInnerHTML={{ __html: guidance.actionable_how_to }} />
                  </div>
                )}
                
                {guidance.key_questions && guidance.key_questions.length > 0 && (
                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-text">Reflection Questions</h3>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-text-medium">
                            {guidance.key_questions.map((q, i) => <li key={i}>{q}</li>)}
                        </ul>
                    </div>
                )}

                {resourceLinks?.links && resourceLinks.links.length > 0 && (
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-text">Tools & Resources</h3>
                         <div className="space-y-2">
                            {resourceLinks.links.map((link, i) => <ResourceLink key={i} link={link} />)}
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}