import apiClient from '../apiClient';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactResponse {
  message: string;
  ticketId: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/**
 * Envía un mensaje de contacto al equipo de soporte
 */
const sendContactMessage = async (
  data: ContactFormData
): Promise<ContactResponse> => {
  const response = await apiClient.post<ApiResponse<ContactResponse>>(
    '/contact',
    data
  );
  return response.data.data;
};

export const contactService = {
  sendContactMessage,
};
