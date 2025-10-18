import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types/entities.ts';
import { userService } from '../api/services/user.service.ts';
import { AuthContext } from './AuthContext';
import apiClient, { TOKEN_STORAGE_KEY } from '../api/apiClient';
import { toast } from 'react-hot-toast';
import { isAxiosError } from 'axios';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// This provider handles authentication and user state globally.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const logout = useCallback(() => {
    queryClient.clear();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  }, [queryClient]);

  const fetchProfileAndSetUser = useCallback(async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        toast.error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.', {
          id: 'session-expired-toast',
          duration: 5000,
        });

        logout();

      } else {
        console.error('Failed to fetch profile, logging out.', error);
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    const validateTokenOnLoad = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        await fetchProfileAndSetUser();
      }
      setIsLoading(false);
    };
    validateTokenOnLoad();
  }, [fetchProfileAndSetUser]);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchProfileAndSetUser();
    },
    [fetchProfileAndSetUser]
  );

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};