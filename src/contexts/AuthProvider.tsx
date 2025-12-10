import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User } from '../types/entities.ts';
import { userService } from '../api/services/user.service.ts';
import { authService } from '../api/services/auth.service.ts';
import { AuthContext } from './AuthContext';
import apiClient, { TOKEN_STORAGE_KEY } from '../api/apiClient';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchProfileAndSetUser = useCallback(async () => {
    const userData = await userService.getProfile();
    setUser(userData);
    return userData;
  }, []);

  const login = useCallback(
    async (token: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchProfileAndSetUser();
    },
    [fetchProfileAndSetUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logout servidor:', error);
    } finally {
      queryClient.clear();
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      
      ['jwt_token', 'token', 'authToken'].forEach((k) => localStorage.removeItem(k));

      delete apiClient.defaults.headers.common['Authorization'];
      setUser(null);
      setIsLoading(false);
    }
  }, [queryClient]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      const trySilentRefresh = async () => {
        try {
          const { data } = await apiClient.post('/auth/refresh');
          const newToken = data.data.token;
          if (newToken) {
            await login(newToken);
            return true;
          }
        } catch {
          return false;
        }
        return false;
      };

      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          await fetchProfileAndSetUser();
        } catch {
          console.warn("Token local inválido o expirado. Intentando renovar sesión...");
          
          const success = await trySilentRefresh();
          
          if (!success) {
            console.error("No se pudo restaurar la sesión.");
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setUser(null);
          }
        }
      } else {
        await trySilentRefresh();
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, [fetchProfileAndSetUser, login]);

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