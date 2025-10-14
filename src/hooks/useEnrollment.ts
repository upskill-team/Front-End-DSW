import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { enrollService } from '../api/services/enrollment.service';
import type { Enrollment } from '../types/entities';
import type { AxiosError } from 'axios';

type EnrollInCoursePayload = Parameters<typeof enrollService.enrollInCourse>[0];
type UpdateEnrollmentPayload = {
  enrollmentId: string;
  data: Parameters<typeof enrollService.update>[1];
};

export const useEnrollments = () => {
  return useQuery<Enrollment[], AxiosError>({
    queryKey: ['enrollments'],
    queryFn: enrollService.findAll,
  });
};

export const useExistingEnrollment = (
  studentId: string | undefined,
  courseId: string | undefined,
  options?: Partial<UseQueryOptions<Enrollment | null, AxiosError>>
) => {
  return useQuery<Enrollment | null, AxiosError>({
    queryKey: ['enrollment', 'student', studentId, 'course', courseId],
    queryFn: () => enrollService.findByStudentAndCourse({ studentId: studentId!, courseId: courseId! }),
    enabled: !!studentId && !!courseId,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });
};


export const useEnrollmentById = (enrollmentId: string | undefined) => {
  return useQuery<Enrollment, AxiosError>({
    queryKey: ['enrollment', enrollmentId],
    queryFn: () => enrollService.findById(enrollmentId!),
    enabled: !!enrollmentId,
  });
};

export const useStudentEnrollments = (studentId: string | undefined) => {
  return useQuery<Enrollment[], AxiosError>({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: () => enrollService.findByStudent(studentId!),
    enabled: !!studentId,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Enrollment,
    AxiosError,
    EnrollInCoursePayload
  >({
    mutationFn: enrollService.enrollInCourse,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['enrollment', 'student', variables.studentId, 'course', variables.courseId]
      });
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'student', variables.studentId] });
    },
  });

  return {
    enroll: mutation.mutate,
    enrollAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export const useUpdateEnrollment = () => {
  const mutation = useMutation<
    Enrollment,
    AxiosError,
    UpdateEnrollmentPayload
  >({
    mutationFn: ({ enrollmentId, data }) => enrollService.update(enrollmentId, data),
  });

  return {
    updateEnrollment: mutation.mutate,
    updateEnrollmentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export const useDeleteEnrollment = () => {
  const mutation = useMutation<
    void,
    AxiosError,
    string
  >({
    mutationFn: (enrollmentId: string) => enrollService.remove(enrollmentId),
  });

  return {
    deleteEnrollment: mutation.mutate,
    deleteEnrollmentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};