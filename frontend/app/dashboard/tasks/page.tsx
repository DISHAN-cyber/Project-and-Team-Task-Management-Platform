'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Task } from '@/types';
import { TaskRow } from '@/components/TaskRow';
import { TaskDetailModal } from '@/components/TaskDetailModal';

const filters = [
  { value: '', label: 'All' },
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'IN_REVIEW', label: 'In review' },
  { value: 'DONE', label: 'Done' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  function load() {
    setLoading(true);
    const qs = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get<{ tasks: Task[] }>(`/tasks${qs}`)
      .then((res) => setTasks(res.tasks))
      .finally(() => setLoading(false));
  }

  useEffect(load, [statusFilter]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">My tasks</h1>
      <p className="mt-1 text-sm text-ink/50">Everything assigned to you or under your management.</p>

      <div className="mt-5 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium ${
              statusFilter === f.value ? 'bg-ink text-white' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {loading && <p className="text-sm text-ink/40">Loading tasks…</p>}
        {!loading && tasks.length === 0 && <p className="text-sm text-ink/40">No tasks found.</p>}
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} onClick={() => setActiveTaskId(t.id)} />
        ))}
      </div>

      <TaskDetailModal taskId={activeTaskId} onClose={() => setActiveTaskId(null)} onChanged={load} />
    </div>
  );
}
