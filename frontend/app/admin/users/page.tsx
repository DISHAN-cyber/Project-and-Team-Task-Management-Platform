'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { 
  FiUsers, FiCheckCircle, FiXCircle, FiShield, FiSearch, 
  FiPlus, FiMoreHorizontal, FiEye, FiEdit2, FiTrash2, 
  FiX, FiCalendar, FiMail, FiBriefcase, FiActivity,
  FiChevronDown, FiGrid, FiList, FiDownload
} from 'react-icons/fi';

// Mock Users Data
const mockUsers = [
  {
    id: '1',
    name: 'Ava Admin',
    email: 'admin@taskflow.dev',
    initials: 'AA',
    role: 'ADMIN',
    status: 'active',
    avatarColor: 'bg-purple-500',
    lastActive: '2 minutes ago',
    tasksCount: 12,
    projectsCount: 3,
    joinedDate: 'Jan 15, 2026',
  },
  {
    id: '2',
    name: 'Priya Manager',
    email: 'pm@taskflow.dev',
    initials: 'PM',
    role: 'PROJECT_MANAGER',
    status: 'active',
    avatarColor: 'bg-blue-500',
    lastActive: '1 hour ago',
    tasksCount: 24,
    projectsCount: 5,
    joinedDate: 'Feb 1, 2026',
  },
  {
    id: '3',
    name: 'Malik Member',
    email: 'member1@taskflow.dev',
    initials: 'MM',
    role: 'TEAM_MEMBER',
    status: 'active',
    avatarColor: 'bg-green-500',
    lastActive: '5 minutes ago',
    tasksCount: 8,
    projectsCount: 2,
    joinedDate: 'Mar 10, 2026',
  },
  {
    id: '4',
    name: 'Sofia Smith',
    email: 'member2@taskflow.dev',
    initials: 'SS',
    role: 'TEAM_MEMBER',
    status: 'active',
    avatarColor: 'bg-pink-500',
    lastActive: 'Yesterday',
    tasksCount: 15,
    projectsCount: 3,
    joinedDate: 'Apr 5, 2026',
  },
  {
    id: '5',
    name: 'Test PM',
    email: 'testpm@taskflow.dev',
    initials: 'TP',
    role: 'PROJECT_MANAGER',
    status: 'active',
    avatarColor: 'bg-indigo-500',
    lastActive: '3 hours ago',
    tasksCount: 18,
    projectsCount: 4,
    joinedDate: 'May 20, 2026',
  },
  {
    id: '6',
    name: 'John Inactive',
    email: 'john@taskflow.dev',
    initials: 'JI',
    role: 'TEAM_MEMBER',
    status: 'inactive',
    avatarColor: 'bg-gray-500',
    lastActive: '2 weeks ago',
    tasksCount: 0,
    projectsCount: 0,
    joinedDate: 'Jun 1, 2025',
  },
];

