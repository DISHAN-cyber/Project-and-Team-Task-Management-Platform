'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/use-theme'; // ← Import shared hook
import { Sidebar } from '@/components/Sidebar';
import { FiSearch, FiBell, FiSettings, FiSun, FiMoon, FiX } from 'react-icons/fi';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isDark, setTheme } = useTheme(); // ← Use shared hook
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/');
  }, [loading, user, router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { 
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
  });
  
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });

  if (loading) return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  if (!user) return null;

  return (
    <div className={`flex h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
      {/* Sidebar */}
      <div className="flex-shrink-0 w-64 h-screen overflow-y-auto bg-slate-900">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className={`h-16 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-b flex items-center justify-between px-6 transition-colors duration-300`}>
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects, tasks, team, or reports..." 
                className={`w-full pl-12 pr-4 py-2.5 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'} border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Clock */}
            <div className={`hidden md:flex items-center gap-3 px-4 py-2 ${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'} border rounded-lg transition-colors`}>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-indigo-900'}`}>{formatTime(currentTime)}</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-indigo-600'}`}>{formatDate(currentTime)}</span>
              </div>
            </div>

            {/* Bell */}
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }} className={`relative p-2.5 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-indigo-50'} rounded-lg transition-colors`}>
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl shadow-xl z-50`}>
                  <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
                  </div>
                  <div className="p-4"><p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No new notifications</p></div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative">
              <button onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }} className={`p-2.5 ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-indigo-50'} rounded-lg transition-colors`}>
                <FiSettings className="w-5 h-5" />
              </button>
              
              {showSettings && (
                <div className={`absolute right-0 mt-2 w-72 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl shadow-xl z-50`}>
                  <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-between`}>
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h3>
                    <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600"><FiX className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Appearance</p>
                    <div className="space-y-2">
                      {/* Dark Mode Button */}
                      <button onClick={() => setTheme(true)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isDark ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-200 hover:border-indigo-300'}`}>
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center"><FiMoon className="w-5 h-5 text-indigo-400" /></div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dark Mode</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Easy on the eyes</p>
                        </div>
                        {isDark && <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                      </button>

                      {/* Light Mode Button */}
                      <button onClick={() => setTheme(false)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${!isDark ? 'border-indigo-500 bg-indigo-50' : 'border-slate-600 hover:border-slate-500'}`}>
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><FiSun className="w-5 h-5 text-amber-500" /></div>
                        <div className="flex-1 text-left">
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Light Mode</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clean and bright</p>
                        </div>
                        {!isDark && <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className={`flex-1 overflow-y-auto ${isDark ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Click outside to close dropdowns */}
      {(showSettings || showNotifications) && <div className="fixed inset-0 z-40" onClick={() => { setShowSettings(false); setShowNotifications(false); }} />}
    </div>
  );
}