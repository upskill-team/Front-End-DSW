import { createContext } from 'react';
import type { User } from '../types/entities';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  login: () => { throw new Error('Login function not implemented'); },
  logout: () => { throw new Error('Logout function not implemented'); },
});