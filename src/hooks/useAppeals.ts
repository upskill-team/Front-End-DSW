import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';

export const useAppeals = () => {
  return useQuery({
    queryKey: ['appeals'],
    queryFn: appealService.findAllAppeals,
  });
};

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