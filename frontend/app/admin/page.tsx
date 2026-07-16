'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { FiFolder, FiClipboard, FiUsers, FiShield, FiPlus, FiActivity, FiTrendingUp, FiUserPlus, FiCheckSquare } from 'react-icons/fi';
import AddUserModal from '@/components/AddUserModal';

const statusLabel: Record<string, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  IN_REVIEW: 'In review',
  DONE: 'Done',
};

export default function DashboardHome() {
  const { user, loading: authLoading } = useAuth(); // Renamed to avoid conflict
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [summaryLoading, setSummaryLoading] = useState(true); // Renamed
  const [isDark, setIsDark] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // 🔒 RBAC PROTECTION: Block PMs and Team Members from Admin page
  useEffect(() => {
    if (!authLoading && user) {
      // Normalize the role to handle any format (e.g., "Project Manager" -> "PROJECT_MANAGER")
      const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
      
      if (normalizedRole !== 'ADMIN') {
        console.log(`🚫 Blocked ${normalizedRole} from accessing /admin. Redirecting...`);
        
        if (normalizedRole === 'PROJECT_MANAGER') {
          router.replace('/pm');
        } else if (normalizedRole === 'TEAM_MEMBER') {
          router.replace('/tm');
        } else {
          router.replace('/auth/login');
        }
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then(setSummary)
      .finally(() => setSummaryLoading(false));
  }, []);

  // Show loading while checking role or fetching data
  if (authLoading || summaryLoading || !summary) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-slate-500 animate-pulse">Checking access & loading data…</p>
      </div>
    );
  }

  const recentActivity = [
    {
      icon: FiUserPlus,
      text: 'A new team member was added to Website Relaunch.',
      time: '10 minutes ago',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: FiCheckSquare,
      text: '12 tasks were updated by project managers.',
      time: '32 minutes ago',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: FiShield,
      text: 'Role permissions were reviewed successfully.',
      time: '1 hour ago',
      color: 'bg-emerald-100 text-emerald-600',
    },
  ];

  const operationalBars = [
    { label: 'Project completion', value: 78 },
    { label: 'Task resolution', value: 66 },
    { label: 'Team utilization', value: 84 },
    { label: 'Security compliance', value: 92 },
  ];

  const quickStatus = [
    { label: 'PENDING APPROVALS', value: 5 },
    { label: 'NEW REQUESTS', value: 8 },
    { label: 'OVERDUE ITEMS', value: 2 },
  ];

  const workloadBars = [
    { label: 'Design', tasks: 7, value: 58 },
    { label: 'Development', tasks: 12, value: 100 },
    { label: 'QA', tasks: 5, value: 42 },
    { label: 'Operations', tasks: 4, value: 33 },
  ];

  return (
    <div className="space-y-6">
      {/* Header - Dynamic based on user role */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {user?.role === 'ADMIN' ? 'Admin Overview' 
             : user?.role === 'PROJECT_MANAGER' ? 'Project Manager Overview' 
             : 'My Dashboard'}
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {user?.role === 'ADMIN' 
              ? 'Monitor users, project delivery, task health, and system access in one place.'
              : user?.role === 'PROJECT_MANAGER'
              ? 'Manage your projects, track team progress, and oversee task completion.'
              : 'View your assigned tasks and track your daily progress.'}
          </p>
        </div>
        
        {/* Only show "Add User" button for ADMIN role */}
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors text-sm"
          >
            <FiPlus className="w-4 h-4" />
            Add User
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 border shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL PROJECTS</p>
            <FiFolder className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{summary.totalProjects || 12}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across all departments</p>
        </div>

        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 border shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ACTIVE TASKS</p>
            <FiClipboard className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{summary.totalTasks || 48}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>6 tasks due today</p>
        </div>

        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 border shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TEAM MEMBERS</p>
            <FiUsers className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>24</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>3 managers, 21 contributors</p>
        </div>

        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 border shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>SYSTEM ACCESS</p>
            <FiShield className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>99%</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Healthy and secure</p>
        </div>
      </div>

      {/* Operational Bars & Quick Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 border shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Operational bars</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Live progress snapshot</p>
            </div>
            <FiActivity className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-5">
            {operationalBars.map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bar.label}</span>
                  <span className="font-bold text-indigo-600">{bar.value}%</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-2.5 overflow-hidden`}>
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 border shadow-sm`}>
          <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Quick status</h2>
          <div className="space-y-3">
            {quickStatus.map((status, i) => (
              <div key={i} className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} border rounded-lg p-4`}>
                <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>{status.label}</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{status.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 border shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent activity</h2>
            <span className={`px-3 py-1 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'} text-xs font-semibold rounded-full`}>Today</span>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} font-medium`}>{activity.text}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`rounded-xl ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 border shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Team workload bars</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>By function</p>
            </div>
            <FiTrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-5">
            {workloadBars.map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{bar.label}</span>
                  <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{bar.tasks} tasks</span>
                </div>
                <div className={`w-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'} rounded-full h-2.5 overflow-hidden`}>
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onSuccess={() => {
          api.get('/dashboard/summary').then(setSummary);
        }}
      />
    </div>
  );
}