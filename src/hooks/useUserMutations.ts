import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, type UpdateProfilePayload } from '../api/services/user.service.ts';
import { toast } from 'react-hot-toast';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('¡Perfil actualizado exitosamente!');
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    }
  });
};