import apiClient from '../apiClient';
import type { Institution } from '../../types/entities';

export interface CreateInstitutionData {
  name: string;
  description: string;
  aliases?: string[];
}

export interface JoinInstitutionRequest {
  institutionId: string;
  message?: string;
}

export interface AddProfessorRequest {
  professorId: string;
}

class InstitutionService {
  /**
   * Get all active institutions
   */
  async getAll(): Promise<Institution[]> {
    const response = await apiClient.get<{ status: number; message: string; data: Institution[] }>('/institutions');
    return response.data.data;
  }

  /**
   * Get a single institution by ID
   */
  async getOne(id: string): Promise<Institution> {
    const response = await apiClient.get<{ status: number; message: string; data: Institution }>(`/institutions/${id}`);
    return response.data.data;
  }

  /**
   * Create a new institution (professor becomes manager)
   */
  async create(data: CreateInstitutionData): Promise<Institution> {
    const response = await apiClient.post<{ status: number; message: string; data: Institution }>('/institutions', data);
    return response.data.data;
  }

  /**
   * Get the institution managed by the current professor
   */
  async getManagedInstitution(): Promise<Institution | null> {
    const response = await apiClient.get<{ status: number; message: string; data: Institution | null }>('/institutions/managed/me');
    return response.data.data;
  }

  /**
   * Leave an institution (professor leaves)
   */
  async leaveInstitution(institutionId: string): Promise<void> {
    await apiClient.delete(`/institutions/${institutionId}/leave`);
  }

  /**
   * Add a professor to institution (manager only)
   */
  async addProfessor(institutionId: string, data: AddProfessorRequest): Promise<Institution> {
    const response = await apiClient.post<Institution>(
      `/institutions/${institutionId}/professors`,
      data
    );
    return response.data;
  }

  /**
   * Remove a professor from institution (manager or self)
   */
  async removeProfessor(institutionId: string, professorId: string): Promise<void> {
    await apiClient.delete(`/institutions/${institutionId}/professors/${professorId}`);
  }

  /**
   * Update the managed institution of the current professor
   */
  async updateManaged(data: Partial<CreateInstitutionData>): Promise<Institution> {
    const response = await apiClient.patch<{ data: Institution }>('/institutions/managed/me', data);
    return response.data.data;
  }
}

export const institutionService = new InstitutionService();