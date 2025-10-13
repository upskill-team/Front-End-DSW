import type { Appeal, Course } from './entities.ts';

export interface SearchCoursesParams {
  limit?: number;
  offset?: number;
  status?: 'en-desarrollo' | 'bloqueado' | 'publicado' | 'pausado';
  isFree?: boolean;
  q?: string; // Para búsqueda de texto
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  courseTypeId?: string;
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
