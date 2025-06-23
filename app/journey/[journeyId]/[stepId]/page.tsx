// app/journey/[journeyId]/[stepId]/page.tsx
import StepWorkspace from '@/components/journey/StepWorkspace';
import { saveUserInput } from '@/actions/journey';

type StepPageProps = {
  params: Promise<{
    journeyId: string;
    stepId: string;
  }>;
};

export default async function StepPage({ params }: StepPageProps) {
  const { journeyId, stepId } = await params;

  return (
    <StepWorkspace 
      journeyId={journeyId} 
      stepId={stepId} 
      saveAction={saveUserInput} 
    />
  );
}
