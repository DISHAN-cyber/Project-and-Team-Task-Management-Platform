'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input, Label, Button } from '@/components/ui/Form';

export default function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
    } catch {
      // error already set in context
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemo(role: 'admin' | 'pm' | 'member1') {
    setEmail(`${role}@taskflow.dev`);
    setPassword('Password123!');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-flow-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-moss-400" />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-ink">TaskFlow</span>
        </div>

        <div className="rounded-xl2 bg-white p-8 shadow-card">
          <h1 className="font-display text-xl font-bold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink/50">Sign in to see your projects and tasks.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="rounded-lg bg-clay-400/10 px-3 py-2 text-sm text-clay-500">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ink/50">
            No account?{' '}
            <Link href="/register" className="font-medium text-flow-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-6 rounded-xl2 border border-dashed border-ink/15 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/40">Try a demo account</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => fillDemo('admin')} className="focus-ring rounded-md bg-ink/5 px-2.5 py-1 text-xs font-medium hover:bg-ink/10">
              Admin
            </button>
            <button onClick={() => fillDemo('pm')} className="focus-ring rounded-md bg-ink/5 px-2.5 py-1 text-xs font-medium hover:bg-ink/10">
              Project Manager
            </button>
            <button onClick={() => fillDemo('member1')} className="focus-ring rounded-md bg-ink/5 px-2.5 py-1 text-xs font-medium hover:bg-ink/10">
              Team Member
            </button>
          </div>
          <p className="mt-2 text-xs text-ink/40">Password: Password123! (after running the seed script)</p>
        </div>
      </div>
    </main>
  );
}
