import { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/entities.ts';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userData: User | null, token: string) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated: !!user || !!localStorage.getItem('authToken'),
    user,
    isLoading: false,
    login,
    logout,
  }), [user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};