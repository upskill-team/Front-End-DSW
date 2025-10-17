// src/hooks/useEnrollment.ts

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { enrollService } from '../api/services/enrollment.service';
import type { Enrollment } from '../types/entities';
import type { AxiosError } from 'axios';

// El payload para inscribirse necesita el ID del perfil de estudiante
type EnrollInCoursePayload = {
  studentId: string;
  courseId: string;
};

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
    // Esta es la clave que DEBEMOS usar consistentemente
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

  const mutation = useMutation<Enrollment, AxiosError, EnrollInCoursePayload>({
    mutationFn: enrollService.enrollInCourse,
    // --- LÓGICA DE CACHÉ DEFINITIVA ---
    onSuccess: (newEnrollment) => {
      // `newEnrollment` es la respuesta del backend. Contiene el perfil de estudiante completo.
      // `newEnrollment.student.id` ES el `studentProfile.id` que necesitamos para la caché.
      
      const queryKey = [
        'enrollment', 
        'student', 
        newEnrollment.student.id, // <-- Usamos el ID del perfil de estudiante devuelto por la API
        'course', 
        newEnrollment.course.id   // <-- Usamos el ID del curso devuelto por la API
      ];
      
      // Actualizamos la caché para la clave que usa `useExistingEnrollment`
      queryClient.setQueryData(queryKey, newEnrollment);

      // Invalidamos la lista general de inscripciones del estudiante
      queryClient.invalidateQueries({ queryKey: ['enrollments', 'student', newEnrollment.student.id] });
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
      // Invalidar queries relacionadas
      // El backend puede devolver solo IDs o objetos completos, manejamos ambos casos
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

      // Invalidar todas las queries de enrollments como fallback
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
      // Invalidar queries relacionadas
      // El backend puede devolver solo IDs o objetos completos, manejamos ambos casos
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

      // Invalidar todas las queries de enrollments como fallback
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