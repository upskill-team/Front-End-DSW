import { useMutation } from '@tanstack/react-query';
import { contactService } from '../api/services/contact.service';
import type { AxiosError } from 'axios';

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

export const useContact = () => {
  return useMutation<ContactResponse, AxiosError, ContactFormData>({
    mutationFn: (data: ContactFormData) =>
      contactService.sendContactMessage(data),
  });
};
