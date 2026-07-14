import Link from 'next/link';
import { Project } from '@/types';
import { ProjectStatusBadge } from './Badge';
import { Avatar } from './Avatar';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="focus-ring block rounded-xl2 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display font-bold text-ink">{project.name}</h3>
        <ProjectStatusBadge status={project.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-ink/50">{project.description || 'No description yet.'}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((m) => (
            <div key={m.id} className="ring-2 ring-white rounded-full">
              <Avatar name={m.user.name} color={m.user.avatarColor} size={26} />
            </div>
          ))}
        </div>
        <span className="text-xs font-medium text-ink/40">{project._count.tasks} tasks</span>
      </div>
    </Link>
  );
}
