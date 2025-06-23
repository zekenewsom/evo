// app/journey/[journeyId]/[stepId]/page.tsx
import StepWorkspaceServer from '@/components/journey/StepWorkspaceServer';

type StepPageProps = {
  params: Promise<{
    journeyId: string;
    stepId: string;
  }>;
};

export default async function StepPage({ params }: StepPageProps) {
  const { journeyId, stepId } = await params;

  return (
    <StepWorkspaceServer 
      journeyId={journeyId} 
      stepId={stepId} 
    />
  );
}
