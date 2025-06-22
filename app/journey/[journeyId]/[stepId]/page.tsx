// app/journey/[journeyId]/[stepId]/page.tsx (Refactored)
import StepWorkspace from '@/components/journey/StepWorkspace';
import { saveUserInput } from '@/actions/journey';

type StepPageProps = {
  params: {
    journeyId: string;
    stepId: string;
  };
};

export default function StepPage({ params }: StepPageProps) {
  // We pass the Server Action down as a prop to the Client Component
  return (
    <StepWorkspace 
      journeyId={params.journeyId} 
      stepId={params.stepId} 
      saveAction={saveUserInput} 
    />
  );
}