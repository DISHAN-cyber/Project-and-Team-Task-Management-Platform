'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { 
  FiCheckCircle, FiClock, FiAlertCircle, FiCalendar, FiMoreHorizontal, 
  FiPaperclip, FiUpload, FiFolder, FiFile, FiX, FiPlus, FiEye, FiTrash2 
} from 'react-icons/fi';

// Mock TM-specific tasks data
const mockTMTasks = [
  {
    id: 'tm1',
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity designs for the new homepage',
    project: 'TaskFlow Website Relaunch',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'Today',
    assignedBy: 'Priya Manager',
    attachments: 3,
    uploadedFiles: [
      { name: 'homepage-wireframe.pdf', size: '2.4 MB', type: 'pdf', uploadedAt: '2 hours ago' },
      { name: 'design-mockup.fig', size: '15.8 MB', type: 'figma', uploadedAt: '5 hours ago' },
      { name: 'assets.zip', size: '45.2 MB', type: 'zip', uploadedAt: '1 day ago' },
    ],
  },
  {
    id: 'tm2',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with examples',
    project: 'Mobile App v2.0',
    status: 'To Do',
    priority: 'Medium',
    dueDate: 'Tomorrow',
    assignedBy: 'Priya Manager',
    attachments: 0,
    uploadedFiles: [],
  },
  {
    id: 'tm3',
    title: 'Fix login bug',
    description: 'Users reporting issues with OAuth login flow',
    project: 'Platform Updates',
    status: 'In Progress',
    priority: 'High',
    dueDate: 'Jul 18',
    assignedBy: 'Test PM',
    attachments: 1,
    uploadedFiles: [
      { name: 'bug-report.md', size: '156 KB', type: 'markdown', uploadedAt: '3 hours ago' },
    ],
  },
  {
    id: 'tm4',
    title: 'Update user profile page',
    description: 'Add new fields for user preferences and settings',
    project: 'TaskFlow Website Relaunch',
    status: 'Done',
    priority: 'Low',
    dueDate: 'Jul 14',
    assignedBy: 'Priya Manager',
    attachments: 0,
    uploadedFiles: [],
  },
  {
    id: 'tm5',
    title: 'Review pull requests',
    description: 'Review and approve pending PRs in the repository',
    project: 'E-Commerce Platform',
    status: 'To Do',
    priority: 'Medium',
    dueDate: 'Jul 20',
    assignedBy: 'Priya Manager',
    attachments: 0,
    uploadedFiles: [],
  },
];

