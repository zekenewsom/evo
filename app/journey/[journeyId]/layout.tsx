// app/journey/[journeyId]/layout.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getJourneyForUser } from '@/lib/data';
import Link from 'next/link';
import { AuthButton } from '@/components/AuthButton';
import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

// Define the correct type for the props
type JourneyLayoutProps = {
  children: React.ReactNode;
  params: {
    journeyId: string;
  };
};

// The function is async, and we now await params as required by the Next.js runtime
export default async function JourneyLayout({ children, params }: JourneyLayoutProps) {
  // CORRECTED: 'await' is used here to satisfy the Next.js runtime
  const { journeyId } = await params; 
  
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const journeyData = await getJourneyForUser(supabase, journeyId, user.id);
  
  let currentStageIndex = 0;
  let totalStages = 0;

  if (journeyData) {
    totalStages = journeyData.stages.length;
    const firstIncompleteStageIndex = journeyData.stages.findIndex(
      stage => (stage.completionPercentage ?? 0) < 100
    );
    currentStageIndex = firstIncompleteStageIndex === -1 ? totalStages - 1 : firstIncompleteStageIndex;
  }
  
  return (
    <div className="flex h-screen flex-col">
        <header className="w-full border-b border-border bg-sidebar flex-shrink-0">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <Link href="/" className="text-xl font-bold text-primary">
              Evo Journey Navigator
            </Link>
            <div className="flex items-center gap-4">
              {journeyData && (
                <span className="text-sm font-medium text-text-medium">
                  Stage {currentStageIndex + 1} of {totalStages}
                </span>
              )}
              <div className="h-5 w-px bg-border"></div>
              <button className="text-text-light transition-colors hover:text-text">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button className="text-text-light transition-colors hover:text-text">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
              <AuthButton />
            </div>
          </div>
        </header>
        <div className="flex-grow overflow-hidden">
            {children}
        </div>
    </div>
  );
}