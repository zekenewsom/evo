'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStepDetailsForUser } from '@/lib/data';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { StepDetailsForWorkspace } from '@/lib/data';

type PanelProps = { userJourneyId: string; selectedStepId: string | null; };

export default function StepSummaryPanel({ userJourneyId, selectedStepId }: PanelProps) {
    const [details, setDetails] = useState<StepDetailsForWorkspace | null>(null);
    const [loading, setLoading] = useState(false);
    const supabase = createSupabaseBrowserClient();

    useEffect(() => {
        if (!selectedStepId) { setDetails(null); return; }
        const fetchDetails = async () => {
            setLoading(true);
            // Use existing data-fetching function
            const data = await getStepDetailsForUser(supabase, userJourneyId, selectedStepId);
            setDetails(data);
            setLoading(false);
        };
        fetchDetails();
    }, [selectedStepId, userJourneyId, supabase]);

    if (!selectedStepId) {
        return <div className="p-6 bg-slate-900 rounded-lg h-full flex items-center justify-center text-slate-400">Select a step to see a summary.</div>;
    }
    if (loading) {
        return <div className="p-6 bg-slate-900 rounded-lg h-full flex items-center justify-center text-slate-400">Loading…</div>;
    }
    if (!details) {
        return <div className="p-6 bg-slate-900 rounded-lg h-full flex items-center justify-center text-slate-400">No details found for this step.</div>;
    }

    return (
        <div className="bg-slate-900 p-6 rounded-lg h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-1">{details.title}</h2>
            <Link href={`/journey/${userJourneyId}/${details.id}`} className="link link-accent text-sm mb-4 inline-block">
                Go to Full Workspace →
            </Link>
            {details.guidance_content && details.guidance_content.strategic_rationale && (
                <div className="mb-4">
                    <h3 className="font-semibold text-slate-200 mb-1">Strategic Rationale</h3>
                    <div className="text-slate-300 text-sm whitespace-pre-line">{details.guidance_content.strategic_rationale}</div>
                </div>
            )}
            {details.tasks && details.tasks.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-slate-200 mb-1">Key Actions</h3>
                    <ul className="list-disc pl-5 text-slate-300 text-sm">
                        {details.tasks.map(task => (
                            <li key={task.id}>{task.title}</li>
                        ))}
                    </ul>
                </div>
            )}
            {details.guidance_content?.key_questions && details.guidance_content.key_questions.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold text-slate-200 mb-1">Key Questions</h3>
                    <ul className="list-disc pl-5 text-slate-300 text-sm">
                        {details.guidance_content.key_questions.map((q, i) => (
                            <li key={i}>{q}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
