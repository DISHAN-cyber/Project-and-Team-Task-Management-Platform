'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Project, Task, User } from '@/types';
import { ProjectStatusBadge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { TaskRow } from '@/components/TaskRow';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { Modal } from '@/components/Modal';
import { Input, Label, Textarea, Select, Button } from '@/components/ui/Form';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const isManager = user?.role === 'ADMIN' || (project && user?.id === project.managerId);

  function load() {
    setLoading(true);
    Promise.all([
      api.get<{ project: Project }>(`/projects/${id}`),
      api.get<{ tasks: Task[] }>(`/tasks?projectId=${id}`),
    ])
      .then(([p, t]) => {
        setProject(p.project);
        setTasks(t.tasks);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER') {
      api.get<{ users: User[] }>('/users').then((res) => setAllUsers(res.users));
    }
  }, [user]);

  if (loading || !project) {
    return <p className="text-sm text-ink/40">Loading project…</p>;
  }

  const memberIds = new Set(project.members.map((m) => m.userId));
  const availableToAdd = allUsers.filter((u) => !memberIds.has(u.id) && u.id !== project.managerId);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-ink">{project.name}</h1>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="mt-1 max-w-2xl text-sm text-ink/50">{project.description}</p>
        </div>
        {isManager && <Button onClick={() => setTaskModalOpen(true)}>+ New task</Button>}
      </div>

      <div className="mt-6 flex items-center gap-6 rounded-xl2 bg-white p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">Manager</span>
          <Avatar name={project.manager.name} color={project.manager.avatarColor} size={26} />
          <span className="text-sm text-ink/70">{project.manager.name}</span>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/40">Team</span>
          <div className="flex -space-x-2">
            {project.members.map((m) => (
              <div key={m.id} className="ring-2 ring-white rounded-full">
                <Avatar name={m.user.name} color={m.user.avatarColor} size={26} />
              </div>
            ))}
          </div>
          {isManager && (
            <button
              onClick={() => setMemberModalOpen(true)}
              className="focus-ring ml-2 rounded-full border border-dashed border-ink/20 px-2 py-0.5 text-xs text-ink/50 hover:bg-ink/5"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      <h2 className="mt-8 mb-3 font-display text-base font-bold text-ink">Tasks ({tasks.length})</h2>
      <div className="space-y-2">
        {tasks.length === 0 && <p className="text-sm text-ink/40">No tasks yet in this project.</p>}
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} onClick={() => setActiveTaskId(t.id)} />
        ))}
      </div>

      <TaskDetailModal
        taskId={activeTaskId}
        onClose={() => setActiveTaskId(null)}
        onChanged={load}
        assignableUsers={[project.manager, ...project.members.map((m) => m.user)] as User[]}
      />

      {isManager && (
        <CreateTaskModal
          open={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          projectId={project.id}
          assignableUsers={[project.manager, ...project.members.map((m) => m.user)] as User[]}
          onCreated={load}
        />
      )}

      {isManager && (
        <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add a team member">
          <div className="space-y-2">
            {availableToAdd.length === 0 && <p className="text-sm text-ink/40">Everyone is already on this project.</p>}
            {availableToAdd.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border border-ink/8 px-3 py-2">
                <div className="flex items-center gap-2">
                  <Avatar name={u.name} color={u.avatarColor} size={26} />
                  <span className="text-sm text-ink">{u.name}</span>
                </div>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await api.post(`/projects/${project.id}/members`, { userId: u.id });
                    load();
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function CreateTaskModal({
  open,
  onClose,
  projectId,
  assignableUsers,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string;
  assignableUsers: User[];
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/tasks', {
        title,
        description,
        priority,
        projectId,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssigneeId('');
      setDueDate('');
      onClose();
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create task');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a task">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Design the homepage" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Priority</Label>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </Select>
          </div>
          <div>
            <Label>Due date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Assignee</Label>
          <Select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
            <option value="">Unassigned</option>
            {assignableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </div>
        {error && <p className="rounded-lg bg-clay-400/10 px-3 py-2 text-sm text-clay-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
