'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, setToken, ApiError } from './api';
import { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('taskflow_token') : null;
    if (!stored) {
      setLoading(false);
      return;
    }
    api
      .get<{ user: User }>('/auth/me')
      .then((res) => setUser(res.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
        setToken(res.token);
        setUser(res.user);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Login failed');
        throw err;
      }
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      try {
        const res = await api.post<{ user: User; token: string }>('/auth/register', { name, email, password });
        setToken(res.token);
        setUser(res.user);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Registration failed');
        throw err;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
