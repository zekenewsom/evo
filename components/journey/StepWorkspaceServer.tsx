import StepWorkspace from './StepWorkspace';
import { saveUserInput } from '@/actions/journey';
import { getStepDetailsForUser } from '@/lib/data';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface StepWorkspaceServerProps {
  journeyId: string;
  stepId: string;
}

export default async function StepWorkspaceServer({ journeyId, stepId }: StepWorkspaceServerProps) {
  const supabase = createSupabaseServerClient();
  const stepData = await getStepDetailsForUser(supabase, journeyId, stepId);

  if (!stepData) {
    return <div className="text-center p-8">Could not load step data.</div>;
  }

  return (
    <div>
      <StepWorkspace journeyId={journeyId} stepId={stepId} stepData={stepData} />
      <form action={saveUserInput} className="mt-6">
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
  );
} 