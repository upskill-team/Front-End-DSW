import { useState } from 'react'
import { Link } from 'react-router-dom'
import type React from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useForgotPassword } from '../../hooks/useAuthMutations.ts'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AuthCard from '../../components/layouts/AuthCard'
import { isAxiosError } from 'axios'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const { mutate: sendLink, isPending, isSuccess, error } = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendLink(email)
  }

  return (
    <AuthCard
      title="Recuperar Contraseña"
      description={isSuccess ? "Revisa tu bandeja de entrada" : "Ingresa tu correo para recibir un enlace de recuperación"}
    >
      {isSuccess ? (
        <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <p className="text-slate-600">
                Si una cuenta con el correo <span className="font-semibold">{email}</span> existe, hemos enviado un enlace para restablecer tu contraseña.
            </p>
            <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Volver a Iniciar Sesión
            </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
            id="mail"
            label="Correo electrónico"
            name="mail"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            required
            autoComplete="email"
            />

            {error && (
              <p className="text-sm text-red-500 text-center">
                {isAxiosError(error) ? error.response?.data?.message : 'No se pudo procesar la solicitud.'}
              </p>
            )}

            <div className="pt-2">
            <Button
                type="submit"
                isLoading={isPending}
                className="w-full text-base py-3"
            >
                Enviar Enlace
            </Button>
            </div>

            <div className="text-center text-sm text-slate-600">
            <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline"
            >
                Recordé mi contraseña
            </Link>
            </div>
        </form>
      )}
    </AuthCard>
  )
}

export default ForgotPasswordPage