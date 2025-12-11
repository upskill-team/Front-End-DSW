import { useMutation } from '@tanstack/react-query';
import { appealService } from '../api/services/appeal.service';
import { useNavigate } from 'react-router-dom';

export const useCreateAppeal = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formData: FormData) => appealService.createAppeal(formData),
    meta: {
      ignoreGlobalError: true
    },
    onSuccess: () => {
      navigate('/');
    },
  });
};