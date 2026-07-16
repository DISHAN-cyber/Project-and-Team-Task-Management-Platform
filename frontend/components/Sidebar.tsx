'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from './Avatar';
import { FiHome, FiFolder, FiCheckSquare, FiUsers, FiLogOut } from 'react-icons/fi';

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const roleLabel = user.role === 'ADMIN' ? 'Administrator' 
    : user.role === 'PROJECT_MANAGER' ? 'Project Manager' 
    : 'Team Member';

  // 🎯 Dynamic navigation based on user role
  const getNavItems = () => {
    // Normalize role to handle any format (e.g., "Project Manager" -> "PROJECT_MANAGER")
    const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
    
    if (normalizedRole === 'ADMIN') {
      return [
        { href: '/admin', label: 'Overview', icon: FiHome },
        { href: '/admin/projects', label: 'Projects', icon: FiFolder },
        { href: '/admin/tasks', label: 'My tasks', icon: FiCheckSquare },
        { href: '/admin/users', label: 'Team', icon: FiUsers },
      ];
    }
    
    if (normalizedRole === 'PROJECT_MANAGER') {
      return [
        { href: '/pm', label: 'Dashboard', icon: FiHome },
        { href: '/pm/projects', label: 'My Projects', icon: FiFolder },
        { href: '/pm/tasks', label: 'My Tasks', icon: FiCheckSquare },
      ];
    }
    
    if (normalizedRole === 'TEAM_MEMBER') {
      return [
        { href: '/tm', label: 'Dashboard', icon: FiHome },
        { href: '/tm/tasks', label: 'My Tasks', icon: FiCheckSquare },
        { href: '/tm/projects', label: 'My Projects', icon: FiFolder },
      ];
    }

    // Fallback
    return [
      { href: '/admin', label: 'Overview', icon: FiHome },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between bg-panel px-5 py-6">
      <div>
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2 px-1">
          <div className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-white/25" />
            <span className="h-2 w-2 rounded-full bg-flow-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-moss-400" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-white">TaskFlow</span>
        </div>

        {/* SYSTEM ROLE Card */}
        <div className="mb-6 rounded-lg bg-white/5 border border-white/10 px-4 py-3">
          <p className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase mb-0.5">System Role</p>
          <p className="text-sm font-semibold text-white">{roleLabel}</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            // Check if current path matches exactly OR starts with the href (for sub-pages)
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
        <Avatar name={user.name} color={user.avatarColor || 'bg-indigo-500'} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-white/50">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="focus-ring rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Sign out"
        >
          <FiLogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}