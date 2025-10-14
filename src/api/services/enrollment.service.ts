// src/api/services/enrollment.service.ts

import type { Enrollment, EnrollmentState } from '../../types/entities';
import type { ApiResponse } from '../../types/shared';
import apiClient from '../apiClient';

// --- Tipos de Payloads para las funciones ---

/**
 * Payload para crear una nueva inscripción.
 * El backend se encargará de los valores por defecto como 'state' y 'enrolledAt'.
 */
type EnrollInCoursePayload = {
  courseId: string;
  studentId: string;
};

/**

 * Payload para actualizar una inscripción existente.
 * Todas las propiedades son opcionales.
 */
type UpdateEnrollmentPayload = {
  state?: EnrollmentState;
  grade?: number;
  progress?: number;
};

// --- Funciones del Servicio ---

/**
 * Crea una nueva inscripción para un estudiante en un curso.
 */
const enrollInCourse = async (
  payload: EnrollInCoursePayload
): Promise<Enrollment> => {
  // NOTA: Tu código original envolvía el payload en { enrollment: payload }.
  // Usualmente, las APIs REST esperan el payload directamente en el body.
  // He cambiado a eso, pero si tu API realmente espera el objeto anidado,
  // puedes cambiarlo de nuevo a `apiClient.post(..., { enrollment: payload })`.
  const response = await apiClient.post<ApiResponse<Enrollment>>(
    '/enrollments',
    payload
  );

  return response.data.data;
};

/**
 * Busca una inscripción específica por la combinación de estudiante y curso.
 * Devuelve la inscripción si existe, o null/undefined si no (depende de tu API).
 */
const findByStudentAndCourse = async ({
  studentId,
  courseId,
}: {
  studentId: string;
  courseId: string;
}): Promise<Enrollment | null> => {
  // Asumiendo que la API devuelve un 200 con la inscripción o un 404 si no existe.
  // TanStack Query manejará el 404 como un error que podemos silenciar.
  try {
    const response = await apiClient.get<ApiResponse<Enrollment>>(
      `/enrollments/student/${studentId}/course/${courseId}`
    );
    return response.data.data;
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { status: number } };
      if (axiosError.response && axiosError.response.status === 404) {
        return null;
      }
    }
    throw error;
  }
};

/**
 * Obtiene todas las inscripciones del sistema (para vistas de administrador).
 */
const findAll = async (): Promise<Enrollment[]> => {
  const response = await apiClient.get<ApiResponse<Enrollment[]>>(
    '/enrollments'
  );
  return response.data.data;
};

/**
 * Obtiene una inscripción específica por su ID.
 */
const findById = async (enrollmentId: string): Promise<Enrollment> => {
  const response = await apiClient.get<ApiResponse<Enrollment>>(
    `/enrollments/${enrollmentId}`
  );
  return response.data.data;
};

/**
 * Obtiene todas las inscripciones de un estudiante específico.
 */
const findByStudent = async (studentId: string): Promise<Enrollment[]> => {
  const response = await apiClient.get<ApiResponse<Enrollment[]>>(
    `/enrollments/student/${studentId}`
  );

  return response.data.data;
};

/**
 * Obtiene todas las inscripciones de un curso específico.
 */
const findByCourse = async (courseId: string): Promise<Enrollment[]> => {
  const response = await apiClient.get<ApiResponse<Enrollment[]>>(
    `/enrollments/course/${courseId}`
  );
  return response.data.data;
};

/**
 * Actualiza una inscripción existente.
 */
const update = async (
  enrollmentId: string,
  payload: UpdateEnrollmentPayload
): Promise<Enrollment> => {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(
    `/enrollments/${enrollmentId}`,
    payload
  );
  return response.data.data;
};

/**
 * Elimina (o cancela) una inscripción.
 */
const remove = async (enrollmentId: string): Promise<void> => {
  // La respuesta de un DELETE exitoso a menudo no tiene cuerpo.
  // No necesitamos procesar `response.data`.
  await apiClient.delete(`/enrollments/${enrollmentId}`);
};

/**
 * Marca una unidad como completada.
 */
const completeUnit = async (
  enrollmentId: string,
  unitNumber: number
): Promise<Enrollment> => {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(
    `/enrollments/${enrollmentId}/complete-unit`,
    { unitNumber }
  );
  return response.data.data;
};

/**
 * Desmarca una unidad como completada.
 */
const uncompleteUnit = async (
  enrollmentId: string,
  unitNumber: number
): Promise<Enrollment> => {
  const response = await apiClient.patch<ApiResponse<Enrollment>>(
    `/enrollments/${enrollmentId}/uncomplete-unit`,
    { unitNumber }
  );
  return response.data.data;
};

// --- Exportación del Servicio ---

export const enrollService = {
  enrollInCourse,
  findByStudentAndCourse,
  findAll,
  findById,
  findByStudent,
  findByCourse,
  update,
  remove,
  completeUnit,
  uncompleteUnit,
};
