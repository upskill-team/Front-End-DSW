import { useMutation } from '@tanstack/react-query'
import { authService } from '../api/services/auth.service'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (token) => {
      login(token) 
      navigate('/')
    },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      alert("¡Registro exitoso! Por favor, inicia sesión.")
      navigate('/login')
    },
  })
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onSuccess: () => {
      alert("¡Contraseña actualizada con éxito!");
      navigate('/login');
    },
  })
}