// src/hooks/useEnrollment.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollService } from '../api/services/enrollment.service'; // Asegúrate de que la ruta sea correcta
import type { Enrollment } from '../types/entities';
import type { AxiosError } from 'axios';

// --- Tipos de Payload ---

// Tipo para la mutación de creación, extraído directamente del servicio
type EnrollInCoursePayload = Parameters<typeof enrollService.enrollInCourse>[0];

// Tipo para la mutación de actualización
type UpdateEnrollmentPayload = {
  enrollmentId: string;
  data: Parameters<typeof enrollService.update>[1]; // El segundo parámetro de la función 'update'
};

// --- Hooks de Query (Para obtener datos) ---

/**
 * Hook para obtener TODAS las inscripciones (probablemente para un admin).
 */
export const useEnrollments = () => {
  return useQuery<Enrollment[], AxiosError>({
    queryKey: ['enrollments'],
    queryFn: enrollService.findAll,
  });
};

/**
 * Hook para verificar si ya existe una inscripción para una combinación
 * específica de estudiante y curso.
 * @param studentId - El ID del estudiante.
 * @param courseId - El ID del curso.
 */
export const useExistingEnrollment = (
  studentId: string | undefined,
  courseId: string | undefined
) => {
  return useQuery<Enrollment | null, AxiosError>({
    // La clave de query es compuesta para ser única para esta combinación
    queryKey: ['enrollment', 'student', studentId, 'course', courseId],

    // La función que se ejecutará
    queryFn: () =>
      enrollService.findByStudentAndCourse({
        studentId: studentId!,
        courseId: courseId!,
      }),

    // MUY IMPORTANTE: La query solo se ejecutará si AMBOS IDs están presentes.
    enabled: !!studentId && !!courseId,

    // Opcional pero recomendado para este caso de uso:
    // No queremos que vuelva a intentar si da 404 (no encontrado).
    retry: (failureCount, error) => {
      if (error.response?.status === 404) {
        return false;
      }
      return failureCount < 3; // Reintenta 3 veces para otros errores
    },
  });
};

/**
 * Hook para obtener una inscripción específica por su ID.
 * @param enrollmentId - El ID de la inscripción.
 */
export const useEnrollmentById = (enrollmentId: string | undefined) => {
  return useQuery<Enrollment, AxiosError>({
    queryKey: ['enrollment', enrollmentId],
    queryFn: () => enrollService.findById(enrollmentId!),
    enabled: !!enrollmentId, // La query solo se ejecuta si el ID existe
  });
};

/**
 * Hook para obtener todas las inscripciones de un estudiante específico.
 * @param studentId - El ID del estudiante.
 */
export const useStudentEnrollments = (studentId: string | undefined) => {
  return useQuery<Enrollment[], AxiosError>({
    queryKey: ['enrollments', 'student', studentId], // Clave de query compuesta y específica
    queryFn: () => enrollService.findByStudent(studentId!),
    enabled: !!studentId,
  });
};

// --- Hooks de Mutación (Para modificar datos) ---

/**
 * Hook para la acción de inscribir un estudiante en un curso.
 */
export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Enrollment, AxiosError, EnrollInCoursePayload>({
    mutationFn: enrollService.enrollInCourse,

    // --- MODIFICACIÓN CLAVE AQUÍ ---
    onSuccess: (_data, variables) => {
      // `_data` es la respuesta de la mutación (la nueva inscripción).
      // `variables` es el payload que se envió a la mutación (lo que necesitamos).

      // 1. Invalidamos la query que verifica la existencia de la inscripción.
      //    La queryKey DEBE COINCIDIR EXACTAMENTE con la del hook `useExistingEnrollment`.
      queryClient.invalidateQueries({
        queryKey: [
          'enrollment',
          'student',
          variables.studentId,
          'course',
          variables.courseId,
        ],
      });

      // 2. También invalidamos la lista de inscripciones del estudiante (esto ya lo tenías, es correcto).
      queryClient.invalidateQueries({
        queryKey: ['enrollments', 'student', variables.studentId],
      });

      // 3. Opcional: invalidar la lista general si es necesario.
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });

      console.log('Enrollment successful. Relevant queries invalidated.');
    },
    onError: (error) => {
      console.error('Error al intentar inscribir:', error);
    },
  });

  return {
    enroll: mutation.mutate,
    enrollAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    // ...etc
  };
};

/**
 * Hook para actualizar una inscripción existente (ej. cambiar estado, progreso, nota).
 */
export const useUpdateEnrollment = () => {
  /*const queryClient = useQueryClient();*/

  const mutation = useMutation<Enrollment, AxiosError, UpdateEnrollmentPayload>(
    {
      mutationFn: ({ enrollmentId, data }) =>
        enrollService.update(enrollmentId, data),
      onSuccess: () => {
        // ... invalidaciones
      },
    }
  );

  return {
    updateEnrollment: mutation.mutate, // Renombramos para ser más descriptivo
    updateEnrollmentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    // ...etc
  };
};

/**
 * Hook para eliminar (o cancelar) una inscripción.
 */
export const useDeleteEnrollment = () => {
  /*const queryClient = useQueryClient();*/

  const mutation = useMutation<void, AxiosError, string>({
    mutationFn: (enrollmentId: string) => enrollService.remove(enrollmentId),
    onSuccess: () => {
      // ... invalidaciones
    },
  });

  return {
    deleteEnrollment: mutation.mutate, // Renombramos
    deleteEnrollmentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    // ...etc
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
