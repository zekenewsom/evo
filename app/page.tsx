import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-4xl mx-auto text-center p-8 bg-slate-800 rounded-lg shadow-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-100 mb-4">
          Go from <span className="text-primary">Idea</span> to{' '}
          <span className="text-secondary">Revenue</span>.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
          Evo provides the guided journey, intelligent tools, and expert support you
          need to build and launch your SaaS venture successfully.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start Your Journey
          </Link>
          <Link href="/login" className="btn btn-ghost btn-lg">
            Log In
          </Link>
        </div>

        <div className="mt-16 w-full p-8 bg-slate-700/50 rounded-lg border border-slate-600">
          <h2 className="text-2xl font-bold mb-4">Your Founder&apos;s Operating System</h2>
          <p className="text-slate-400">
            Stop guessing, start building. We provide the structured path so you can focus on what
            matters most.
          </p>
        </div>
      </div>
    </div>
  );
}
