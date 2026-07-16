'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { FiFolder, FiClock, FiCheckCircle, FiAlertCircle, FiCalendar, FiUsers } from 'react-icons/fi';

// Mock TM-specific projects data (ONLY projects assigned to THIS team member)
const mockTMProjects = [
  {
    id: 'tm-proj1',
    name: 'TaskFlow Website Relaunch',
    description: 'Redesign and rebuild the public marketing site with a new CMS.',
    status: 'active',
    progress: 75,
    role: 'Designer',
    tasksAssigned: 5,
    tasksCompleted: 3,
    dueDate: 'Mar 30, 2026',
    projectManager: 'Priya Manager',
    teamMembers: [
      { name: 'Malik Member', initials: 'MM', color: 'bg-green-500' },
      { name: 'Sofia Smith', initials: 'SS', color: 'bg-pink-500' },
    ],
  },
  {
    id: 'tm-proj2',
    name: 'Mobile App v2.0',
    description: 'Major update to the iOS and Android applications with new features.',
    status: 'active',
    progress: 45,
    role: 'Developer',
    tasksAssigned: 8,
    tasksCompleted: 2,
    dueDate: 'Jun 15, 2026',
    projectManager: 'Priya Manager',
    teamMembers: [
      { name: 'Malik Member', initials: 'MM', color: 'bg-green-500' },
    ],
  },
  {
    id: 'tm-proj3',
    name: 'E-Commerce Platform',
    description: 'Build a new online store with payment integration.',
    status: 'upcoming',
    progress: 0,
    role: 'Developer',
    tasksAssigned: 0,
    tasksCompleted: 0,
    dueDate: 'Sep 30, 2026',
    projectManager: 'Priya Manager',
    teamMembers: [],
  },
];

export default function TMProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [projects, setProjects] = useState(mockTMProjects);

  // RBAC Protection - Only Team Members can access
  useEffect(() => {
    if (!loading && user) {
      const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
      if (normalizedRole !== 'TEAM_MEMBER') {
        if (normalizedRole === 'PROJECT_MANAGER') {
          router.replace('/pm/projects');
        } else if (normalizedRole === 'ADMIN') {
          router.replace('/admin/projects');
        }
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.status === activeFilter;
  });

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    upcoming: projects.filter(p => p.status === 'upcoming').length,
    totalTasks: projects.reduce((acc, curr) => acc + curr.tasksAssigned, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Projects</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Projects you are contributing to.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>MY PROJECTS</p>
            <FiFolder className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Assigned to me</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ACTIVE</p>
            <FiClock className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.active}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>In progress</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>MY TASKS</p>
            <FiCheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.totalTasks}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across all projects</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UPCOMING</p>
            <FiAlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.upcoming}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Starting soon</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All', count: projects.length },
            { id: 'active', label: 'Active', count: stats.active },
            { id: 'completed', label: 'Completed', count: stats.completed },
            { id: 'upcoming', label: 'Upcoming', count: stats.upcoming },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-indigo-600 text-white'
                  : `${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className={`group rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
                      {project.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {project.description}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Progress</span>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.progress}%</span>
                  </div>
                  <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-2 overflow-hidden`}>
                    <div 
                      className={`h-2 rounded-full transition-all ${project.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                      style={{ width: `${project.progress}%` }} 
                    />
                  </div>
                </div>

                {/* Task Stats */}
                <div className={`grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>My Tasks</p>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.tasksAssigned}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed</p>
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.tasksCompleted}</p>
                  </div>
                </div>

                {/* Footer Info */}
                <div className={`pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'} space-y-3`}>
                  {/* Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center -space-x-2">
                      {project.teamMembers.slice(0, 3).map((member, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${member.color} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-white text-[10px] font-bold`} title={member.name}>
                          {member.initials}
                        </div>
                      ))}
                      {project.teamMembers.length === 0 && (
                        <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-[10px]`}>
                          ?
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
                      {project.role}
                    </span>
                  </div>

                  {/* PM & Due Date */}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <FiUsers className="w-3 h-3" /> {project.projectManager}
                    </span>
                    <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <FiCalendar className="w-3 h-3" /> {project.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <FiFolder className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No projects found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}