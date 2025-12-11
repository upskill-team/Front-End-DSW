import { useMutation } from '@tanstack/react-query';
import { paymentService } from '../api/services/payment.service';
import type { AxiosError } from 'axios';

interface PreferenceResponse {
  preferenceId: string;
  initPoint: string;
}

export const useCreatePreference = () => {
  return useMutation<PreferenceResponse, AxiosError, string>({
    mutationFn: (courseId: string) => paymentService.createPreference(courseId),

    onSuccess: (data) => {
      window.location.href = data.initPoint;
    },
    
    onError: (error) => {
      console.error('Error creating payment preference:', error);
      alert('Hubo un error al iniciar el proceso de pago. Por favor, intenta de nuevo.');
    }
  });
};