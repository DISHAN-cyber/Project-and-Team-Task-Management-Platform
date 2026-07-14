import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    // Only used when an Admin creates a user; self-registration always becomes TEAM_MEMBER
    role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Project name must be at least 2 characters'),
    description: z.string().optional(),
    status: z.enum(['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
    startDate: z.string().datetime().optional().or(z.literal('')),
    endDate: z.string().datetime().optional().or(z.literal('')),
    memberIds: z.array(z.string().uuid()).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['PLANNED', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED']).optional(),
    startDate: z.string().datetime().optional().or(z.literal('')),
    endDate: z.string().datetime().optional().or(z.literal('')),
    managerId: z.string().uuid().optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, 'Task title must be at least 2 characters'),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().datetime().optional().or(z.literal('')),
    assigneeId: z.string().uuid().optional().nullable(),
    projectId: z.string().uuid(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    description: z.string().optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().datetime().optional().or(z.literal('')),
    assigneeId: z.string().uuid().optional().nullable(),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
  }),
});
