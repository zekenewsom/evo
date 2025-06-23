// app/layout.tsx
import './globals.css';
import { AuthButton } from '@/components/AuthButton'; // Ensure AuthButton is updated
import Link from 'next/link';
import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Evo Journey Navigator',
  description: 'Your guided journey to startup success',
};

// Link to the "Inter" font family from Google Fonts
const fontLink = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href={fontLink} />
      </head>
      <body className="bg-background">
        <header className="w-full border-b border-border bg-sidebar">
          <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-6">
            <Link href="/" className="text-xl font-bold text-primary">
              Evo Journey Navigator
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-text-medium">Stage 2 of 6</span>
              <div className="h-5 w-px bg-border"></div>
              <button className="text-text-light transition-colors hover:text-text-DEFAULT">
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              <button className="text-text-light transition-colors hover:text-text-DEFAULT">
                <QuestionMarkCircleIcon className="h-5 w-5" />
              </button>
              <AuthButton />
            </div>
          </div>
        </header>
        {/* The main content area where our pages will be rendered */}
        <main className="h-[calc(100vh-65px)] w-full">
          {children}
        </main>
      </body>
    </html>
  );
}