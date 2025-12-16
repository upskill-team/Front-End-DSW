import { useMutation } from '@tanstack/react-query';
import { courseService } from '../api/services/course.service';
import type { QuickSaveRequest } from '../types/entities';
import type { AxiosError } from 'axios';

export const useQuickSave = () => {
  return useMutation<
    void,
    AxiosError,
    { courseId: string; data: QuickSaveRequest }
  >({
    mutationFn: ({ courseId, data }) => courseService.quickSave(courseId, data),
    onSuccess: () => {
    },
  });
};