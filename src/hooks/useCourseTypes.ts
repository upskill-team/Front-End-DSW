import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseTypeService } from '../api/services/courseType.service';
import type { CourseType } from '../types/entities';
import type { SearchCourseTypesParams } from '../types/shared';

export const useCourseTypes = (params: SearchCourseTypesParams) => {
  return useQuery({
    queryKey: ['courseTypes', params],
    queryFn: () => courseTypeService.findAll(params),
  });
};

export const useCreateCourseType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CourseType, 'id' | 'courses'>) => courseTypeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseTypes'] });
    },
  });
};

export const useUpdateCourseType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Omit<CourseType, 'id' | 'courses'> }) => 
      courseTypeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseTypes'] });
    },
  });
};

export const useDeleteCourseType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseTypeService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseTypes'] });
    },
  });
};