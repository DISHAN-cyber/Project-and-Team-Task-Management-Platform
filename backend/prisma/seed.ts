import { PrismaClient, Role, ProjectStatus, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  
  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.dev' },
    update: {},
    create: {
      name: 'Ava Admin',
      email: 'admin@taskflow.dev',
      passwordHash,
      role: Role.ADMIN,
      avatarColor: '#7C3AED', // Purple
    },
  });

  const pm = await prisma.user.upsert({
    where: { email: 'pm@taskflow.dev' },
    update: {},
    create: {
      name: 'Priya Manager',
      email: 'pm@taskflow.dev',
      passwordHash,
      role: Role.PROJECT_MANAGER,
      avatarColor: '#0EA5E9', // Blue
    },
  });

  const member1 = await prisma.user.upsert({
    where: { email: 'member1@taskflow.dev' },
    update: {},
    create: {
      name: 'Malik Member',
      email: 'member1@taskflow.dev',
      passwordHash,
      role: Role.TEAM_MEMBER,
      avatarColor: '#16A34A', // Green
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'member2@taskflow.dev' },
    update: {},
    create: {
      name: 'Sofia Smith',
      email: 'member2@taskflow.dev',
      passwordHash,
      role: Role.TEAM_MEMBER,
      avatarColor: '#DB2777', // Pink
    },
  });

  console.log('✅ Users created');

  // 2. Create Projects
  const project1 = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'TaskFlow Website Relaunch',
      description: 'Redesign and rebuild the public marketing site with a new CMS.',
      status: ProjectStatus.ACTIVE,
      progress: 75,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-03-30'),
      managerId: pm.id,
      members: {
        create: [{ userId: member1.id }, { userId: member2.id }],
      },
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'seed-project-2' },
    update: {},
    create: {
      id: 'seed-project-2',
      name: 'Mobile App v2.0',
      description: 'Major update to the iOS and Android applications with new features.',
      status: ProjectStatus.ACTIVE,
      progress: 45,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-06-15'),
      managerId: pm.id,
      members: {
        create: [{ userId: member1.id }],
      },
    },
  });

  const project3 = await prisma.project.upsert({
    where: { id: 'seed-project-3' },
    update: {},
    create: {
      id: 'seed-project-3',
      name: 'E-Commerce Platform',
      description: 'Build a new online store with payment integration.',
      status: ProjectStatus.PLANNED,
      progress: 0,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-09-30'),
      managerId: pm.id,
      members: {
        create: [], // No members assigned yet
      },
    },
  });

  console.log('✅ Projects created');

  // 3. Create Tasks for Malik in Project 1 (5 tasks: 3 DONE, 1 IN_PROGRESS, 1 TODO)
  await prisma.task.createMany({
    data: [
      {
        title: 'Design homepage mockup',
        description: 'Create wireframes and high-fidelity designs',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-03-15'),
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Create user flow diagrams',
        description: 'Map out user journeys for the new site',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2026-02-20'),
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Design contact page',
        description: 'Create contact and support page layouts',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        dueDate: new Date('2026-02-25'),
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Update style guide',
        description: 'Document new design system components',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2026-03-01'),
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Design mobile responsive layouts',
        description: 'Create mobile versions of all pages',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-03-20'),
        projectId: project1.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Create Tasks for Malik in Project 2 (3 tasks: 1 DONE, 1 IN_PROGRESS, 1 TODO)
  await prisma.task.createMany({
    data: [
      {
        title: 'Implement user authentication',
        description: 'Add login and registration features',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-04-15'),
        projectId: project2.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Build API integration',
        description: 'Connect frontend to backend APIs',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2026-04-01'),
        projectId: project2.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Fix navigation bug',
        description: 'Resolve menu issues on iOS',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date('2026-04-20'),
        projectId: project2.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Tasks created');
  console.log('🎉 Seed complete! Demo accounts (password: Password123!):');
  console.log('  Admin:          admin@taskflow.dev');
  console.log('  Project Manager: pm@taskflow.dev');
  console.log('  Team Member:     member1@taskflow.dev / member2@taskflow.dev');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });