import apiClient from '../apiClient';
import type { Appeal } from '../../types/entities';
import type { PaginatedAppealsResponse, SearchAppealsParams } from '../../types/shared.ts'


type UpdateAppealPayload = {
  state: 'accepted' | 'rejected';
};

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

const createAppeal = async (formData: FormData): Promise<Appeal> => {

  const response = await apiClient.post<ApiResponse<Appeal>>('/appeals', formData);

  return response.data.data;
};

const findAllAppeals = async (params: SearchAppealsParams = {}): Promise<PaginatedAppealsResponse> => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const response = await apiClient.get<ApiResponse<PaginatedAppealsResponse>>(`/appeals?${queryParams.toString()}`);
  return response.data.data;
};

const updateAppealState = async (
  appealId: string,
  payload: UpdateAppealPayload
): Promise<Appeal> => {
  const response = await apiClient.patch<ApiResponse<Appeal>>(
    `/appeals/${appealId}`,
    payload
  );
  return response.data.data;
};

export const appealService = {
  createAppeal,
  findAllAppeals,
  updateAppealState,
};