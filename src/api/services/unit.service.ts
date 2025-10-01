import apiClient from '../apiClient';
import type {
  CreateUnitRequest,
  UpdateUnitRequest,
  ReorderUnitsRequest,
  Unit,
} from '../../types/entities';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Crear una nueva unidad
const create = async (
  courseId: string,
  data: CreateUnitRequest
): Promise<Unit> => {
  const response = await apiClient.post<ApiResponse<Unit>>(
    `/courses/${courseId}/units`,
    data
  );
  return response.data.data;
};

// Actualizar una unidad existente
const update = async (
  courseId: string,
  unitNumber: number,
  data: UpdateUnitRequest
): Promise<Unit> => {
  const response = await apiClient.put<ApiResponse<Unit>>(
    `/courses/${courseId}/units/${unitNumber}`,
    data
  );
  return response.data.data;
};

// Eliminar una unidad
const remove = async (courseId: string, unitNumber: number): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}/units/${unitNumber}`);
};

// Reordenar unidades
const reorder = async (
  courseId: string,
  data: ReorderUnitsRequest
): Promise<Unit[]> => {
  const response = await apiClient.patch<ApiResponse<Unit[]>>(
    `/courses/${courseId}/units/reorder`,
    data
  );
  return response.data.data;
};

// Subir archivo (mantener existente, pero corregir)
const uploadFile = async (file: File): Promise<string> => {
  const body = new FormData();
  body.append('file', file);
  const response = await apiClient.post('/unit', {
    method: 'POST',
    body: body,
  });

  return response.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
};

export const unitService = {
  create,
  update,
  delete: remove,
  reorder,
  uploadFile,
};
