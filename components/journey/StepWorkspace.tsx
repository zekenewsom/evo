'use client';
import { useState } from 'react';
import { StepDetailsForWorkspace } from '@/lib/data';
import TaskItem from './TaskItem';
import GuidancePanel from './GuidancePanel';
import { ArrowLeftIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface StepWorkspaceProps {
  journeyId: string;
  stepId: string;
  stepData: StepDetailsForWorkspace;
}

export default function StepWorkspace({ journeyId, stepId, stepData }: StepWorkspaceProps) {
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const hasGuidance = !!stepData.guidance_content;

  return (
    <div>
      {/* Breadcrumbs at the top */}
      <div className="text-sm breadcrumbs text-slate-400 mb-4">
        <ul>
          <li><Link href={`/journey/${journeyId}`} className="hover:text-primary">Journey</Link></li>
          <li>{stepData.stageTitle}</li>
          <li>{stepData.title}</li>
        </ul>
      </div>
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
          <textarea
            name="inputContent"
            className="textarea textarea-bordered w-full h-48 bg-slate-700"
            placeholder="Jot down your thoughts, research findings, and next steps..."
            defaultValue={stepData.userInput || ''}
            readOnly
          />
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