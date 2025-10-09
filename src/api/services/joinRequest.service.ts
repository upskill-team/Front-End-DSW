import apiClient from '../apiClient';
import type { JoinRequest } from '../../types/entities';

// Definimos la estructura de la respuesta de la API que ya conocemos
interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Creates a new request for a professor to join an institution.
 * @param {string} institutionId - The ID of the institution to join.
 */
const create = async (institutionId: string): Promise<JoinRequest> => {
  const response = await apiClient.post<ApiResponse<JoinRequest>>('/join-requests', { institutionId });
  return response.data.data;
};

/**
 * Fetches all pending join requests for a specific institution. (Manager only)
 * @param {string} institutionId - The ID of the institution.
 */
const getPendingForInstitution = async (institutionId: string): Promise<JoinRequest[]> => {
  const response = await apiClient.get<ApiResponse<JoinRequest[]>>(`/join-requests/institution/${institutionId}/pending`);
  return response.data.data;
};

/**
 * Processes a join request by accepting or rejecting it. (Manager only)
 * @param {string} requestId - The ID of the join request.
 * @param {'accept' | 'reject'} action - The action to perform.
 */
const process = async (requestId: string, action: 'accept' | 'reject'): Promise<JoinRequest> => {
  const response = await apiClient.patch<ApiResponse<JoinRequest>>(`/join-requests/${requestId}/process`, { action });
  return response.data.data;
};

/**
 * Fetches the current professor's own pending join request.
 */
const findMyPendingRequest = async (): Promise<JoinRequest | null> => {
  const response = await apiClient.get<ApiResponse<JoinRequest | null>>('/join-requests/me/pending');
  return response.data.data;
};

/**
 * Cancels a join request by its ID. (Professor only)
 * @param {string} requestId - The ID of the join request to cancel.
 */
const cancelRequest = async (requestId: string): Promise<void> => {
  await apiClient.delete(`/join-requests/${requestId}`);
};

export const joinRequestService = {
  create,
  getPendingForInstitution,
  process,
  findMyPendingRequest,
  cancelRequest, 
};