import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/entities.ts';
import { authService } from '../api/services/auth.service.ts';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await authService.getProfile(); 
          setUser(userData);
        } catch (error) {
          console.error("Session validation failed:", error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    validateSession();
  }, []);

  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = useMemo(() => ({
    isAuthenticated: !!user,
    user,
    isLoading,
    login,
    logout,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};