export default function TeamPage() {
  const { user, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState('name');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'TEAM_MEMBER',
    projects: [] as string[],
    sendEmail: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  // Filter & Sort Users
  const filteredUsers = mockUsers
    .filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === 'all') return matchesSearch;
      if (activeFilter === 'active') return matchesSearch && u.status === 'active';
      if (activeFilter === 'inactive') return matchesSearch && u.status === 'inactive';
      if (activeFilter === 'admin') return matchesSearch && u.role === 'ADMIN';
      if (activeFilter === 'project_manager') return matchesSearch && u.role === 'PROJECT_MANAGER';
      if (activeFilter === 'team_member') return matchesSearch && u.role === 'TEAM_MEMBER';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'tasks') return b.tasksCount - a.tasksCount;
      return 0;
    });

  // Stats Calculation
  const stats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    inactive: mockUsers.filter(u => u.status === 'inactive').length,
    admins: mockUsers.filter(u => u.role === 'ADMIN').length,
    projectManagers: mockUsers.filter(u => u.role === 'PROJECT_MANAGER').length,
    teamMembers: mockUsers.filter(u => u.role === 'TEAM_MEMBER').length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-700 border-red-200';
      case 'PROJECT_MANAGER': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'TEAM_MEMBER': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'inactive': return 'bg-slate-100 text-slate-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    console.log(`Changing user ${userId} role to ${newRole}`);
    alert(`User role updated to ${newRole}`);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inviting user:', inviteForm);
    alert(`Invitation sent to ${inviteForm.email} as ${inviteForm.role}`);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'TEAM_MEMBER', projects: [], sendEmail: true });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Team</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage user accounts, roles, and access.
          </p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          New user
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL USERS</p>
            <FiUsers className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>All members in system</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>ACTIVE</p>
            <FiCheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.active}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currently active</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>INACTIVE</p>
            <FiXCircle className="w-5 h-5 text-slate-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.inactive}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Disabled accounts</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>BY ROLE</p>
            <FiShield className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-xs space-y-1 mt-1">
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              <span className="font-bold">{stats.admins}</span> Admins
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              <span className="font-bold">{stats.projectManagers}</span> PMs
            </p>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              <span className="font-bold">{stats.teamMembers}</span> Members
            </p>
          </div>
        </div>
      </div>

      {/* Search, Filters & View Toggle */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
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
                <option value="name">Name A-Z</option>
                <option value="role">Role</option>
                <option value="status">Status</option>
                <option value="tasks">Tasks (High-Low)</option>
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
          {[
            { id: 'all', label: 'All Users', count: mockUsers.length },
            { id: 'active', label: 'Active', count: stats.active },
            { id: 'inactive', label: 'Inactive', count: stats.inactive },
            { id: 'admin', label: 'Administrators', count: stats.admins },
            { id: 'project_manager', label: 'Project Managers', count: stats.projectManagers },
            { id: 'team_member', label: 'Team Members', count: stats.teamMembers },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
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

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-indigo-900/20 border-indigo-800' : 'bg-indigo-50 border-indigo-200'}`}>
          <span className={`text-sm font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button className={`px-3 py-1.5 text-xs font-medium rounded ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
              Change Role
            </button>
            <button className={`px-3 py-1.5 text-xs font-medium rounded ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
              Deactivate
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200">
              Delete
            </button>
            <button className={`px-3 py-1.5 text-xs font-medium rounded ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
              <FiDownload className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Users Display */}
      {viewMode === 'list' ? (
        // List View (Table)
        <div className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm overflow-hidden`}>
          <div className={`grid grid-cols-12 gap-4 p-4 border-b ${isDark ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-slate-50'} text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className="col-span-1">
              <input 
                type="checkbox" 
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(filteredUsers.map(u => u.id));
                  } else {
                    setSelectedUsers([]);
                  }
                }}
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              />
            </div>
            <div className="col-span-4">User</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Last Active</div>
            <div className="col-span-1">Tasks</div>
          </div>
          
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className={`grid grid-cols-12 gap-4 p-4 border-b ${isDark ? 'border-slate-700 hover:bg-slate-700' : 'border-slate-100 hover:bg-slate-50'} transition-colors items-center`}>
                <div className="col-span-1">
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                    {user.initials}
                  </div>
                  <div>
                    <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`text-sm rounded-lg border px-2 py-1 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="ADMIN">Administrator</option>
                    <option value="PROJECT_MANAGER">Project Manager</option>
                    <option value="TEAM_MEMBER">Team Member</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{user.lastActive}</p>
                </div>
                <div className="col-span-1">
                  <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{user.tasksCount}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={`p-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      ) : (
        // Grid View (Cards)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className={`group rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition-shadow p-5`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-full ${user.avatarColor} flex items-center justify-center text-white text-xl font-bold`}>
                    {user.initials}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                      <FiMoreHorizontal className="w-4 h-4" />
                    </button>
                    {showActions === user.id && (
                      <div className={`absolute right-0 mt-1 w-32 rounded-lg border shadow-lg ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} z-10`}>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowUserModal(true); setShowActions(null); }}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <FiEye className="w-3 h-3" /> View
                        </button>
                        <button className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                          <FiEdit2 className="w-3 h-3" /> Edit
                        </button>
                        <button className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50">
                          <FiTrash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>{user.name}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-3`}>{user.email}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}>
                    {user.role === 'ADMIN' ? 'Administrator' : user.role === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.tasksCount}</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Tasks</p>
                  </div>
                  <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.projectsCount}</p>
                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Projects</p>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between text-xs pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    <FiCalendar className="inline w-3 h-3 mr-1" /> {user.lastActive}
                  </span>
                  <button 
                    onClick={() => { setSelectedUser(user); setShowUserModal(true); }}
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    View Details <FiChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-full p-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <FiUsers className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>User Details</h2>
              <button onClick={() => setShowUserModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <div className={`w-20 h-20 rounded-full ${selectedUser.avatarColor} flex items-center justify-center text-white text-2xl font-bold`}>
                {selectedUser.initials}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.name}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} flex items-center gap-1`}>
                  <FiMail className="w-3 h-3" /> {selectedUser.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role === 'ADMIN' ? 'Administrator' : selectedUser.role === 'PROJECT_MANAGER' ? 'Project Manager' : 'Team Member'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <FiBriefcase className="w-4 h-4 text-indigo-600" />
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>TASKS COMPLETED</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.tasksCount}</p>
              </div>
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <FiFolder className="w-4 h-4 text-indigo-600" />
                  <p className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>PROJECTS</p>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedUser.projectsCount}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <FiActivity className="w-4 h-4 text-indigo-600" />
                  <h4 className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>RECENT ACTIVITY</h4>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>• Updated project status - 2 hours ago</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>• Completed task "Design homepage" - Yesterday</p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>• Joined project "Mobile App v2.0" - 3 days ago</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium`}>
                Edit User
              </button>
              <button className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                View All Tasks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Invite New User</h2>
              <button onClick={() => setShowInviteModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Address *</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="john@taskflow.dev"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Role *</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                  className={`w-full px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="TEAM_MEMBER">Team Member</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Assign to Projects (Optional)</label>
                <div className={`max-h-32 overflow-y-auto rounded-lg border p-2 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}>
                  {['TaskFlow Website Relaunch', 'Mobile App v2.0', 'Internal Dashboard'].map((project, i) => (
                    <label key={i} className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inviteForm.projects.includes(project)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInviteForm({...inviteForm, projects: [...inviteForm.projects, project]});
                          } else {
                            setInviteForm({...inviteForm, projects: inviteForm.projects.filter(p => p !== project)});
                          }
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{project}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inviteForm.sendEmail}
                    onChange={(e) => setInviteForm({...inviteForm, sendEmail: e.target.checked})}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Send invitation email</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowInviteModal(false)} className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium`}>
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}