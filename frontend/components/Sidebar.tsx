'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from './Avatar';

const navItems = [
  { href: '/dashboard', label: 'Overview', roles: ['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'] },
  { href: '/dashboard/projects', label: 'Projects', roles: ['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'] },
  { href: '/dashboard/tasks', label: 'My tasks', roles: ['ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER'] },
  { href: '/dashboard/users', label: 'Team', roles: ['ADMIN'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between bg-panel px-5 py-6">
      <div>
        <div className="mb-8 flex items-center gap-2 px-1">
          {/* Signature: a four-dot flow rail representing TODO -> IN_PROGRESS -> IN_REVIEW -> DONE */}
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-flow-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-moss-400" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">TaskFlow</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems
            .filter((item) => item.roles.includes(user.role))
            .map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`focus-ring rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <Avatar name={user.name} color={user.avatarColor} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-white/50">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
