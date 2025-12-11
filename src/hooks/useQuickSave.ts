import { useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../api/services/course.service';
import type { QuickSaveRequest } from '../types/entities';
import type { AxiosError } from 'axios';

// Hook para guardado rápido sin validación completa
export const useQuickSave = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { courseId: string; data: QuickSaveRequest }
  >({
    mutationFn: ({ courseId, data }) => courseService.quickSave(courseId, data),
    onSuccess: () => {
      // Invalidar cache para reflejar cambios
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};
