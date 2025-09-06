import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../api/services/course.service';
import type { Course } from '../types/entities.ts';
import type { AxiosError } from 'axios';

type FormData = Parameters<typeof courseService.create>[0];
type UpdateCoursePayload = {
  courseId: string;
  data: Parameters<typeof courseService.update>[1];
};

export const useProfessorCourses = () => {
  return useQuery({
    queryKey: ['professorCourses'],
    queryFn: courseService.getProfessorCourses,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  // --- 2. AÑADE LOS TIPOS GENÉRICOS A useMutation ---
  return useMutation<
    Course,
    AxiosError,
    FormData
  >({
    mutationFn: (payload: FormData) => courseService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: UpdateCoursePayload) => courseService.update(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => courseService.remove(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};