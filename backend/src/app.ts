import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import dashboardRoutes from './routes/dashboard.routes';
import tmRoutes from './routes/tm.routes';          // <-- Handles /api/tm/projects
import tmTasksRoutes from './routes/tm-tasks.routes'; // <-- Handles /api/tm/tasks
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 500 
});
app.use('/api/auth', authLimiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ REGISTER BOTH TM ROUTES
app.use('/api/tm', tmRoutes);       // This fixes the /api/tm/projects 404 error!
app.use('/api/tm', tmTasksRoutes);  // This handles /api/tm/tasks and uploads

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;