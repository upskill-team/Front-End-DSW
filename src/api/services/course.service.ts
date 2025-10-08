import apiClient from '../apiClient';
import type { Course, QuickSaveRequest } from '../../types/entities';
import type {
  PaginatedCoursesResponse,
  SearchCoursesParams,
} from '../../types/shared.ts';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const getProfessorCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<ApiResponse<Course[]>>(
    '/courses/my-courses'
  );
  return response.data.data;
};

/**
 * Obtiene un único curso por su ID.
 * @param courseId - El ID del curso a recuperar.
 * @returns Una promesa que resuelve con los datos del curso.
 */
const getById = async (courseId: string): Promise<Course> => {
  const response = await apiClient.get<ApiResponse<Course>>(`/courses/${courseId}`);

  // Desenvolvemos el objeto del curso de la propiedad `data` de la respuesta
  return response.data.data;
};

const create = async (payload: FormData): Promise<Course> => {
  const response = await apiClient.post<ApiResponse<Course>>(
    '/courses',
    payload
  );
  return response.data.data;
};

const update = async (courseId: string, data: FormData): Promise<Course> => {
  const response = await apiClient.put<ApiResponse<Course>>(
    `/courses/${courseId}`,
    data
  );
  return response.data.data;
};

const remove = async (courseId: string): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}`);
};
/**
 * Busca cursos con filtros, paginación y ordenación.
 * @param params - Un objeto con los parámetros de búsqueda.
 * @returns Una promesa con los cursos y el conteo total.
 */
const search = async (
  params: SearchCoursesParams
): Promise<PaginatedCoursesResponse> => {
  // Se encarga automáticamente de la codificación de caracteres especiales.
  const queryParams = new URLSearchParams();

  // Añadimos solo los parámetros que están definidos
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient.get<ApiResponse<PaginatedCoursesResponse>>(
    `/courses?${queryParams.toString()}`
  );
  return response.data.data;
};

const quickSave = async (
  courseId: string,
  data: QuickSaveRequest
): Promise<void> => {
  console.log('Quick save request:', { courseId, data });
  await apiClient.patch(`/courses/${courseId}/quick-save`, data);
};

export const courseService = {
  getProfessorCourses,
  getById,
  create,
  update,
  remove,
  search,
  quickSave,
};
