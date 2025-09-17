import apiClient from '../apiClient';
import type { User } from '../../types/entities';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export type UpdateProfilePayload = {
  data: Partial<{
    name: string;
    surname: string;
    mail: string;
    phone?: string;
    location?: string;
    birthdate?: string;
  }>;
  profilePicture?: File | null;
};

const updateProfile = async ({ data, profilePicture }: UpdateProfilePayload): Promise<User> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  const response = await apiClient.patch<ApiResponse<User>>('/users/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<ApiResponse<User>>('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Failed to get user profile', error);
    throw error;
  }
};

export const userService = {
  updateProfile,
  getProfile,
};