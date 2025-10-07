import { useState, useMemo, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/entities.ts';
import { userService } from '../api/services/user.service.ts';
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

  // When this runs for the first time, we look for a saved token and try to log in with it.
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

  // Login function: saves the token, sets it in the header, and gets the profile.
  const login = useCallback(
    async (token: string) => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await fetchProfileAndSetUser();
    },
    [fetchProfileAndSetUser]
  );

  // Logout function: removes the token and header, and clears the user.
  const logout = useCallback(() => {
    try {
      // Remove JWT token from localStorage using the correct key
      localStorage.removeItem(TOKEN_STORAGE_KEY);

      // Also remove any other common auth-related keys (defensive cleanup)
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

      // Clear Authorization header from future requests
      delete apiClient.defaults.headers.common['Authorization'];

      // Clear user state
      setUser(null);
      setIsLoading(false);

      console.log('Logout completado exitosamente');
    } catch (error) {
      console.error('Error durante logout:', error);
      // Force cleanup even if something fails
      localStorage.clear();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // We keep these values ready so the app doesn't reload too much.
  const value = useMemo(
    () => ({
      isAuthenticated: !!user, // We know if someone is logged in if there's a user object.
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  // Provide the context to child components.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
