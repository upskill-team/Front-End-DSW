import type { Course } from "./entities.ts";

// Refleja los parámetros opcionales que tu backend ahora acepta
export interface SearchCoursesParams {
  limit?: number;
  offset?: number;
  status?: 'en-desarrollo' | 'bloqueado' | 'publicado' | 'pausado';
  isFree?: boolean;
  q?: string; // Para búsqueda de texto
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// El backend ahora devuelve un objeto con los datos y el total
export interface PaginatedCoursesResponse {
  courses: Course[];
  total: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}