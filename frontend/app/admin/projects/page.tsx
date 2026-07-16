'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  FiFolder, FiActivity, FiCheckCircle, FiClock, FiSearch, 
  FiPlus, FiX, FiCalendar, FiUsers, FiMoreHorizontal, FiEdit2, 
  FiTrash2, FiEye, FiGrid, FiList, FiChevronDown
} from 'react-icons/fi';

// Mock Data
const mockProjects = [
  {
    id: '1',
    name: 'TaskFlow Website Relaunch',
    description: 'Redesign and rebuild the public marketing site with a new CMS.',
    status: 'active',
    priority: 'high',
    progress: 75,
    projectManager: { name: 'Priya Manager', initials: 'PM', color: 'bg-blue-500' },
    teamMembers: [
      { name: 'Malik Member', initials: 'MM', color: 'bg-green-500' },
      { name: 'Sofia Smith', initials: 'SS', color: 'bg-pink-500' },
    ],
    startDate: 'Jan 15',
    endDate: 'Mar 30',
    tasksCount: 12,
  },
  {
    id: '2',
    name: 'Mobile App v2.0',
    description: 'Major update to the iOS and Android applications with new features.',
    status: 'active',
    priority: 'medium',
    progress: 45,
    projectManager: { name: 'Test PM', initials: 'TP', color: 'bg-indigo-500' },
    teamMembers: [
      { name: 'Malik Member', initials: 'MM', color: 'bg-green-500' },
    ],
    startDate: 'Feb 01',
    endDate: 'Jun 15',
    tasksCount: 24,
  },
  {
    id: '3',
    name: 'Internal Dashboard',
    description: 'Analytics dashboard for tracking internal KPIs and metrics.',
    status: 'completed',
    priority: 'low',
    progress: 100,
    projectManager: { name: 'Priya Manager', initials: 'PM', color: 'bg-blue-500' },
    teamMembers: [
      { name: 'Sofia Smith', initials: 'SS', color: 'bg-pink-500' },
    ],
    startDate: 'Oct 10',
    endDate: 'Dec 20',
    tasksCount: 8,
  },
  {
    id: '4',
    name: 'Customer Portal',
    description: 'Self-service portal for clients to manage their accounts.',
    status: 'upcoming',
    priority: 'high',
    progress: 0,
    projectManager: { name: 'Test PM', initials: 'TP', color: 'bg-indigo-500' },
    teamMembers: [],
    startDate: 'Apr 01',
    endDate: 'Aug 30',
    tasksCount: 0,
  },
];

