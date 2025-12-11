import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as v from 'valibot'
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { Lock } from 'lucide-react'
import { useResetPassword } from '../../hooks/useAuthMutations'
import Button from '../../components/ui/Button/Button'
import Input from '../../components/ui/Input/Input'
import AuthCard from '../../components/layouts/AuthCard'
import { isAxiosError } from 'axios'

const ResetPasswordObjectSchema = v.object({
  password: v.pipe(v.string(), v.minLength(8, 'La contraseña debe tener al menos 8 caracteres.')),
  confirmPassword: v.pipe(v.string(), v.minLength(8, 'La contraseña debe tener al menos 8 caracteres.')),
});

const ResetPasswordSchema = v.pipe(
  ResetPasswordObjectSchema,
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'Las contraseñas no coinciden.'
    ),
    ['confirmPassword']
  )
);

type ResetPasswordFormData = v.InferInput<typeof ResetPasswordSchema>;

const ResetPasswordPage = () => {
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: valibotResolver(ResetPasswordSchema),
  });

  const { mutate: resetPassword, isPending, error : apiError } = useResetPassword()

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (!urlToken) {
      navigate('/') // We should add a notification explaining the user why he is being redirected
    }
    setToken(urlToken)
  }, [searchParams, navigate])

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      return;
    }
    resetPassword({ token, password: data.password });
  };

  return (
    <AuthCard
      title="Restablecer Contraseña"
      description="Crea una nueva contraseña segura para tu cuenta"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="password"
          label="Nueva Contraseña"
          type="password"
          placeholder="••••••••••"
          icon={<Lock className="h-5 w-5" />}
          autoComplete="new-password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Input
          id="confirmPassword"
          label="Confirmar Nueva Contraseña"
          type="password"
          placeholder="••••••••••"
          icon={<Lock className="h-5 w-5" />}
          autoComplete="new-password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        {apiError && (
          <p className="text-sm text-red-500 text-center">
            {isAxiosError(apiError)
              ? apiError.response?.data?.message
              : 'El token es inválido o ha expirado.'}
          </p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!token || isPending}
            variant="primary"
            size="lg"
            fullWidth
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}

export default ResetPasswordPage