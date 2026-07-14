'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input, Label, Button } from '@/components/ui/Form';

export default function RegisterPage() {
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch {
      // handled in context
    } finally {
      setSubmitting(false);
    }
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
          <h1 className="font-display text-xl font-bold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink/50">
            New accounts start as Team Members. An admin can promote you later.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Full name</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Rivera" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </div>

            {error && <p className="rounded-lg bg-clay-400/10 px-3 py-2 text-sm text-clay-500">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ink/50">
            Already have an account?{' '}
            <Link href="/" className="font-medium text-flow-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
