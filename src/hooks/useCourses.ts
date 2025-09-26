import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../api/services/course.service';
import type { Course } from '../types/entities.ts';
import type { AxiosError } from 'axios';
import type { PaginatedCoursesResponse, SearchCoursesParams } from '../types/shared.ts';

type CreateCourseFormData = Parameters<typeof courseService.create>[0];

type UpdateCoursePayload = {
  courseId: string;
  data: FormData;
};

export const useProfessorCourses = () => {
  return useQuery({
    queryKey: ['professorCourses'],
    queryFn: courseService.getProfessorCourses,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Course,
    AxiosError,
    CreateCourseFormData
  >({
    mutationFn: (payload: CreateCourseFormData) => courseService.create(payload),
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

/**
 * Hook para buscar, filtrar y paginar cursos.
 * @param params - Objeto de filtros que se pasará a la API.
 */
export const useSearchCourses = (params: SearchCoursesParams) => {
  return useQuery<PaginatedCoursesResponse, AxiosError>({
    // La queryKey DEBE incluir los parámetros para que la caché funcione correctamente.
    // React Query detectará cambios en el objeto `params` y volverá a hacer fetch.
    queryKey: ['courses', params], 

    // La función de consulta ahora llama a al nuevo método del servicio.
    queryFn: () => courseService.search(params),

    // Opcional pero recomendado: mantiene los datos anteriores visibles mientras se cargan los nuevos.
    // Esto proporciona una mejor experiencia de usuario durante la paginación.
    /*keepPreviousData: true,*/ 
  });
};