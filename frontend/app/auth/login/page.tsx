'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input, Label, Button } from '@/components/ui/Form';

export default function LoginPage() {
  const { login, error } = useAuth();
  const [email, setEmail] = useState('admin@taskflow.dev');
  const [password, setPassword] = useState('Password123!');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      // 👇  LINE to force redirect to the new Admin route
      window.location.href = '/admin';
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
    <div className="h-screen w-full flex overflow-hidden bg-slate-50">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 p-6 xl:p-10 flex-col justify-between">
        {/* Top Logo */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="h-2 w-2 rounded-full bg-slate-800" />
          </div>
          <span className="font-semibold text-slate-900 text-sm">TaskFlow Workspace</span>
        </div>

        {/* Main Content */}
        <div className="max-w-lg">
          <p className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-2">
            PROJECT & TEAM TASK MANAGEMENT
          </p>
          <h1 className="text-2xl xl:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Manage projects, teams, and progress from one secure workspace.
          </h1>
          <p className="text-xs xl:text-sm text-slate-600 leading-relaxed">
            A cleaner login experience for administrators, project managers, and team members to start work faster.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 text-xs mb-0.5">Role-based access</h3>
            <p className="text-xs text-slate-500 leading-tight">Dedicated dashboards for every user type.</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 text-xs mb-0.5">Secure sign in</h3>
            <p className="text-xs text-slate-500 leading-tight">Protected access for projects and tasks.</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-slate-900 text-xs mb-0.5">Live productivity</h3>
            <p className="text-xs text-slate-500 leading-tight">Track progress, teams, and workload instantly.</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-slate-50">
        <div className="w-full max-w-md space-y-3">
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-indigo-600 font-semibold text-xs mb-1">Welcome back</p>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Sign in to TaskFlow</h2>
              </div>
              <button className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm mb-4">
              Continue to your workspace and manage projects, tasks, and collaboration in one place.
            </p>

            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <Label className="text-slate-700 font-medium text-xs sm:text-sm mb-1 block">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="admin@taskflow.dev"
                    className="pl-9 h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-slate-700 font-medium text-xs sm:text-sm">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 h-10 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="text-slate-600">Remember this device</span>
                </label>
                <span className="text-slate-400 text-xs">Trusted workspace</span>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs sm:text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors text-sm"
              >
                {submitting ? 'Signing in…' : (
                  <>
                    Sign in
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-xs sm:text-sm text-slate-500 mt-4">
              No account?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create one
              </Link>
            </p>
          </div>

          {/* Quick Access Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Quick Access</p>
                <p className="text-xs sm:text-sm font-medium text-slate-700">Try a demo account</p>
              </div>
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button 
                onClick={() => fillDemo('admin')} 
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
              >
                <span className="text-xs font-medium text-slate-700">Admin</span>
              </button>
              <button 
                onClick={() => fillDemo('pm')} 
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
              >
                <span className="text-xs font-medium text-slate-700">Project Manager</span>
              </button>
              <button 
                onClick={() => fillDemo('member1')} 
                className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center"
              >
                <span className="text-xs font-medium text-slate-700">Team Member</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Password: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">Password123!</code> (after running the seed script)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}