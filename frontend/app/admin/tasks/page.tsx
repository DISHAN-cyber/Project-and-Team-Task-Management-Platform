'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  FiAlertCircle, FiCheckCircle, FiClock, FiSettings, 
  FiUsers, FiFileText, FiShield, FiDatabase, FiCalendar,
  FiMoreHorizontal, FiChevronRight, FiX, FiCheck
} from 'react-icons/fi';

// Mock Admin Tasks Data
const mockAdminTasks = [
  // Urgent Tasks
  {
    id: '1',
    title: 'Review new user registrations',
    description: '5 pending user accounts awaiting approval',
    category: 'urgent',
    priority: 'high',
    status: 'pending',
    dueDate: 'Today',
    icon: FiUsers,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    actionRequired: 'Approve/Reject',
  },
  {
    id: '2',
    title: 'Approve Q2 budget allocations',
    description: 'Review and approve departmental budgets for Q2 2026',
    category: 'urgent',
    priority: 'high',
    status: 'pending',
    dueDate: 'Today',
    icon: FiFileText,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    actionRequired: 'Review & Approve',
  },
  {
    id: '3',
    title: 'Security audit due',
    description: 'Monthly security compliance check required',
    category: 'urgent',
    priority: 'high',
    status: 'pending',
    dueDate: 'Today',
    icon: FiShield,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    actionRequired: 'Run Audit',
  },
  
  // Pending Approvals
  {
    id: '4',
    title: 'Role change: Malik → Project Manager',
    description: 'Malik Member requested promotion to PM role',
    category: 'approvals',
    priority: 'medium',
    status: 'pending',
    dueDate: 'Tomorrow',
    icon: FiUsers,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    actionRequired: 'Approve/Reject',
  },
  {
    id: '5',
    title: 'New project: Mobile App v3.0',
    description: 'Project proposal from Test PM - Budget: $50,000',
    category: 'approvals',
    priority: 'medium',
    status: 'pending',
    dueDate: 'Jul 20',
    icon: FiFileText,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    actionRequired: 'Review',
  },
  {
    id: '6',
    title: 'Budget increase: TaskFlow Website',
    description: 'Priya Manager requesting 20% budget increase',
    category: 'approvals',
    priority: 'medium',
    status: 'pending',
    dueDate: 'Jul 22',
    icon: FiFileText,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    actionRequired: 'Approve/Reject',
  },
  
  // System Tasks
  {
    id: '7',
    title: 'Monthly backup verification',
    description: 'Verify all database backups completed successfully',
    category: 'system',
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'Jul 18',
    icon: FiDatabase,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    actionRequired: 'Verify',
  },
  {
    id: '8',
    title: 'Update privacy policy',
    description: 'Annual privacy policy update required',
    category: 'system',
    priority: 'low',
    status: 'pending',
    dueDate: 'Jul 25',
    icon: FiFileText,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    actionRequired: 'Update',
  },
  {
    id: '9',
    title: 'Review system logs',
    description: 'Weekly system performance and error log review',
    category: 'system',
    priority: 'low',
    status: 'pending',
    dueDate: 'Jul 19',
    icon: FiSettings,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    actionRequired: 'Review',
  },
  {
    id: '10',
    title: 'Database optimization',
    description: 'Quarterly database performance optimization',
    category: 'system',
    priority: 'medium',
    status: 'pending',
    dueDate: 'Jul 30',
    icon: FiDatabase,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-50',
    actionRequired: 'Optimize',
  },
  
  // Completed Tasks
  {
    id: '11',
    title: 'User account cleanup',
    description: 'Removed 12 inactive accounts from system',
    category: 'system',
    priority: 'low',
    status: 'completed',
    dueDate: 'Jul 10',
    completedDate: 'Jul 10',
    icon: FiCheckCircle,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    actionRequired: 'Completed',
  },
];

