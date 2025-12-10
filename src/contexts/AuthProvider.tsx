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

// This provider handles authentication and user state globally.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State for the authenticated user and to know if we're loading data.
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Function to get the user's profile and update the global state.
  const fetchProfileAndSetUser = useCallback(async () => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
    } catch (error) {
      // If it fails, we remove the token and log out the user.
      console.error('Failed to fetch profile, logging out.', error);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  // Login function: saves the token, sets it in the header, and gets the profile.
  const login = useCallback(
    async (token: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchProfileAndSetUser();
    },
    [fetchProfileAndSetUser]
  );

  // Logout function: Clears server cookie, local storage, and state.
  const logout = useCallback(async () => {
    try {
      // 1. Call backend to clear the HttpOnly cookie
      await authService.logout();
    } catch (error) {
      console.error('Server logout failed (likely already expired)', error);
    } finally {
      // 2. Clear all React Query caches to avoid stale data
      queryClient.clear();

      // 3. Remove JWT token from localStorage
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      // Clean up defensive keys if any
      const authKeys = [
        'jwt_token',
        'token',
        'authToken',
        'access_token',
        'refresh_token',
      ];
      authKeys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
        }
      });

      // 4. Clear Authorization header from future requests
      delete apiClient.defaults.headers.common['Authorization'];

      // 5. Reset state
      setUser(null);
      setIsLoading(false);
      console.log('Logout local completado');
    }
  }, [queryClient]);

  // Initialization logic: Check for token OR try silent refresh via cookie
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (token) {
        // Case A: Token exists in LocalStorage
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchProfileAndSetUser();
      } else {
        // Case B: No token in LS, try Silent Refresh via Cookie
        try {
          // This call sends the HttpOnly cookie. If valid, returns new AccessToken.
          const { data } = await apiClient.post('/auth/refresh');
          const newToken = data.data.token;
          
          if (newToken) {
            console.log('Session restored via Refresh Token');
            // We use the internal login logic but avoid the double fetch if possible,
            // though reusing 'login' is safer to ensure consistency.
            await login(newToken);
          }
        } catch {
          // No session found (401), user is anonymous
          // console.log('No active session found');
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, [fetchProfileAndSetUser, login]);

  // Provide the context to child components.
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