import { TaskStatus, TaskPriority, ProjectStatus, Role } from '@/types';

const statusStyles: Record<TaskStatus, string> = {
  TODO: 'bg-ink/5 text-ink/70',
  IN_PROGRESS: 'bg-flow-100 text-flow-700',
  IN_REVIEW: 'bg-amber-400/15 text-amber-500',
  DONE: 'bg-moss-400/15 text-moss-500',
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  DONE: 'Done',
};

const priorityStyles: Record<TaskPriority, string> = {
  LOW: 'bg-ink/5 text-ink/60',
  MEDIUM: 'bg-flow-100 text-flow-700',
  HIGH: 'bg-amber-400/15 text-amber-500',
  URGENT: 'bg-clay-400/15 text-clay-500',
};

const projectStatusStyles: Record<ProjectStatus, string> = {
  PLANNED: 'bg-ink/5 text-ink/60',
  ACTIVE: 'bg-moss-400/15 text-moss-500',
  ON_HOLD: 'bg-amber-400/15 text-amber-500',
  COMPLETED: 'bg-flow-100 text-flow-700',
  ARCHIVED: 'bg-ink/5 text-ink/40',
};

const roleLabels: Record<Role, string> = {
  ADMIN: 'Administrator',
  PROJECT_MANAGER: 'Project Manager',
  TEAM_MEMBER: 'Team Member',
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[priority]}`}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </span>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${projectStatusStyles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
    </span>
  );
}

export function RoleBadge({ role }: { role: Role }) {
  const styles: Record<Role, string> = {
    ADMIN: 'bg-clay-400/15 text-clay-500',
    PROJECT_MANAGER: 'bg-flow-100 text-flow-700',
    TEAM_MEMBER: 'bg-moss-400/15 text-moss-500',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[role]}`}>
      {roleLabels[role]}
    </span>
  );
}
