import apiClient from '../apiClient';

interface UploadResponse {
  id: string;
  url: string;
  title: string;
  description?: string;
}

const upload = async (file: File): Promise<UploadResponse> => {
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
};