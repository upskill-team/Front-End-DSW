import apiClient from '../apiClient';
import type { User } from '../../types/entities';

type LoginPayload = {mail: string; password_plaintext: string};
type RegisterPayload = Omit<User, 'password' | 'id' | 'role' | 'studentProfile' | 'professorProfile' | 'profile_picture'> & { password_plaintext: string };

interface AuthResponse {
  token: string;
  user: User;
}

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

const register = async (payload: RegisterPayload): Promise<User> => {
  const response = await apiClient.post<User>('/auth/register', payload);
  return response.data;
};

const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to get user profile', error);
    throw error;
  }
};

export const authService = {
  login,
  register,
  getProfile,
};