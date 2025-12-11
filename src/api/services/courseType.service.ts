import apiClient from '../apiClient';
import type { CourseType } from '../../types/entities';
import type { PaginatedCourseTypesResponse, SearchCourseTypesParams } from '../../types/shared';

type CourseTypePayload = Omit<CourseType, 'id' | 'courses'>;

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const findAll = async (params: SearchCourseTypesParams = {}): Promise<PaginatedCourseTypesResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient.get<ApiResponse<PaginatedCourseTypesResponse>>(`/courseTypes?${queryParams.toString()}`);
  return response.data.data;
};

const create = async (payload: CourseTypePayload): Promise<CourseType> => {
  const response = await apiClient.post<ApiResponse<CourseType>>('/courseTypes', payload);
  return response.data.data;
};

const update = async (id: string, payload: CourseTypePayload): Promise<CourseType> => {
  const response = await apiClient.put<ApiResponse<CourseType>>(`/courseTypes/${id}`, payload);
  return response.data.data;
};

const remove = async (id: string): Promise<void> => {
  await apiClient.delete(`/courseTypes/${id}`);
};

export const courseTypeService = {
  findAll,
  create,
  update,
  remove,
};