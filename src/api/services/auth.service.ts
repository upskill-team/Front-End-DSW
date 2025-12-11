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
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Failed to get user profile', error);
    throw error;
  }
};

// Sends a password reset request
const forgotPassword = async (mail: string): Promise<void> => {
  await apiClient.post('/auth/forgot-password', { mail });
};

// Resets the password using a token
const resetPassword = async (token: string, password_plaintext: string): Promise<void> => {
  await apiClient.post('/auth/reset-password', { token, password_plaintext });
};

// Logout: Calls backend to clear HttpOnly cookie
const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const authService = {
  login,
  register,
  getProfile,
  forgotPassword,
  resetPassword,
  logout,
};