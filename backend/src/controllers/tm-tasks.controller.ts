import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

// Interface for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// GET /api/tm/tasks - Get all tasks assigned to the team member
export const getTMTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        files: {
          orderBy: {
            uploadedAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform tasks for frontend
    const transformedTasks = tasks.map((task: any) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status.toLowerCase(),
      priority: task.priority.toLowerCase(),
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
      projectId: task.project.id,
      projectName: task.project.name,
      assignedBy: task.creator.name,
      files: task.files.map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        url: file.url,
        uploadedAt: file.uploadedAt,
      })),
    }));

    // Calculate stats
    const stats = {
      total: transformedTasks.length,
      inProgress: transformedTasks.filter((t: any) => t.status === 'in_progress').length,
      completed: transformedTasks.filter((t: any) => t.status === 'done').length,
      highPriority: transformedTasks.filter((t: any) => t.priority === 'high').length,
    };

    res.json({
      success: true,
      data: {
        tasks: transformedTasks,
        stats,
      },
    });
  } catch (error) {
    console.error('Error fetching TM tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks',
    });
  }
};

// POST /api/tm/tasks/:taskId/upload - Upload files to a task
export const uploadTaskFiles = async (req: Request, res: Response) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    // Save file metadata to database
    const createdFiles = await Promise.all(
      files.map(async (file: any) => {
        const fileUrl = `/uploads/${path.basename(file.path)}`;
        
        return prisma.taskFile.create({
          data: {
            name: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
            url: fileUrl,
            taskId,
            uploadedById: userId,
          },
        });
      })
    );

    res.json({
      success: true,
      data: {
        files: createdFiles.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType,
          url: f.url,
          uploadedAt: f.uploadedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload files',
    });
  }
};

// DELETE /api/tm/tasks/:taskId/files/:fileId - Delete a file
export const deleteTaskFile = async (req: Request, res: Response) => {
  try {
    const { taskId, fileId } = req.params;

    await prisma.taskFile.delete({
      where: {
        id: fileId,
        taskId: taskId,
      },
    });

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete file',
    });
  }
};