const mockUsers = [
  { id: '1', name: 'Priya Manager', email: 'pm@taskflow.dev', initials: 'PM', color: 'bg-blue-500', role: 'PROJECT_MANAGER' },
  { id: '2', name: 'Malik Member', email: 'member1@taskflow.dev', initials: 'MM', color: 'bg-green-500', role: 'TEAM_MEMBER' },
  { id: '3', name: 'Sofia Smith', email: 'member2@taskflow.dev', initials: 'SS', color: 'bg-pink-500', role: 'TEAM_MEMBER' },
  { id: '4', name: 'Test PM', email: 'testpm@taskflow.dev', initials: 'TP', color: 'bg-indigo-500', role: 'PROJECT_MANAGER' },
];

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);

  // Form State
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'active',
    priority: 'medium',
    projectManager: '',
    teamMembers: [] as string[],
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  // Filter & Sort Logic
  const filteredProjects = mockProjects
    .filter((project) => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || project.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'oldest') return a.id.localeCompare(b.id);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'progress') return b.progress - a.progress;
      return 0;
    });

  // Stats Calculation
  const stats = {
    total: mockProjects.length,
    active: mockProjects.filter(p => p.status === 'active').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    upcoming: mockProjects.filter(p => p.status === 'upcoming').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'on_hold': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project:', newProject);
    alert(`Project "${newProject.name}" created successfully!`);
    setIsModalOpen(false);
    setNewProject({
      name: '',
      description: '',
      status: 'active',
      priority: 'medium',
      projectManager: '',
      teamMembers: [],
      startDate: '',
      endDate: '',
    });
  };

  const toggleTeamMember = (userId: string) => {
    setNewProject(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(userId)
        ? prev.teamMembers.filter(id => id !== userId)
        : [...prev.teamMembers, userId]
    }));
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Projects</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Projects you manage or oversee.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          New project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL PROJECTS</p>
            <FiFolder className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across all departments</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ACTIVE NOW</p>
            <FiActivity className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.active}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>In progress this week</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</p>
            <FiCheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.completed}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This quarter</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UPCOMING</p>
            <FiClock className="w-5 h-5 text-amber-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.upcoming}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Scheduled soon</p>
        </div>
      </div>

      {/* Search, Filters & View Toggle */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search projects by name, client, or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`appearance-none px-4 py-2 pr-8 rounded-lg border text-sm font-medium ${isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="progress">Highest Progress</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            <div className={`flex rounded-lg border ${isDark ? 'border-slate-600' : 'border-slate-200'} overflow-hidden`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : `${isDark ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-600'}`}`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : `${isDark ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-600'}`}`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'completed', 'upcoming', 'on_hold'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white'
                  : `${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              {filter === 'on_hold' ? 'On Hold' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div key={project.id} className={`group rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
                {/* Card Header */}
                <div className="p-5 pb-0 flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>{project.name}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} line-clamp-2`}>{project.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(project.status)}`}>
                    {project.status === 'on_hold' ? 'On Hold' : project.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="px-5 py-4">
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

                {/* Footer with Team, Dates, Tasks */}
                <div className={`px-5 py-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center -space-x-2">
                      {project.teamMembers.slice(0, 3).map((member, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${member.color} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-white text-[10px] font-bold`} title={member.name}>
                          {member.initials}
                        </div>
                      ))}
                      {project.teamMembers.length > 3 && (
                        <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-white text-[10px] font-bold`}>
                          +{project.teamMembers.length - 3}
                        </div>
                      )}
                      {project.teamMembers.length === 0 && (
                        <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-[10px]`}>
                          ?
                        </div>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(project.priority)}`}>
                      {project.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <FiCalendar className="w-3 h-3" /> {project.startDate} - {project.endDate}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      <FiUsers className="w-3 h-3" /> {project.tasksCount} tasks
                    </span>
                  </div>
                </div>

                {/* Action Menu (on hover) */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setShowActions(showActions === project.id ? null : project.id)}
                    className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-600'} shadow-sm`}
                  >
                    <FiMoreHorizontal className="w-4 h-4" />
                  </button>
                  {showActions === project.id && (
                    <div className={`absolute right-0 mt-1 w-32 rounded-lg border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} z-10`}>
                      <button className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                        <FiEye className="w-3 h-3" /> View
                      </button>
                      <button className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                        <FiEdit2 className="w-3 h-3" /> Edit
                      </button>
                      <button className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50`}>
                        <FiTrash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-full text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FiFolder className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No projects found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      ) : (
        // List View
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>
          <div className={`grid grid-cols-12 gap-4 p-4 border-b ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'} text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className="col-span-4">Project</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Progress</div>
            <div className="col-span-2">Team</div>
            <div className="col-span-2">Tasks</div>
          </div>
          {filteredProjects.map((project) => (
            <div key={project.id} className={`grid grid-cols-12 gap-4 p-4 border-b ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'} transition-colors items-center`}>
              <div className="col-span-4">
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.name}</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>{project.startDate} - {project.endDate}</p>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(project.status)}`}>
                  {project.status === 'on_hold' ? 'On Hold' : project.status}
                </span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className={`flex-1 ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-1.5 overflow-hidden`}>
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{project.progress}%</span>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center -space-x-2">
                  {project.teamMembers.slice(0, 3).map((member, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full ${member.color} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-white text-[9px] font-bold`}>
                      {member.initials}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{project.tasksCount} tasks</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="e.g., Website Relaunch"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Description</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                  placeholder="Brief description..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Project Manager *</label>
                <select
                  required
                  value={newProject.projectManager}
                  onChange={(e) => setNewProject({...newProject, projectManager: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Select Project Manager</option>
                  {mockUsers.filter(u => u.role === 'PROJECT_MANAGER').map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Team Members</label>
                <div className={`max-h-32 overflow-y-auto rounded-lg border p-2 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                  {mockUsers.filter(u => u.role === 'TEAM_MEMBER').map(u => (
                    <label key={u.id} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProject.teamMembers.includes(u.id)}
                        onChange={() => toggleTeamMember(u.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({...newProject, status: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium`}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}