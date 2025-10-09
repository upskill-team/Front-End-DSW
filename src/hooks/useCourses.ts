import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
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
  const LIMIT = params.limit || 9

  return useInfiniteQuery<PaginatedCoursesResponse, AxiosError>({
    queryKey: ['courses', params],
    queryFn: ({ pageParam = 0 }) => {
      const queryParams = { ...params, limit: LIMIT, offset: pageParam as number }
      return courseService.search(queryParams)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = (allPages.length - 1) * LIMIT
      const totalFetched = currentOffset + lastPage.courses.length

      if (totalFetched < lastPage.total) {
        return totalFetched
      }
      
      return undefined
    },
  })
}