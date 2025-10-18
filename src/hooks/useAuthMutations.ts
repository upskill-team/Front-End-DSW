import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/services/auth.service'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { isAxiosError } from 'axios'

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (token) => {
      login(token);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    }
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.errors?.includes('Email already used')) {
          toast.error('Este correo electrónico ya está en uso.');
      } else {
          toast.error(error.message || 'No se pudo completar el registro.');
      }
    }
  });
};

export const useForgotPassword = () => {
    return useMutation({
      mutationFn: (email: string) => authService.forgotPassword(email),
      onSuccess: () => {
        toast.success('Si el correo existe, recibirás un enlace de recuperación.');
      },
      onError: (error) => {
        toast.error(error.message || 'No se pudo enviar el correo.');
      }
    });
};

export const useResetPassword = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: ({ token, password }: { token: string; password: string }) => authService.resetPassword(token, password),
        onSuccess: () => {
            toast.success('¡Contraseña actualizada! Ya puedes iniciar sesión.');
            navigate('/login');
        },
        onError: (error) => {
            toast.error(error.message || 'El token es inválido o ha expirado.');
        }
    });
};