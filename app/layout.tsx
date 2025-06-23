// app/layout.tsx
import './globals.css';

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
        {/* The main content area where our pages will be rendered.
            The header is now handled by specific layouts (e.g., app/journey/layout.tsx) */}
        <main className="h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}