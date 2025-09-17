import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UpdateProfilePayload } from '../api/services/user.service.ts';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};