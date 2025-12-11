import apiClient from '../apiClient';
import type { Material } from '../../types/entities';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface UploadResponse {
  id: string;
  url: string;
  title: string;
  description?: string;
}

// Subir material a una unidad específica (nuevo endpoint granular)
const upload = async (
  courseId: string,
  unitNumber: number,
  file: File,
  title?: string
): Promise<Material> => {
  const formData = new FormData();
  formData.append('materials', file);
  if (title) {
    formData.append('title', title);
  }

  const response = await apiClient.post<ApiResponse<Material>>(
    `/courses/${courseId}/units/${unitNumber}/materials`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

// Eliminar material de una unidad específica
const deleteMaterial = async (
  courseId: string,
  unitNumber: number,
  materialIndex: number
): Promise<void> => {
  await apiClient.delete(
    `/courses/${courseId}/units/${unitNumber}/materials/${materialIndex}`
  );
};

// Método legado para subida simple (mantener compatibilidad)
const uploadLegacy = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('material', file);

  const response = await apiClient.post<{ data: UploadResponse }>(
    '/materials/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.data;
};

export const materialService = {
  upload,
  delete: deleteMaterial,
  uploadLegacy,
};
