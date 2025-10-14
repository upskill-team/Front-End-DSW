import apiClient from '../apiClient';
import type { ApiResponse } from '../../types/shared';

/**
 * Fetches the total count of registered students.
 * @returns {Promise<number>} A promise that resolves to the total number of students.
 */
const getTotalCount = async (): Promise<number> => {
  const response = await apiClient.get<ApiResponse<{ total: number }>>('/students/count');
  return response.data.data.total;
};

export const studentService = {
  getTotalCount,
};