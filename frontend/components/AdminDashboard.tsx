'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiBell, FiSettings, FiPlus, FiLogOut, FiUsers, FiFolder, FiCheckSquare, FiHome, FiActivity, FiTrendingUp, FiShield, FiClock } from 'react-icons/fi';

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  // Live updating clock - updates every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' | ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'projects', label: 'Projects', icon: FiFolder },
    { id: 'my-tasks', label: 'My Tasks', icon: FiCheckSquare },
    { id: 'team', label: 'Team', icon: FiUsers },
  ];

  const stats = [
    { label: 'TOTAL PROJECTS', value: '12', sub: 'Across all departments', icon: FiFolder, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'ACTIVE TASKS', value: '48', sub: '6 tasks due today', icon: FiCheckSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'TEAM MEMBERS', value: '24', sub: '3 managers, 21 contributors', icon: FiUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'SYSTEM ACCESS', value: '99%', sub: 'Healthy and secure', icon: FiShield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const operationalBars = [
    { label: 'Project completion', value: 78, color: 'bg-indigo-600' },
    { label: 'Task resolution', value: 66, color: 'bg-purple-600' },
    { label: 'Team utilization', value: 84, color: 'bg-blue-600' },
    { label: 'Security compliance', value: 92, color: 'bg-emerald-600' },
  ];

  const quickStatus = [
    { label: 'PENDING APPROVALS', value: 5, icon: FiClock },
    { label: 'NEW REQUESTS', value: 8, icon: FiTrendingUp },
    { label: 'OVERDUE ITEMS', value: 2, icon: FiAlertCircle },
  ];

  const recentActivity = [
    { icon: FiUsers, text: 'A new team member was added to Website Relaunch.', time: '10 minutes ago', color: 'bg-indigo-100 text-indigo-600' },
    { icon: FiCheckSquare, text: '12 tasks were updated by project managers.', time: '32 minutes ago', color: 'bg-purple-100 text-purple-600' },
    { icon: FiShield, text: 'Role permissions were reviewed successfully.', time: '1 hour ago', color: 'bg-emerald-100 text-emerald-600' },
  ];

  const workloadBars = [
    { label: 'Design', tasks: 7, value: 58, color: 'bg-indigo-600' },
    { label: 'Development', tasks: 12, value: 100, color: 'bg-purple-600' },
    { label: 'QA', tasks: 5, value: 42, color: 'bg-blue-600' },
    { label: 'Operations', tasks: 4, value: 33, color: 'bg-emerald-600' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Left Sidebar - Dark Navy */}
      <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex gap-1.5 mr-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-slate-600" />
          </div>
          <span className="font-bold text-lg text-white">TaskFlow</span>
        </div>

        {/* System Role */}
        <div className="px-6 py-4 border-b border-slate-800">
          <p className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">System Role</p>
          <p className="text-sm font-semibold text-white">Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              AA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Ava Admin</p>
              <p className="text-xs text-slate-400 truncate">admin@taskflow.dev</p>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors p-2">
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar with Search and Live Clock */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects, tasks, team, or reports..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Side: Clock, Notifications, Settings */}
          <div className="flex items-center gap-4 ml-6">
            {/* Live Date & Time - Prominent Display */}
            <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-indigo-900">{formatDateTime(currentTime).split('|')[1]}</span>
                <span className="text-[10px] font-medium text-indigo-600">{formatDateTime(currentTime).split('|')[0]}</span>
              </div>
            </div>

            {/* Notification Bell */}
            <button className="relative p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <FiBell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Settings */}
            <button className="p-2.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <FiSettings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h1>
              <p className="text-sm text-slate-600 mt-1">Monitor users, project delivery, task health, and system access in one place.</p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
              <FiPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <p className="text-xs font-bold text-slate-500 tracking-wider">{stat.label}</p>
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Operational Bars & Quick Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Operational Bars */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Operational bars</h3>
                  <p className="text-xs text-slate-500 mt-1">Live progress snapshot</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">Live</span>
              </div>
              
              <div className="space-y-5">
                {operationalBars.map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">{bar.label}</span>
                      <span className={`font-bold ${bar.color.replace('bg-', 'text-')}`}>{bar.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`${bar.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick status</h3>
              
              <div className="space-y-3">
                {quickStatus.map((status, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-slate-500 tracking-wider">{status.label}</p>
                      <status.icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{status.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Team Workload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent activity</h3>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">Today</span>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-all">
                    <div className={`w-11 h-11 rounded-xl ${activity.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <activity.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 font-medium">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Workload Bars */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Team workload bars</h3>
                  <p className="text-xs text-slate-500 mt-1">By function</p>
                </div>
                <FiActivity className="w-5 h-5 text-slate-400" />
              </div>
              
              <div className="space-y-5">
                {workloadBars.map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">{bar.label}</span>
                      <span className="font-bold text-slate-600">{bar.tasks} tasks</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`${bar.color} h-3 rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${bar.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}