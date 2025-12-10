import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';
import type { SearchAppealsParams, PaginatedAppealsResponse } from '../types/shared.ts';
import type { Appeal } from '../types/entities.ts';
import type { AxiosError } from 'axios';
import { useAuth } from './useAuth.ts';

export const useAppeals = (params: SearchAppealsParams = {}) => {
  const { isAuthenticated } = useAuth();

  return useQuery<PaginatedAppealsResponse, AxiosError>({
    queryKey: ['appeals', params],
    queryFn: () => appealService.findAllAppeals(params),
    enabled: isAuthenticated,
  });
}

export const useUpdateAppealState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ appealId, payload }: { appealId: string; payload: { state: 'accepted' | 'rejected' } }) => 
      appealService.updateAppealState(appealId, payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
  });
};

export const useMyAppeals = () => {
  const { isAuthenticated } = useAuth();

  return useQuery<Appeal[], AxiosError>({
    queryKey: ['appeals', 'me'],
    queryFn: appealService.getMyAppeals,
    enabled: isAuthenticated,
    retry: false,
  });
};