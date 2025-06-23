// app/journey/[journeyId]/[stepId]/page.tsx
import StepWorkspace from '@/components/journey/StepWorkspace';
import { saveUserInput } from '@/actions/journey';

// This type definition was already correct, but the function signature was not.
type StepPageProps = {
  params: {
    journeyId: string;
    stepId: string;
  };
};

// CORRECTED: 'async' is not needed here as there are no 'await' calls inside.
export default function StepPage({ params }: StepPageProps) {
  // CORRECTED: Access params directly without 'await'
  const { journeyId, stepId } = params;

  return (
    <StepWorkspace 
      journeyId={journeyId} 
      stepId={stepId} 
      saveAction={saveUserInput} 
    />
  );
}
