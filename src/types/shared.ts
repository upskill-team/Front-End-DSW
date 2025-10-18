import type { Appeal, Course } from './entities.ts';

export interface SearchCoursesParams {
  limit?: number;
  offset?: number;
  status?: 'en-desarrollo' | 'bloqueado' | 'publicado' | 'pausado';
  isFree?: boolean;
  q?: string; // Para búsqueda de texto (nombre, profesor, institución, tipo)
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  courseTypeId?: string;
  institutionId?: string; // Nuevo: Filtrar por institución
  professorId?: string; // Nuevo: Filtrar por profesor
}

export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface SearchAppealsParams {
  limit?: number;
  offset?: number;
  status?: 'pending' | 'accepted' | 'rejected';
  q?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedAppealsResponse {
  appeals: Appeal[];
  total: number;
}

export interface SearchCourseTypesParams {
  limit?: number;
  offset?: number;
  q?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedCourseTypesResponse {
  courseTypes: import('./entities').CourseType[];
  total: number;
}
