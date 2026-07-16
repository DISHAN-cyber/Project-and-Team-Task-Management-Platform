import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create an interface for authenticated requests
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getTMProjects = async (req: Request, res: Response) => {
  try {
    // Cast req to AuthenticatedRequest to access user property
    const authenticatedReq = req as AuthenticatedRequest;
    const userId = authenticatedReq.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find all projects where this user is a member
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          where: { userId },
        },
        tasks: {
          where: { assigneeId: userId },
          select: { id: true, status: true },
        },
        manager: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match frontend needs
    const transformedProjects = projects.map((project: any) => {
      const myTasks = project.tasks;
      const completedTasks = myTasks.filter((task: any) => task.status === 'DONE');
      const userMember = project.members[0];

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status.toLowerCase(),
        progress: project.progress,
        myTasks: myTasks.length,
        completedTasks: completedTasks.length,
        dueDate: project.endDate ? project.endDate.toISOString().split('T')[0] : null,
        role: userMember?.role || 'Member',
        projectManager: project.manager?.name || 'Unknown',
      };
    });

    // Calculate stats
    const stats = {
      total: transformedProjects.length,
      active: transformedProjects.filter((p: any) => p.status === 'active').length,
      completed: transformedProjects.filter((p: any) => p.status === 'completed').length,
      upcoming: transformedProjects.filter((p: any) => p.status === 'planned').length,
      totalTasks: transformedProjects.reduce((acc: number, p: any) => acc + p.myTasks, 0),
    };

    res.json({
      success: true,
      data: {
        projects: transformedProjects,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching TM projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch projects',
    });
  }
};