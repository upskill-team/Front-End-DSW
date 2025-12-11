import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { enrollService } from '../api/services/enrollment.service';
import type { Enrollment } from '../types/entities';
import type { AxiosError } from 'axios';

type EnrollInCoursePayload = {
  studentId: string;
  courseId: string;
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

export const useStudentEnrollments = (studentId: string | undefined) => {
  return useQuery<Enrollment[], AxiosError>({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: () => enrollService.findByStudent(studentId!),
    enabled: !!studentId,
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Enrollment, AxiosError, EnrollInCoursePayload>({
    mutationFn: enrollService.enrollInCourse,
    onSuccess: (newEnrollment) => {
      
      const queryKey = [
        'enrollment', 
        'student', 
        newEnrollment.student.id,
        'course', 
        newEnrollment.course.id
      ];

      queryClient.setQueryData(queryKey, newEnrollment);

      queryClient.invalidateQueries({ queryKey: ['enrollments', 'student', newEnrollment.student.id] });
    },
  });

  return {
    enroll: mutation.mutate,
    enrollAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};



/**
 * Hook para marcar una unidad como completada.
 */
export const useCompleteUnit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Enrollment,
    AxiosError,
    { enrollmentId: string; unitNumber: number }
  >({
    mutationFn: ({ enrollmentId, unitNumber }) =>
      enrollService.completeUnit(enrollmentId, unitNumber),
    onSuccess: (data) => {
      const studentId =
        typeof data.student === 'string' ? data.student : data.student?.id;
      const courseId =
        typeof data.course === 'string' ? data.course : data.course?.id;

      if (studentId && courseId) {
        queryClient.invalidateQueries({
          queryKey: ['enrollment', 'student', studentId, 'course', courseId],
        });

        queryClient.invalidateQueries({
          queryKey: ['enrollments', 'student', studentId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['enrollment'],
      });
    },
    onError: (error) => {
      console.error('Error al marcar unidad como completada:', error);
    },
  });

  return {
    completeUnit: mutation.mutate,
    completeUnitAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

/**
 * Hook para desmarcar una unidad como completada.
 */
export const useUncompleteUnit = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Enrollment,
    AxiosError,
    { enrollmentId: string; unitNumber: number }
  >({
    mutationFn: ({ enrollmentId, unitNumber }) =>
      enrollService.uncompleteUnit(enrollmentId, unitNumber),
    onSuccess: (data) => {
      const studentId =
        typeof data.student === 'string' ? data.student : data.student?.id;
      const courseId =
        typeof data.course === 'string' ? data.course : data.course?.id;

      if (studentId && courseId) {
        queryClient.invalidateQueries({
          queryKey: ['enrollment', 'student', studentId, 'course', courseId],
        });

        queryClient.invalidateQueries({
          queryKey: ['enrollments', 'student', studentId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['enrollment'],
      });
    },
    onError: (error) => {
      console.error('Error al desmarcar unidad:', error);
    },
  });

  return {
    uncompleteUnit: mutation.mutate,
    uncompleteUnitAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