export default function TMTasksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [tasks, setTasks] = useState(mockTMTasks);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<typeof mockTMTasks[0] | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user) {
      const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
      if (normalizedRole !== 'TEAM_MEMBER') {
        if (normalizedRole === 'PROJECT_MANAGER') {
          router.replace('/pm/tasks');
        } else if (normalizedRole === 'ADMIN') {
          router.replace('/admin/tasks');
        }
      }
    }
  }, [user, loading, router]);

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
    return task.status === statusMap[activeFilter];
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    overdue: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadingFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ ADDED: Delete file function
  const handleDeleteFile = (taskId: string, fileIndex: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newFiles = task.uploadedFiles.filter((_, idx) => idx !== fileIndex);
        return {
          ...task,
          uploadedFiles: newFiles,
          attachments: newFiles.length,
        };
      }
      return task;
    }));
  };

  const handleUpload = async (taskId: string) => {
    if (!selectedTask || uploadingFiles.length === 0) return;

    // Simulate file upload
    console.log(`Uploading ${uploadingFiles.length} files to task ${taskId}`);
    
    // Add files to task
    const newFiles = uploadingFiles.map(file => ({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      type: file.name.split('.').pop() || 'file',
      uploadedAt: 'Just now',
    }));

    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          uploadedFiles: [...(task.uploadedFiles || []), ...newFiles],
          attachments: (task.attachments || 0) + newFiles.length,
        };
      }
      return task;
    }));

    // Reset
    setUploadingFiles([]);
    setShowUploadModal(false);
    setSelectedTask(null);
    alert(`Successfully uploaded ${newFiles.length} file(s) to "${selectedTask?.title}"`);
  };

  const openUploadModal = (task: typeof mockTMTasks[0]) => {
    setSelectedTask(task);
    setUploadingFiles([]);
    setShowUploadModal(true);
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

  const getFileIcon = (fileType: string) => {
    if (fileType === 'pdf') return <FiFile className="w-4 h-4 text-red-500" />;
    if (['doc', 'docx', 'txt', 'md'].includes(fileType)) return <FiFile className="w-4 h-4 text-blue-500" />;
    if (['zip', 'rar', '7z'].includes(fileType)) return <FiFolder className="w-4 h-4 text-yellow-500" />;
    if (['fig', 'sketch', 'xd'].includes(fileType)) return <FiFile className="w-4 h-4 text-purple-500" />;
    return <FiFile className="w-4 h-4 text-slate-500" />;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Tasks</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Tasks assigned to you across projects.
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <FiUpload className="w-4 h-4" />
          Upload Files
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>MY TASKS</p>
            <FiCheckCircle className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Assigned to me</p>
        </div>

        <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>IN PROGRESS</p>
            <FiClock className="w-5 h-5 text-blue-500" />
          </div>
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.inProgress}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Currently working</p>
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
          <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.overdue}</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Needs attention</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All', count: tasks.length },
            { id: 'to_do', label: 'To Do', count: tasks.filter(t => t.status === 'To Do').length },
            { id: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
            { id: 'in_review', label: 'In Review', count: tasks.filter(t => t.status === 'In Review').length },
            { id: 'done', label: 'Done', count: tasks.filter(t => t.status === 'Done').length },
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
                      {task.attachments && task.attachments > 0 && (
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                          <FiPaperclip className="w-3 h-3" /> {task.attachments}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <FiCalendar className="w-3 h-3" /> Due {task.dueDate}
                      </span>
                      <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        📁 {task.project}
                      </span>
                      <span className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        👤 Assigned by {task.assignedBy}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <button 
                      onClick={() => openUploadModal(task)}
                      className={`p-2 rounded-lg ${isDark ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-colors`}
                      title="Upload files to this task"
                    >
                      <FiUpload className="w-4 h-4" />
                    </button>
                    <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                      <FiMoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* ✅ UPDATED: Show uploaded files with View & Delete buttons */}
                {task.uploadedFiles && task.uploadedFiles.length > 0 && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Uploaded Files ({task.uploadedFiles.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {task.uploadedFiles.map((file, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}
                        >
                          {getFileIcon(file.type)}
                          <div>
                            <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                            <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{file.size} • {file.uploadedAt}</p>
                          </div>
                          
                          {/* 👁️ VIEW BUTTON */}
<button 
  onClick={() => {
    // For mock data, show alert
    // In real app, this would open: window.open(`http://localhost:4000${file.url}`, '_blank')
    if (file.name.endsWith('.pdf')) {
      // Open a sample PDF or show message
      alert(`Opening PDF: ${file.name}\nSize: ${file.size}\nIn production, this opens the actual PDF file.`);
    } else {
      alert(`Opening file: ${file.name}\nSize: ${file.size}`);
    }
  }}
  className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-slate-600 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
  title="View File"
>
  <FiEye className="w-3.5 h-3.5" />
</button>
                          
                          {/* 🗑️ DELETE BUTTON */}
                          <button 
                            onClick={() => handleDeleteFile(task.id, idx)}
                            className={`p-1.5 rounded transition-colors ${isDark ? 'hover:bg-red-900 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                            title="Delete File"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <FiCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Great job! All tasks completed.</p>
          </div>
        )}
      </div>

      {/* Upload Files Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Upload Files {selectedTask && `- ${selectedTask.title}`}
              </h2>
              <button onClick={() => setShowUploadModal(false)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {!selectedTask ? (
              <div className="space-y-4">
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  First, select which task you want to upload files to:
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.filter(t => t.status !== 'Done').map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`w-full p-4 rounded-lg border text-left transition-colors ${
                        isDark 
                          ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{task.project}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* File Upload Area */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    isDark 
                      ? 'border-slate-600 hover:border-indigo-500 bg-slate-700/50' 
                      : 'border-slate-300 hover:border-indigo-500 bg-slate-50'
                  }`}
                >
                  <FiUpload className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-400' : 'text-slate-400'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    PDF, DOC, ZIP, images, or any file type (max 100MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {uploadingFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Selected Files ({uploadingFiles.length}):
                    </p>
                    {uploadingFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FiFile className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(index)}
                          className={`p-1 rounded ${isDark ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={() => { setShowUploadModal(false); setSelectedTask(null); setUploadingFiles([]); }}
                    className={`flex-1 px-4 py-2.5 rounded-lg border ${isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'} font-medium`}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleUpload(selectedTask.id)}
                    disabled={uploadingFiles.length === 0}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <FiUpload className="w-4 h-4" />
                    Upload {uploadingFiles.length > 0 && `(${uploadingFiles.length} file${uploadingFiles.length > 1 ? 's' : ''})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
