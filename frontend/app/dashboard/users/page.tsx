'use client';

import { useEffect, useState, FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { User } from '@/types';
import { Avatar } from '@/components/Avatar';
import { RoleBadge } from '@/components/Badge';
import { Modal } from '@/components/Modal';
import { Input, Label, Select, Button } from '@/components/ui/Form';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  function load() {
    setLoading(true);
    api
      .get<{ users: User[] }>('/users')
      .then((res) => setUsers(res.users))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function changeRole(id: string, role: string) {
    await api.patch(`/users/${id}`, { role });
    load();
  }

  async function toggleActive(id: string, isActive: boolean) {
    await api.patch(`/users/${id}`, { isActive: !isActive });
    load();
  }

  async function removeUser(id: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Team</h1>
          <p className="mt-1 text-sm text-ink/50">Manage user accounts, roles, and access.</p>
        </div>
        <Button onClick={() => setOpen(true)}>+ New user</Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl2 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/[0.03] text-xs uppercase tracking-wide text-ink/40">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {loading && (
              <tr>
                <td className="px-4 py-4 text-ink/40" colSpan={4}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading &&
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} color={u.avatarColor} size={30} />
                      <div>
                        <p className="font-medium text-ink">{u.name}</p>
                        <p className="text-xs text-ink/40">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {u.id === currentUser?.id ? (
                      <RoleBadge role={u.role} />
                    ) : (
                      <Select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="w-auto py-1"
                      >
                        <option value="ADMIN">Administrator</option>
                        <option value="PROJECT_MANAGER">Project Manager</option>
                        <option value="TEAM_MEMBER">Team Member</option>
                      </Select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.isActive ? 'bg-moss-400/15 text-moss-500' : 'bg-ink/5 text-ink/40'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUser?.id && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleActive(u.id, u.isActive)}
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-ink/50 hover:bg-ink/5"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => removeUser(u.id)}
                          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-clay-500 hover:bg-clay-400/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <CreateUserModal open={open} onClose={() => setOpen(false)} onCreated={load} />
    </div>
  );
}

function CreateUserModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEAM_MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/users', { name, email, password, role });
      setName('');
      setEmail('');
      setPassword('');
      setRole('TEAM_MEMBER');
      onClose();
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create user');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create a user">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label>Temporary password</Label>
          <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <Label>Role</Label>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="TEAM_MEMBER">Team Member</option>
            <option value="PROJECT_MANAGER">Project Manager</option>
            <option value="ADMIN">Administrator</option>
          </Select>
        </div>
        {error && <p className="rounded-lg bg-clay-400/10 px-3 py-2 text-sm text-clay-500">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create user'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
