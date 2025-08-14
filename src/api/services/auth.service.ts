import apiClient from '../apiClient';
import type { User } from '../../types/entities';

// Generic API response type
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Types for login and register requests
type LoginPayload = { mail: string; password_plaintext: string };
type RegisterPayload = Omit<
  User,
  | 'password'
  | 'id'
  | 'role'
  | 'studentProfile'
  | 'professorProfile'
  | 'profile_picture'
> & { password_plaintext: string };

// Returns JWT token if login is successful
const login = async (payload: LoginPayload): Promise<string> => {
  const response = await apiClient.post<ApiResponse<{ token: string }>>(
    '/auth/login',
    payload
  );

  const token = response.data.data.token;

  if (typeof token !== 'string' || token.length === 0) {
    throw new Error('Token no fue recibido en la respuesta del servidor.');
  }

  return token;
};

// Registers a new user and returns user data
const register = async (payload: RegisterPayload): Promise<User> => {
  const response = await apiClient.post<ApiResponse<User>>(
    '/auth/register',
    payload
  );
  return response.data.data;
};

// Gets the current user's profile
const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data.data;
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
