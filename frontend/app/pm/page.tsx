'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { FiPlus, FiX, FiFolder, FiClipboard, FiUsers, FiTrendingUp, FiCalendar, FiTag } from 'react-icons/fi';

export default function PMDashboard() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  
  // Project form state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTag, setTaskTag] = useState('Development');
  const [taskStatus, setTaskStatus] = useState('todo');

  // Mock Data
  const stats = [
    { label: 'PROJECTS', value: '6', sub: '2 launching this week', icon: FiFolder },
    { label: 'ACTIVE TASKS', value: '18', sub: '9 in progress', icon: FiClipboard },
    { label: 'TEAM MEMBERS', value: '11', sub: 'Across 3 active squads', icon: FiUsers },
    { label: 'ON-TIME RATE', value: '89%', sub: 'Improved from last sprint', icon: FiTrendingUp },
  ];

  const progressBars = [
    { label: 'Website relaunch', value: 72 },
    { label: 'Mobile app backlog', value: 58 },
    { label: 'QA verification', value: 81 },
    { label: 'Resource allocation', value: 69 },
  ];

  const utilityBars = [
    { label: 'Daily target', value: '8/10', percent: 80 },
    { label: 'Review queue', value: '4 items', percent: 40 },
    { label: 'Risk level', value: 'Low', percent: 20, color: 'bg-emerald-500' },
  ];

  const tasks = {
    todo: [
      { tag: 'Planning', title: 'Finalize sprint scope', desc: 'Confirm deliverables with stakeholders.' },
    ],
    inProgress: [
      { tag: 'Development', title: 'Build dashboard filters', desc: 'Add search, date tools, and utility controls.' },
    ],
    done: [
      { tag: 'Setup', title: 'Assign team structure', desc: 'Grouped members by role and project stream.' },
    ],
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating project:', { name: projectName, description: projectDesc });
    alert(`Project "${projectName}" created successfully!`);
    setShowNewProjectModal(false);
    setProjectName('');
    setProjectDesc('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating task:', { 
      title: taskTitle, 
      description: taskDesc, 
      tag: taskTag,
      status: taskStatus 
    });
    alert(`Task "${taskTitle}" added to ${taskStatus === 'todo' ? 'To Do' : taskStatus === 'inProgress' ? 'In Progress' : 'Done'}!`);
    setShowAddTaskModal(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskTag('Development');
    setTaskStatus('todo');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Project Manager Dashboard
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track delivery progress, monitor task movement, and balance your team workload.
          </p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
            <p className={`text-xs font-bold tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h3>
              <stat.icon className={`w-5 h-5 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
            </div>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Middle Section: Progress & Utility */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bars */}
        <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Progress bars</h2>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current sprint overview</span>
          </div>
          <div className="space-y-5">
            {progressBars.map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bar.label}</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{bar.value}%</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-2 overflow-hidden`}>
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Utility Bars */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick utility bars</h2>
          <div className="space-y-6">
            {utilityBars.map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bar.label}</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bar.value}</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-1.5 overflow-hidden`}>
                  <div className={`${bar.color || 'bg-indigo-600'} h-1.5 rounded-full`} style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Board */}
      <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Project tasks board</h2>
          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <FiPlus className="w-3 h-3" />
            Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['todo', 'inProgress', 'done'].map((column) => (
            <div key={column}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xs font-bold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {column.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                  {tasks[column as keyof typeof tasks].length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks[column as keyof typeof tasks].map((task, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'} hover:shadow-md transition-shadow cursor-pointer`}>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{task.tag}</span>
                    <h4 className={`text-sm font-bold mt-1 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{task.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Project</h2>
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Website Redesign"
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  placeholder="Brief description of the project..."
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Add New Task</h2>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g., Design homepage mockup"
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Brief description of the task..."
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <FiTag className="inline w-4 h-4 mr-1" />
                    Tag
                  </label>
                  <select
                    value={taskTag}
                    onChange={(e) => setTaskTag(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="QA">QA</option>
                    <option value="Testing">Testing</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <FiCalendar className="inline w-4 h-4 mr-1" />
                    Status
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}