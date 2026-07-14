'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { DashboardSummary } from '@/types';
import { StatCard } from '@/components/StatCard';
import { Avatar } from '@/components/Avatar';

const statusLabel: Record<string, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  DONE: 'Done',
};

export default function DashboardHome() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardSummary>('/dashboard/summary')
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  const greeting = user?.role === 'ADMIN' ? 'System overview' : user?.role === 'PROJECT_MANAGER' ? 'Your projects' : 'Your work';

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-sm text-ink/50">{greeting} at a glance.</p>

      {loading || !summary ? (
        <p className="mt-8 text-sm text-ink/40">Loading dashboard…</p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Projects" value={summary.totalProjects} accent="flow" />
            <StatCard label="Active projects" value={summary.activeProjects} accent="moss" />
            <StatCard label="Tasks" value={summary.totalTasks} accent="amber" />
            <StatCard label="Overdue tasks" value={summary.overdueTasks} accent="clay" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-xl2 bg-white p-6 shadow-card">
              <h2 className="font-display text-base font-bold text-ink">Tasks by status</h2>
              <div className="mt-4 space-y-3">
                {summary.tasksByStatus.length === 0 && <p className="text-sm text-ink/40">No tasks yet.</p>}
                {summary.tasksByStatus.map((s) => (
                  <div key={s.status} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{statusLabel[s.status]}</span>
                    <span className="font-semibold text-ink">{s._count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 rounded-xl2 bg-white p-6 shadow-card">
              <h2 className="font-display text-base font-bold text-ink">Recent activity</h2>
              <div className="mt-4 space-y-4">
                {summary.recentActivity.length === 0 && <p className="text-sm text-ink/40">Nothing yet — go create a project.</p>}
                {summary.recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <Avatar name={a.user.name} color={a.user.avatarColor} size={28} />
                    <div className="min-w-0">
                      <p className="text-sm text-ink/80">
                        <span className="font-medium text-ink">{a.user.name}</span> — {a.action.replaceAll('_', ' ').toLowerCase()}
                        {a.details ? `: ${a.details}` : ''}
                      </p>
                      <p className="text-xs text-ink/40">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
