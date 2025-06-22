// components/journey/StepWorkspace.tsx (New File)
import type { StepWithDetails } from '@/lib/types';
import TaskItem from './TaskItem';
import GuidancePanel from './GuidancePanel';
import { saveUserInput } from '@/app/actions/journey';
import StepNotesInput from './StepNotesInput';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

type StepWorkspaceProps = {
  initialStepData: StepWithDetails & { userInput: string | null };
  journeyId: string;
};

export default function StepWorkspace({ initialStepData, journeyId }: StepWorkspaceProps) {
  return (
    <div>
      <Link href={`/journey/${journeyId}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary mb-4">
        <ArrowLeftIcon className="w-4 h-4" />
        Back to Journey Overview
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Title */}
          <div className="p-6 bg-slate-800 rounded-lg">
            <h1 className="text-3xl font-bold">{initialStepData.title}</h1>
          </div>
          
          {/* Task List */}
          <div className="p-6 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Action Items</h2>
            {initialStepData.tasks.map(task => (
              <TaskItem key={task.id} task={task} userJourneyId={journeyId} />
            ))}
          </div>

          {/* User Input / Notes */}
          <div className="p-6 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-bold mb-4">My Notes & Reflections</h2>
            <form action={saveUserInput}>
              <input type="hidden" name="journeyId" value={journeyId} />
              <input type="hidden" name="stepId" value={initialStepData.id} />
              <StepNotesInput defaultValue={initialStepData.userInput || ''} />
              <div className="flex justify-end items-center mt-4">
                <button type="submit" className="btn btn-secondary">
                  Save Notes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Guidance Panel Column */}
        <div className="hidden lg:block">
          {initialStepData.guidance_content ? (
            // A simplified, non-sliding version for the workspace layout
            <div className="sticky top-6 bg-slate-900 rounded-lg shadow-lg">
               <div className="p-6 border-b border-slate-800">
                  <h2 className="text-xl font-bold text-primary">Evo Perspective</h2>
                </div>
                <div className="p-6 h-[calc(100vh-10rem)] overflow-y-auto">
                    {/* Simplified content rendering */}
                    <div className="space-y-6">
                        {initialStepData.guidance_content.strategic_rationale && (
                            <div>
                                <h3 className="font-semibold text-slate-300 mb-2">The "Why"</h3>
                                <p className="text-slate-400">{initialStepData.guidance_content.strategic_rationale}</p>
                            </div>
                        )}
                        {initialStepData.guidance_content.actionable_how_to && (
                            <div>
                                <h3 className="font-semibold text-slate-300 mb-2">The "How"</h3>
                                <p className="text-slate-400 whitespace-pre-line">{initialStepData.guidance_content.actionable_how_to}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          ) : (
            <div className="sticky top-6 p-6 bg-slate-800 rounded-lg text-center">
              <p className="text-slate-400">No specific guidance for this step.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
