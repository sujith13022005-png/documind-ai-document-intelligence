import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const token = localStorage.getItem('documind_token');
        if (token) {
          const res = await api.getMe();
          setUser(res.user);
        } else {
          // Check if demo user preferred
          const res = await api.getMe().catch(() => null);
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('documind_token', res.user.id);
          }
        }
      } catch (err) {
        console.warn('Auth init failed:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password = 'password') => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      localStorage.setItem('documind_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password = 'password') => {
    setLoading(true);
    try {
      const res = await api.signup(name, email, password);
      localStorage.setItem('documind_token', res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('documind_token');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
