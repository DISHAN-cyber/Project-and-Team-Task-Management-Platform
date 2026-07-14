import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskFlow — Project & Team Task Management',
  description: 'Plan projects, assign work, and track progress across your team.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-surface text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
