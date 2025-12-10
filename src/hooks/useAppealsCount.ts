import { useQuery } from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';
import type { AxiosError } from 'axios';
import { useAuth } from './useAuth';

export const useAppealsCount = () => {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['appeals', 'pending-count'],
    queryFn: async () => {
      const response = await appealService.findAllAppeals({
        status: 'pending',
        limit: 1, 
        offset: 0,
      });
      return { count: response.total };
    },
    refetchInterval: 60000, 
    staleTime: 30000,
    enabled: isAuthenticated, 
    retry: false,
  });

  return {
    pendingCount: data?.count ?? 0,
    isLoading,
    error: error as AxiosError | null,
  };
};