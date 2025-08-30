import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type React from 'react'
import { Lock } from 'lucide-react'
import { useResetPassword } from '../../hooks/useAuthMutations'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AuthCard from '../../components/layouts/AuthCard'
import { isAxiosError } from 'axios'

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [token, setToken] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate: resetPassword, isPending, error } = useResetPassword()

  useEffect(() => {
    const urlToken = searchParams.get('token')
    if (!urlToken) {
      navigate('/') // We should add a notification explaining the user why he is being redirected
    }
    setToken(urlToken)
  }, [searchParams, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationError(null)

    if (!token) {
      return setValidationError("Token inválido o faltante.")
    }
    if (formData.password !== formData.confirmPassword) {
      return setValidationError('Las contraseñas no coinciden.')
    }
    if (formData.password.length < 8) {
      return setValidationError('La contraseña debe tener al menos 8 caracteres.')
    }

    resetPassword({ token, password: formData.password })
  }

  return (
    <AuthCard
      title="Restablecer Contraseña"
      description="Crea una nueva contraseña segura para tu cuenta"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="password"
          label="Nueva Contraseña"
          name="password"
          type="password"
          placeholder="••••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5" />}
          required
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5" />}
          required
          autoComplete="new-password"
        />

        {(validationError || error) && (
            <p className="text-sm text-red-500 text-center">
                {validationError || (isAxiosError(error) ? error.response?.data?.message : 'El token es inválido o ha expirado.')}
            </p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isPending}
            disabled={!token || isPending}
            className="w-full text-base py-3"
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}

export default ResetPasswordPage