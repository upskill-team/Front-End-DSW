import { useQuery } from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';
import type { AxiosError } from 'axios';

/**
 * Hook to get the count of pending professor appeals
 * Useful for displaying badges in admin navigation
 */
export const useAppealsCount = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['appeals', 'pending-count'],
    queryFn: async () => {
      const response = await appealService.findAllAppeals({
        status: 'pending',
        limit: 1, // We only need the total count
        offset: 0,
      });
      return { count: response.total };
    },
    refetchInterval: 60000, // Refetch every minute to keep count updated
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  return {
    pendingCount: data?.count ?? 0,
    isLoading,
    error: error as AxiosError | null,
  };
};
