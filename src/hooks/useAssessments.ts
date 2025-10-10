import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import assessmentService from '../api/services/assessment.service';
import type {
  Assessment,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  AssessmentAttempt,
  StartAttemptRequest,
  AnswerQuestionRequest,
  SubmitAttemptRequest,
} from '../types/entities';

export const useAssessments = (courseId?: string) => {
  return useQuery<Assessment[], Error>({
    queryKey: courseId ? ['assessments', courseId] : ['assessments'],
    queryFn: () => assessmentService.getAll(courseId),
  });
};

export const useAssessment = (id: string | undefined) => {
  return useQuery<Assessment, Error>({
    queryKey: ['assessment', id],
    queryFn: () => assessmentService.getById(id!),
    enabled: !!id,
  });
};

export const useAssessmentAttempts = (assessmentId: string | undefined) => {
  return useQuery<AssessmentAttempt[], Error>({
    queryKey: ['assessment-attempts', assessmentId],
    queryFn: () => assessmentService.getAttemptsByAssessment(assessmentId!),
    enabled: !!assessmentId,
  });
};

export const useAttemptDetails = (attemptId: string | undefined) => {
  return useQuery<AssessmentAttempt, Error>({
    queryKey: ['attempt', attemptId],
    queryFn: () => assessmentService.getAttemptById(attemptId!),
    enabled: !!attemptId,
  });
};

export const useStudentAttempts = (studentId: string | undefined) => {
  return useQuery<AssessmentAttempt[], Error>({
    queryKey: ['student-attempts', studentId],
    queryFn: () => assessmentService.getAttemptsByStudent(studentId!),
    enabled: !!studentId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation<Assessment, Error, CreateAssessmentRequest>({
    mutationFn: (data) => assessmentService.create(data),
    onSuccess: (newAssessment) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({
        queryKey: ['assessments', newAssessment.course.id],
      });
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Assessment,
    Error,
    { id: string; data: UpdateAssessmentRequest }
  >({
    mutationFn: ({ id, data }) => assessmentService.update(id, data),
    onSuccess: (updatedAssessment) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.invalidateQueries({
        queryKey: ['assessments', updatedAssessment.course.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['assessment', updatedAssessment.id],
      });
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => assessmentService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
    },
  });
};

export const useStartAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation<AssessmentAttempt, Error, StartAttemptRequest>({
    mutationFn: (data) => assessmentService.startAttempt(data),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({
        queryKey: ['assessment-attempts', attempt.assessment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['student-attempts', attempt.student.id],
      });
    },
  });
};

export const useAnswerQuestion = () => {
  return useMutation<unknown, Error, AnswerQuestionRequest>({
    mutationFn: (data) => assessmentService.answerQuestion(data),
  });
};

export const useSubmitAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation<AssessmentAttempt, Error, SubmitAttemptRequest>({
    mutationFn: (data) => assessmentService.submitAttempt(data),
    onSuccess: (attempt) => {
      queryClient.invalidateQueries({
        queryKey: ['assessment-attempts', attempt.assessment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['student-attempts', attempt.student.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['attempt', attempt.id],
      });
    },
  });
};
