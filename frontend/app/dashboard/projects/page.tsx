'use client';

import { useEffect, useState, FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Project } from '@/types';
import { ProjectCard } from '@/components/ProjectCard';
import { Modal } from '@/components/Modal';
import { Input, Label, Textarea, Select, Button } from '@/components/ui/Form';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PLANNED');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canCreate = user?.role === 'ADMIN' || user?.role === 'PROJECT_MANAGER';

  function load() {
    setLoading(true);
    api
      .get<{ projects: Project[] }>('/projects')
      .then((res) => setProjects(res.projects))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await api.post('/projects', { name, description, status });
      setOpen(false);
      setName('');
      setDescription('');
      setStatus('PLANNED');
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not create project');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink/50">
            {user?.role === 'TEAM_MEMBER' ? 'Projects you belong to.' : 'Projects you manage or oversee.'}
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setOpen(true)}>+ New project</Button>
        )}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink/40">Loading projects…</p>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-xl2 border border-dashed border-ink/15 p-10 text-center">
          <p className="font-display font-semibold text-ink">No projects yet</p>
          <p className="mt-1 text-sm text-ink/50">
            {canCreate ? 'Create your first project to start assigning tasks.' : 'You have not been added to a project yet.'}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Create a project">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Project name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Website Relaunch" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this project about?" />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PLANNED">Planned</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On hold</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
          {formError && <p className="rounded-lg bg-clay-400/10 px-3 py-2 text-sm text-clay-500">{formError}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create project'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
