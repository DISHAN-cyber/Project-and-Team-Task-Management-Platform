'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiCalendar, FiMoreHorizontal } from 'react-icons/fi';

// Mock PM-specific tasks data
const mockPMTasks = [
  {
    id: '1',
    title: 'Review sprint backlog',
    description: 'Review and prioritize tasks for the upcoming sprint',
    project: 'TaskFlow Website Relaunch',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'Today',
    assignees: [
      { name: 'Malik Member', initials: 'MM', color: 'bg-green-500' },
      { name: 'Sofia Smith', initials: 'SS', color: 'bg-pink-500' },
    ],
  },
  {
    id: '2',
    title: 'Approve design mockups',
    description: 'Review and approve the new homepage designs',
    project: 'TaskFlow Website Relaunch',
    status: 'To Do',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignees: [
      { name: 'Sofia Smith', initials: 'SS', color: 'bg-pink-500' },
    ],
  },
  {
    id: '3',
    title: 'Update project timeline',
    description: 'Adjust timeline based on recent delays',
    project: 'Mobile App v2.0',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'Jul 18',
    assignees: [],
  },
  {
    id: '4',
    title: 'Team performance review',
    description: 'Conduct quarterly performance reviews',
    project: 'Team Management',
    status: 'To Do',
    priority: 'Medium',
    dueDate: 'Jul 20',
    assignees: [],
  },
];

export default function PMTasksPage() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [tasks, setTasks] = useState(mockPMTasks);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    const statusMap: Record<string, string> = {
      'to_do': 'To Do',
      'in_progress': 'In Progress',
      'in_review': 'In Review',
      'done': 'Done',
    };
    return task.status === statusMap[activeFilter] || task.status.toLowerCase().replace(' ', '_') === activeFilter;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    highPriority: tasks.filter(t => t.priority === 'High').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-emerald-100 text-emerald-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'To Do': return 'bg-slate-100 text-slate-700';
      case 'In Review': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Tasks</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tasks across your projects and team management.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
          <FiPlus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL TASKS</p>
            <FiCheckCircle className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across all projects</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>IN PROGRESS</p>
            <FiClock className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.inProgress}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currently active</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</p>
            <FiCheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.completed}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>This week</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HIGH PRIORITY</p>
            <FiAlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.highPriority}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Needs attention</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Tasks', count: tasks.length },
            { id: 'to_do', label: 'To Do', count: tasks.filter(t => t.status === 'To Do').length },
            { id: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
            { id: 'in_review', label: 'In Review', count: tasks.filter(t => t.status === 'In Review').length },
            { id: 'done', label: 'Done', count: tasks.filter(t => t.status === 'Done').length },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                activeFilter === filter.id
                  ? 'bg-indigo-600 text-white'
                  : `${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
              }`}
            >
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilter === filter.id
                  ? 'bg-white/20 text-white'
                  : `${isDark ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-600'}`
              }`}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>
        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`p-5 hover:${isDark ? 'bg-slate-700' : 'bg-slate-50'} transition-colors`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {task.title}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <FiCalendar className="w-3 h-3" /> Due {task.dueDate}
                      </span>
                      <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                         {task.project}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-2">
                      {task.assignees.map((assignee, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full ${assignee.color} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-white text-[10px] font-bold`} title={assignee.name}>
                          {assignee.initials}
                        </div>
                      ))}
                      {task.assignees.length === 0 && (
                        <div className={`w-7 h-7 rounded-full ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'} border-2 ${isDark ? 'border-slate-800' : 'border-white'} flex items-center justify-center text-[10px]`}>
                          ?
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                      <FiMoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <FiCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}