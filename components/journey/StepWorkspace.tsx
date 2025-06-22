'use client';
import { useState, useEffect } from 'react';
import { getStepDetailsForUser } from '@/lib/data';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { StepWithDetails } from '@/lib/types';
import TaskItem from './TaskItem';
import GuidancePanel from './GuidancePanel'; // We will use the slide-out panel
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type StepWorkspaceProps = {
  journeyId: string;
  stepId: string;
  saveAction: (formData: FormData) => Promise<{ success?: boolean; error?: string; message?: string; }>;
};

export default function StepWorkspace({ journeyId, stepId, saveAction }: StepWorkspaceProps) {
  const [stepData, setStepData] = useState<(StepWithDetails & { userInput: string | null; }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false); // State for the panel
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

  if (loading) { return <div className="text-center p-8">Loading workspace...</div>; }
  if (!stepData) { return <div className="text-center p-8">Could not load step data.</div>; }

  const hasGuidance = !!stepData.guidance_content;

  return (
    <div>
      <Link href={`/journey/${journeyId}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-4">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Journey Overview
      </Link>

      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 bg-slate-800 rounded-lg flex justify-between items-center">
          <h1 className="text-3xl font-bold">{stepData.title}</h1>
          {hasGuidance && (
            <button 
              onClick={() => setIsGuidanceOpen(true)} 
              className="btn btn-outline btn-primary btn-sm"
            >
              <InformationCircleIcon className="w-5 h-5" />
              View Guidance
            </button>
          )}
        </div>

        <div className="p-6 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Action Items</h2>
          {stepData.tasks.map(task => (
            <TaskItem key={task.id} task={task} userJourneyId={journeyId} stepId={stepId} />
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
              placeholder="Jot down your thoughts, research findings, and next steps..."
              defaultValue={stepData.userInput || ''}
            />
            <div className="flex justify-end items-center mt-4">
              <button type="submit" className="btn btn-secondary">
                Save Notes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Conditionally render the slide-out GuidancePanel */}
      {hasGuidance && isGuidanceOpen && (
        <GuidancePanel
          guidance={stepData.guidance_content!}
          onClose={() => setIsGuidanceOpen(false)}
        />
      )}
    </div>
  );
}