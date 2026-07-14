export type Role = 'ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER';
export type ProjectStatus = 'PLANNED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  avatarColor: string;
  createdAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  joinedAt: string;
  user: Pick<User, 'id' | 'name' | 'email' | 'avatarColor' | 'role'>;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  managerId: string;
  manager: Pick<User, 'id' | 'name' | 'email' | 'avatarColor'>;
  members: ProjectMember[];
  _count: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  projectId: string;
  project: { id: string; name: string; managerId: string };
  assigneeId: string | null;
  assignee: Pick<User, 'id' | 'name' | 'email' | 'avatarColor'> | null;
  creatorId: string;
  creator: Pick<User, 'id' | 'name' | 'email' | 'avatarColor'>;
  _count: { comments: number };
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  taskId: string;
  author: Pick<User, 'id' | 'name' | 'avatarColor' | 'role'>;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string | null;
  createdAt: string;
  user: { name: string; avatarColor: string };
}

export interface DashboardSummary {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  tasksByStatus: { status: TaskStatus; _count: number }[];
  overdueTasks: number;
  recentActivity: ActivityLog[];
  totalUsers?: number;
}
