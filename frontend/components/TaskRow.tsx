import { Task } from '@/types';
import { StatusBadge, PriorityBadge } from './Badge';
import { Avatar } from './Avatar';

export function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  const overdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';

  return (
    <button
      onClick={onClick}
      className="focus-ring flex w-full items-center gap-4 rounded-xl border border-ink/8 bg-white px-4 py-3 text-left transition-colors hover:bg-ink/[0.02]"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{task.title}</p>
        <p className="truncate text-xs text-ink/40">{task.project.name}</p>
      </div>
      <PriorityBadge priority={task.priority} />
      <StatusBadge status={task.status} />
      {task.dueDate && (
        <span className={`text-xs font-medium ${overdue ? 'text-clay-500' : 'text-ink/40'}`}>
          {overdue ? 'Overdue: ' : 'Due '}
          {new Date(task.dueDate).toLocaleDateString()}
        </span>
      )}
      {task.assignee ? (
        <Avatar name={task.assignee.name} color={task.assignee.avatarColor} size={28} />
      ) : (
        <span className="text-xs text-ink/30">Unassigned</span>
      )}
    </button>
  );
}
