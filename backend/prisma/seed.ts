import { PrismaClient, Role, TaskStatus, TaskPriority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.dev' },
    update: {},
    create: {
      name: 'Ava Admin',
      email: 'admin@taskflow.dev',
      passwordHash,
      role: Role.ADMIN,
      avatarColor: '#7C3AED',
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
      avatarColor: '#0EA5E9',
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
      avatarColor: '#16A34A',
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
      avatarColor: '#DB2777',
    },
  });

  const project = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      name: 'TaskFlow Website Relaunch',
      description: 'Redesign and rebuild the public marketing site with a new CMS.',
      status: 'ACTIVE',
      startDate: new Date(),
      managerId: pm.id,
      members: {
        create: [{ userId: member1.id }, { userId: member2.id }, { userId: pm.id }],
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up CMS schema',
        description: 'Define content types for pages, blog posts, and authors.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        projectId: project.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
      {
        title: 'Design homepage wireframes',
        description: 'Low-fidelity wireframes for desktop and mobile.',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        projectId: project.id,
        assigneeId: member2.id,
        creatorId: pm.id,
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'GitHub Actions for lint, test, and build validation.',
        status: TaskStatus.DONE,
        priority: TaskPriority.LOW,
        projectId: project.id,
        assigneeId: member1.id,
        creatorId: pm.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed complete. Demo accounts (password: Password123!):');
  console.log(' Admin:          admin@taskflow.dev');
  console.log(' Project Manager: pm@taskflow.dev');
  console.log(' Team Member:     member1@taskflow.dev / member2@taskflow.dev');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
