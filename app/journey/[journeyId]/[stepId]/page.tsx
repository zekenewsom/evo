// app/journey/[journeyId]/[stepId]/page.tsx
import StepWorkspace from '@/components/journey/StepWorkspace';
import { saveUserInput } from '@/actions/journey';

type StepPageProps = {
  params: {
    journeyId: string;
    stepId: string;
  };
};

// The 'async' keyword is removed as it is not needed, and 'await' is removed from params.
export default function StepPage({ params }: StepPageProps) {
  // CORRECTED: The params object is directly available and should not be awaited.
  const { journeyId, stepId } = params;

  return (
    <StepWorkspace 
      journeyId={journeyId} 
      stepId={stepId} 
      saveAction={saveUserInput} 
    />
  );
}
