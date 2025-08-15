import apiClient from '../apiClient';
import type { Appeal } from '../../types/entities';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * @param formData
 * @returns
 */
const createAppeal = async (formData: FormData): Promise<Appeal> => {

  const response = await apiClient.post<ApiResponse<Appeal>>('/appeals', formData);

  return response.data.data;
};

export const appealService = {
  createAppeal,
};