'use client';

import { useEffect, useState, FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Task, Comment, User } from '@/types';
import { Modal } from './Modal';
import { Avatar } from './Avatar';
import { StatusBadge, PriorityBadge } from './Badge';
import { Label, Select, Textarea, Button } from './ui/Form';

export function TaskDetailModal({
  taskId,
  onClose,
  onChanged,
  assignableUsers,
}: {
  taskId: string | null;
  onClose: () => void;
  onChanged: () => void;
  assignableUsers?: User[];
}) {
  const { user } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const isManager = user?.role === 'ADMIN' || (task && user?.id === task.project.managerId);

  function load() {
    if (!taskId) return;
    setLoading(true);
    Promise.all([
      api.get<{ task: Task }>(`/tasks/${taskId}`),
      api.get<{ comments: Comment[] }>(`/tasks/${taskId}/comments`),
    ])
      .then(([t, c]) => {
        setTask(t.task);
        setComments(c.comments);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [taskId]);

  async function updateField(data: Partial<{ status: string; priority: string; assigneeId: string | null }>) {
    if (!task) return;
    try {
      const res = await api.patch<{ task: Task }>(`/tasks/${task.id}`, data);
      setTask(res.task);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not update task');
    }
  }

  async function postComment(e: FormEvent) {
    e.preventDefault();
    if (!task || !newComment.trim()) return;
    setPosting(true);
    try {
      const res = await api.post<{ comment: Comment }>(`/tasks/${task.id}/comments`, { content: newComment });
      setComments((prev) => [...prev, res.comment]);
      setNewComment('');
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not post comment');
    } finally {
      setPosting(false);
    }
  }

  return (
    <Modal open={!!taskId} onClose={onClose} title={task?.title || 'Task'}>
      {loading || !task ? (
        <p className="text-sm text-ink/40">Loading…</p>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-ink/60">{task.description || 'No description provided.'}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={task.status} onChange={(e) => updateField({ status: e.target.value })}>
                <option value="TODO">To do</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="IN_REVIEW">In review</option>
                <option value="DONE">Done</option>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              {isManager ? (
                <Select value={task.priority} onChange={(e) => updateField({ priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              ) : (
                <div className="pt-1.5">
                  <PriorityBadge priority={task.priority} />
                </div>
              )}
            </div>
          </div>

          {isManager && assignableUsers && (
            <div>
              <Label>Assignee</Label>
              <Select
                value={task.assigneeId || ''}
                onChange={(e) => updateField({ assigneeId: e.target.value || null })}
              >
                <option value="">Unassigned</option>
                {assignableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-ink/40">
            <span>Created by {task.creator.name}</span>
            {task.dueDate && <span>· Due {new Date(task.dueDate).toLocaleDateString()}</span>}
          </div>

          <div className="border-t border-ink/8 pt-4">
            <h3 className="mb-3 text-sm font-semibold text-ink">Comments</h3>
            <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
              {comments.length === 0 && <p className="text-sm text-ink/40">No comments yet.</p>}
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2">
                  <Avatar name={c.author.name} color={c.author.avatarColor} size={26} />
                  <div className="min-w-0 flex-1 rounded-lg bg-ink/[0.03] px-3 py-2">
                    <p className="text-xs font-semibold text-ink">{c.author.name}</p>
                    <p className="text-sm text-ink/70">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={postComment} className="mt-3 flex gap-2">
              <Textarea
                rows={1}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment…"
                className="resize-none"
              />
              <Button type="submit" disabled={posting || !newComment.trim()}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </Modal>
  );
}
