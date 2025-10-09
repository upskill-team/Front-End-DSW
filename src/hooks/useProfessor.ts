import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { Professor } from '../types/entities';

/**
 * Hook to get the current professor profile
 */
export const useProfessorProfile = () => {
  return useQuery({
    queryKey: ['professors', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<{ status: number; message: string; data: Professor }>('/professors/me');
      return response.data.data;
    },
    // Only run this query if user is authenticated and is a professor
    enabled: true,
    retry: false,
  });
};