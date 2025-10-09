import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { joinRequestService } from '../api/services/joinRequest.service';

/**
 * Hook to create a new join request.
 */
export const useCreateJoinRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (institutionId: string) => joinRequestService.create(institutionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', 'me', 'pending'] });
    },
  });
};

/**
 * Hook to fetch pending join requests for a specific institution. (For managers)
 * @param {string} institutionId - The ID of the institution.
 */
export const useGetPendingRequests = (institutionId: string) => {
  return useQuery({
    queryKey: ['join-requests', 'pending', institutionId],
    queryFn: () => joinRequestService.getPendingForInstitution(institutionId),
    enabled: !!institutionId,
  });
};

/**
 * Hook to process a join request (accept or reject). (For managers)
 */
export const useProcessJoinRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      joinRequestService.process(requestId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', 'pending'] });
      if (variables.action === 'accept') {
        queryClient.invalidateQueries({ queryKey: ['institutions', 'managed'] });
        queryClient.invalidateQueries({ queryKey: ['professors', 'me'] });
      }
    },
  });
};

/**
 * Hook to fetch the current professor's pending join request.
 */
export const useGetMyPendingRequest = () => {
  return useQuery({
    queryKey: ['join-requests', 'me', 'pending'],
    queryFn: () => joinRequestService.findMyPendingRequest(),
    retry: false,
  });
};

/**
 * Hook to cancel a join request. (For professors)
 */
export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => joinRequestService.cancelRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['join-requests', 'me', 'pending'] });
    },
  });
};