import apiClient from '../apiClient';
import type { User } from '../../types/entities';

type LoginPayload = {email: string; password_plaintext: string};
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

export const authService = {
  login,
  register,
};