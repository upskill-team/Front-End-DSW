import { createContext } from 'react';
import type { User } from '../types/entities';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (userData: User | null, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);