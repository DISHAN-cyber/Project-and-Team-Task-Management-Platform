'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { FiUpload, FiTrash2, FiFile, FiRefreshCw, FiCheckCircle, FiClock } from 'react-icons/fi';

interface TaskFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
  projectName: string;
  assignedBy: string;
  files: TaskFile[];
}

interface Stats {
  total: number;
  inProgress: number;
  completed: number;
  highPriority: number;
}

export default function TMTasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, inProgress: 0, completed: 0, highPriority: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);
  
  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUploadTaskId, setCurrentUploadTaskId] = useState<string | null>(null);

  // RBAC Protection
  useEffect(() => {
    if (!authLoading && user) {
      const normalizedRole = user.role.toUpperCase().replace(/\s+/g, '_');
      if (normalizedRole !== 'TEAM_MEMBER') {
        if (normalizedRole === 'PROJECT_MANAGER') router.replace('/pm');
        else if (normalizedRole === 'ADMIN') router.replace('/admin');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved === 'dark');
  }, []);

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('taskflow_token');
      const response = await fetch('http://localhost:4000/api/tm/tasks', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch tasks');
      const result = await response.json();
      
      if (result.success) {
        setTasks(result.data.tasks);
        setStats(result.data.stats);
      } else {
        setError(result.error || 'Failed to load tasks');
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Handle Upload Button Click
  const handleUploadClick = (taskId: string) => {
    setCurrentUploadTaskId(taskId);
    fileInputRef.current?.click(); // Triggers the hidden file input
  };

  // Handle File Selection and Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('--- UPLOAD DEBUG START ---');
    console.log('1. Files selected:', files);
    console.log('2. Current Task ID:', currentUploadTaskId);
    
    if (!files || files.length === 0 || !currentUploadTaskId) {
      console.log('❌ Aborting: No files or no task ID');
      return;
    }

    setUploadingTaskId(currentUploadTaskId);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
        console.log('3. Appended to FormData:', file.name, file.size);
      });

      const token = localStorage.getItem('taskflow_token');
      console.log('4. Token exists:', !!token);
      
      const uploadUrl = `http://localhost:4000/api/tm/tasks/${currentUploadTaskId}/upload`;
      console.log('5. Sending POST request to:', uploadUrl);

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('6. Response status:', response.status);
      const result = await response.json();
      console.log('7. Response data:', result);
      
      if (result.success) {
        alert(`Successfully uploaded ${result.data.files.length} file(s)!`);
        await fetchTasks(); // Refresh to show new files
      } else {
        alert('Upload failed: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      alert('Failed to upload files. Check console for details.');
    } finally {
      setUploadingTaskId(null);
      setCurrentUploadTaskId(null);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
      console.log('--- UPLOAD DEBUG END ---');
    }
  };

  // Handle File Delete
  const handleDeleteFile = async (taskId: string, fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const token = localStorage.getItem('taskflow_token');
      const response = await fetch(`http://localhost:4000/api/tm/tasks/${taskId}/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        await fetchTasks(); // Refresh
      } else {
        alert('Failed to delete file');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete file');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'done': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in_review': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-slate-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Tasks</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Tasks assigned to you. Click "Upload" to attach files.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>TOTAL TASKS</p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{stats.total}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>IN PROGRESS</p>
          <p className={`text-2xl font-bold mt-1 text-blue-600`}>{stats.inProgress}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>COMPLETED</p>
          <p className={`text-2xl font-bold mt-1 text-emerald-600`}>{stats.completed}</p>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>HIGH PRIORITY</p>
          <p className={`text-2xl font-bold mt-1 text-orange-600`}>{stats.highPriority}</p>
        </div>
      </div>

      {/* Hidden File Input (accepts multiple files) */}
      <input 
        type="file" 
        multiple 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
      />

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 shadow-sm`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border capitalize ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <span className={`text-xs font-bold uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{task.title}</h3>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{task.description || 'No description'}</p>
                  <div className={`flex flex-wrap gap-4 mt-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> Due: {task.dueDate || 'No due date'}</span>
                    <span className="flex items-center gap-1"><FiFile className="w-3 h-3" /> Project: {task.projectName}</span>
                  </div>
                </div>
                
                {/* Upload Button */}
                <button
                  onClick={() => handleUploadClick(task.id)}
                  disabled={uploadingTaskId === task.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    uploadingTaskId === task.id 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {uploadingTaskId === task.id ? (
                    <><FiRefreshCw className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><FiUpload className="w-4 h-4" /> Upload Files</>
                  )}
                </button>
              </div>

              {/* Attached Files Section */}
              <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <p className={`text-xs font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ATTACHED FILES ({task.files.length})
                </p>
                {task.files.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {task.files.map((file) => (
                      <div key={file.id} className={`flex items-center justify-between p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FiFile className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{file.name}</p>
                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <a 
                            href={`http://localhost:4000${file.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}`}
                          >
                            View
                          </a>
                          <button 
                            onClick={() => handleDeleteFile(task.id, file.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                            title="Delete file"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>No files attached yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={`text-center py-12 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <FiCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-medium">No tasks assigned to you</p>
          </div>
        )}
      </div>
    </div>
  );
}