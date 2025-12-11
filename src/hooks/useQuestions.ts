import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionService } from '../api/services/question.service';
import type { Question } from '../types/entities';

export const useQuestions = (courseId: string, unitNumber: number | null) => {
  return useQuery({
    queryKey: ['questions', courseId, unitNumber],
    queryFn: () => questionService.getByUnit(courseId, unitNumber!),
    enabled: !!courseId && unitNumber !== null && unitNumber > 0,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      unitNumber,
      data,
    }: {
      courseId: string;
      unitNumber: number;
      data: Omit<Question, 'id' | 'unitNumber'>;
    }) => questionService.create(courseId, unitNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.courseId, variables.unitNumber],
      });
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.courseId],
      });
    },
  });
};

export const useCreateGeneralQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: Omit<Question, 'id' | 'unitNumber'>;
    }) => questionService.createGeneral(courseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.courseId],
      });
    },
  });
};

export const useAllCourseQuestions = (courseId: string) => {
  return useQuery({
    queryKey: ['questions', courseId],
    queryFn: () => questionService.getAllByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      unitNumber,
      questionId,
      data,
    }: {
      courseId: string;
      unitNumber: number;
      questionId: string;
      data: Partial<Question>;
    }) => questionService.update(courseId, unitNumber, questionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.courseId, variables.unitNumber],
      });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      unitNumber,
      questionId,
    }: {
      courseId: string;
      unitNumber: number;
      questionId: string;
    }) => questionService.delete(courseId, unitNumber, questionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['questions', variables.courseId, variables.unitNumber],
      });
    },
  });
};