export default function AdminTasksPage() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [tasks, setTasks] = useState(mockAdminTasks);
  const [showActions, setShowActions] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return task.status === 'pending';
    if (activeFilter === 'in_progress') return task.status === 'in_progress';
    if (activeFilter === 'completed') return task.status === 'completed';
    return true;
  });

  // Group tasks by category
  const urgentTasks = filteredTasks.filter(t => t.category === 'urgent' && t.status !== 'completed');
  const approvalTasks = filteredTasks.filter(t => t.category === 'approvals' && t.status !== 'completed');
  const systemTasks = filteredTasks.filter(t => t.category === 'system');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const handleTaskAction = (taskId: string, action: 'approve' | 'reject' | 'complete') => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: action === 'complete' ? 'completed' : task.status,
        };
      }
      return task;
    }));
    setShowActions(null);
    alert(`Task ${action}d successfully!`);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Tasks</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Administrative tasks and system management
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'All', count: tasks.filter(t => t.status !== 'completed').length },
          { id: 'pending', label: 'Pending', count: tasks.filter(t => t.status === 'pending').length },
          { id: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
          { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : `${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === tab.id
                ? 'bg-white/20 text-white'
                : `${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-600'}`
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Urgent Tasks Section */}
      {urgentTasks.length > 0 && activeFilter !== 'completed' && (
        <div className={`rounded-xl border-2 border-red-200 ${isDark ? 'bg-slate-800 border-red-900' : 'bg-red-50'} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              🔴 URGENT ({urgentTasks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {urgentTasks.map((task) => (
              <div key={task.id} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-white'} border border-red-200 dark:border-red-800`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <task.icon className={`w-5 h-5 ${task.iconColor}`} />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>{task.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <FiCalendar className="w-3 h-3" /> Due: {task.dueDate}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">
                        {task.actionRequired}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskAction(task.id, 'approve')}
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTaskAction(task.id, 'reject')}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approvals Section */}
      {approvalTasks.length > 0 && activeFilter !== 'completed' && (
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FiFileText className="w-5 h-5 text-blue-600" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              📋 PENDING APPROVALS ({approvalTasks.length})
            </h2>
          </div>
          <div className="space-y-3">
            {approvalTasks.map((task) => (
              <div key={task.id} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <task.icon className={`w-5 h-5 ${task.iconColor}`} />
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>{task.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <FiCalendar className="w-3 h-3" /> Due: {task.dueDate}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                        {task.actionRequired}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTaskAction(task.id, 'approve')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleTaskAction(task.id, 'reject')}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Tasks Section */}
      {systemTasks.filter(t => t.status !== 'completed').length > 0 && activeFilter !== 'completed' && (
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FiSettings className="w-5 h-5 text-purple-600" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ⚙️ SYSTEM TASKS ({systemTasks.filter(t => t.status !== 'completed').length})
            </h2>
          </div>
          <div className="space-y-3">
            {systemTasks.filter(t => t.status !== 'completed').map((task) => (
              <div key={task.id} className={`p-4 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'} flex items-center justify-between`}>
                <div className="flex-1 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${task.bgColor}`}>
                    <task.icon className={`w-5 h-5 ${task.iconColor}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <FiCalendar className="w-3 h-3" /> Due: {task.dueDate}
                      </span>
                      <span className={`px-2 py-1 rounded ${isDark ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                        {task.actionRequired}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleTaskAction(task.id, 'complete')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks Section */}
      {(completedTasks.length > 0 || activeFilter === 'completed') && (
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5`}>
          <div className="flex items-center gap-2 mb-4">
            <FiCheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              ✅ COMPLETED ({completedTasks.length})
            </h2>
          </div>
          <div className="space-y-2 opacity-60">
            {completedTasks.map((task) => (
              <div key={task.id} className={`p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'} border ${isDark ? 'border-slate-600' : 'border-slate-200'} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-emerald-500" />
                  <div>
                    <h3 className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{task.title}</h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completed on {task.completedDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}