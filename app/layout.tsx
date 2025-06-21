import './globals.css';
import AuthButton from '@/components/AuthButton';
import Link from 'next/link';

export const metadata = {
  title: 'Evo Platform',
  description: 'Your guided journey to startup success',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-slate-800 text-slate-100">
        <nav className="w-full border-b border-slate-700 bg-slate-900 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-focus transition-colors">
              Evo
            </Link>
            <AuthButton />
          </div>
        </nav>
        <main className="min-h-[calc(100vh-120px)] flex flex-col items-center py-8 px-4">
          {children}
        </main>
        <footer className="w-full border-t border-slate-700 p-8 flex justify-center text-center text-xs text-slate-400 bg-slate-900">
           <p>&copy; {new Date().getFullYear()} Evo - Your Entrepreneurial Co-Pilot</p>
        </footer>
      </body>
    </html>
  );
}
