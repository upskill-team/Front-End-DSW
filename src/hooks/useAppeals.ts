import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';
import type { SearchAppealsParams, PaginatedAppealsResponse } from '../types/shared.ts';
import type { AxiosError } from 'axios';

export const useAppeals = (params: SearchAppealsParams = {}) => {
  return useQuery<PaginatedAppealsResponse, AxiosError>({
    queryKey: ['appeals', params],
    queryFn: () => appealService.findAllAppeals(params),
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