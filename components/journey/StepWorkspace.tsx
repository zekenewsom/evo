// components/journey/StepWorkspace.tsx (Refactored)
'use client';
import { useState, useEffect } from 'react';
import { getStepDetailsForUser } from '@/lib/data';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { StepWithDetails } from '@/lib/types';
import TaskItem from './TaskItem';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

// NOTE: You may need to import useFormStatus from 'react-dom' if you use it
// For simplicity, we'll use a local pending state here.
import { useTransition } from 'react';

type StepWorkspaceProps = {
  journeyId: string;
  stepId: string;
  saveAction: (formData: FormData) => Promise<{ success?: boolean; error?: string; message?: string }>;
};

export default function StepWorkspace({ journeyId, stepId, saveAction }: StepWorkspaceProps) {
  const [stepData, setStepData] = useState<(StepWithDetails & { userInput: string | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const fetchStepData = async () => {
      setLoading(true);
      const data = await getStepDetailsForUser(supabase, journeyId, stepId);
      setStepData(data);
      setLoading(false);
    };
    fetchStepData();
  }, [supabase, journeyId, stepId]);

  if (loading) {
    return <div className="text-center p-8">Loading workspace...</div>;
  }

  if (!stepData) {
    return <div className="text-center p-8">Could not load step data.</div>;
  }

  return (
    <div>
      <Link href={`/journey/${journeyId}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-4">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Journey Overview
      </Link>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-slate-800 rounded-lg"><h1 className="text-3xl font-bold">{stepData.title}</h1></div>
          <div className="p-6 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Action Items</h2>
            {stepData.tasks.map(task => (
              <TaskItem key={task.id} task={task} userJourneyId={journeyId} />
            ))}
          </div>
          <div className="p-6 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">My Notes & Reflections</h2>
            <form action={saveAction as any}>
              <input type="hidden" name="journeyId" value={journeyId} />
              <input type="hidden" name="stepId" value={stepId} />
              <textarea
                name="inputContent"
                className="textarea textarea-bordered w-full h-48 bg-slate-700"
                placeholder="Jot down your thoughts..."
                defaultValue={stepData.userInput || ''}
              />
              <div className="flex justify-end items-center mt-4">
                <button type="submit" disabled={isPending} className="btn btn-secondary">
                  {isPending ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden lg:block">
          {stepData.guidance_content && (
            <div className="sticky top-6 bg-slate-900 rounded-lg shadow-lg">
              <div className="p-6 border-b border-slate-800"><h2 className="text-xl font-bold text-primary">Evo Perspective</h2></div>
              <div className="p-6 h-[calc(100vh-10rem)] overflow-y-auto space-y-6">
                {stepData.guidance_content.strategic_rationale && (
                  <div>
                    <h3 className="font-semibold text-slate-300 mb-2">The "Why"</h3>
                    <p className="text-slate-400">{stepData.guidance_content.strategic_rationale}</p>
                  </div>
                )}
                {stepData.guidance_content.actionable_how_to && (
                  <div>
                    <h3 className="font-semibold text-slate-300 mb-2">The "How"</h3>
                    <p className="text-slate-400 whitespace-pre-line">{stepData.guidance_content.actionable_how_to}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}