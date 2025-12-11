import apiClient from '../apiClient';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

const createPreference = async (courseId: string): Promise<PreferenceResponse> => {
  console.log('🔵 Creating payment preference for course:', courseId);
  const payload = { courseId };
  console.log('📤 Payload being sent:', payload);
  
  const response = await apiClient.post<ApiResponse<PreferenceResponse>>(
    '/payments/create-preference',
    payload
  );
  
  console.log('✅ Preference response:', response.data);
  return response.data.data;
};

export const paymentService = {
  createPreference,
};