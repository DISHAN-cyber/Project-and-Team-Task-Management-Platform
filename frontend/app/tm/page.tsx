'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FiCheckCircle, FiClock, FiTrendingUp, FiFolder, FiClipboard, FiAward, FiX, FiMessageSquare, FiBarChart2 } from 'react-icons/fi';

export default function TMDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  
  // Form states
  const [selectedTask, setSelectedTask] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [progress, setProgress] = useState(75);
  const [notes, setNotes] = useState('');

  // RBAC Protection
  useEffect(() => {
    if (!loading && user) {
      const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
      if (normalizedRole !== 'TEAM_MEMBER') {
        if (normalizedRole === 'PROJECT_MANAGER') {
          router.replace('/pm');
        } else if (normalizedRole === 'ADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/auth/login');
        }
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  const stats = [
    { label: 'MY PROJECTS', value: '3', sub: '2 active this week', icon: FiFolder },
    { label: 'MY TASKS', value: '9', sub: '4 due today', icon: FiClipboard },
    { label: 'COMPLETED', value: '14', sub: 'Strong weekly pace', icon: FiCheckCircle },
    { label: 'PRODUCTIVITY', value: '87%', sub: 'Above team average', icon: FiTrendingUp },
  ];

  const progressBars = [
    { label: "Today's completed tasks", value: 60 },
    { label: 'Current sprint contribution', value: 75 },
    { label: 'Task quality score', value: 90 },
    { label: 'Time utilization', value: 68 },
  ];

  const quickBars = [
    { label: 'Focus level', value: 'High', percent: 85 },
    { label: 'Pending reviews', value: '3 items', percent: 30 },
    { label: 'Daily goal', value: '7/9', percent: 78 },
  ];

  const tasksQueue = [
    {
      id: 1,
      priority: 'HIGH PRIORITY',
      priorityColor: 'text-red-600',
      title: 'Finish dashboard layout updates',
      desc: 'Implement top search, live timeline, and performance bars.',
      due: 'Due today',
    },
    {
      id: 2,
      priority: 'IN PROGRESS',
      priorityColor: 'text-blue-600',
      title: 'Review project updates',
      desc: 'Check comments from the project manager and update notes.',
      due: 'Tomorrow',
    },
    {
      id: 3,
      priority: 'COMPLETED',
      priorityColor: 'text-emerald-600',
      title: 'Submit sprint summary',
      desc: 'Delivered notes and completion updates to the team lead.',
      due: 'Done',
    },
  ];

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updating progress:', {
      task: selectedTask,
      status,
      progress,
      notes,
      timestamp: new Date().toISOString()
    });
    
    alert(`Progress updated successfully!\n\nTask: ${selectedTask || 'General Update'}\nStatus: ${status.replace('_', ' ').toUpperCase()}\nProgress: ${progress}%\nNotes: ${notes || 'No notes added'}`);
    
    setShowUpdateModal(false);
    setSelectedTask('');
    setStatus('in_progress');
    setProgress(75);
    setNotes('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500 animate-pulse">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back, {user?.name?.split(' ')[0] || 'Team Member'}!
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Stay on top of your tasks, project progress, and daily workload.
          </p>
        </div>
        <button 
          onClick={() => setShowUpdateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <FiCheckCircle className="w-4 h-4" />
          Update Progress
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

      {/* Middle Section: Progress & Quick Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Bars (Left 2/3) */}
        <div className={`lg:col-span-2 p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My progress bars</h2>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Daily performance</span>
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

        {/* Quick Bars (Right 1/3) */}
        <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <h2 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quick bars</h2>
          <div className="space-y-6">
            {quickBars.map((bar, i) => (
              <div key={i} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bar.label}</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{bar.value}</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-slate-600' : 'bg-slate-200'} rounded-full h-1.5 overflow-hidden`}>
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${bar.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Queue */}
      <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>
        <div className={`p-6 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My tasks queue</h2>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sorted by priority</span>
        </div>

        <div className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
          {tasksQueue.map((task, i) => (
            <div 
              key={i} 
              className={`p-5 hover:${isDark ? 'bg-slate-700' : 'bg-slate-50'} transition-colors cursor-pointer`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className={`text-xs font-bold tracking-wider mb-1 ${task.priorityColor}`}>
                    {task.priority}
                  </p>
                  <h3 className={`font-semibold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {task.title}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {task.desc}
                  </p>
                </div>
                <span className={`text-sm font-medium whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {task.due}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FiBarChart2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Update Progress</h2>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Share your progress with the team</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'} transition-colors`}
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateProgress} className="space-y-5">
              {/* Task Selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiClipboard className="inline w-4 h-4 mr-1" />
                  Select Task (Optional)
                </label>
                <select
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">General Update</option>
                  {tasksQueue.map((task) => (
                    <option key={task.id} value={task.title}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiCheckCircle className="inline w-4 h-4 mr-1" />
                  Current Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'not_started', label: 'Not Started', color: 'bg-slate-400' },
                    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
                    { value: 'completed', label: 'Completed', color: 'bg-emerald-500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatus(option.value)}
                      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                        status === option.value
                          ? `border-indigo-600 bg-indigo-50 text-indigo-700`
                          : `${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Slider */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiTrendingUp className="inline w-4 h-4 mr-1" />
                  Completion: <span className="text-indigo-600 font-bold">{progress}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <FiMessageSquare className="inline w-4 h-4 mr-1" />
                  Progress Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What have you accomplished? Any blockers?"
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'} focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Update Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}