import { useState } from 'react'
import { Link } from 'react-router-dom'
import type React from 'react'
import { Mail, Lock } from 'lucide-react'
import { useLogin } from '../../hooks/useAuthMutations.ts'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import AuthCard from '../../components/layouts/AuthCard'
import { isAxiosError } from 'axios'

const LoginPage = () => {
  
  const [credentials, setCredentials] = useState({ mail: '', password: '' })

  const { mutate: login, isPending, error } = useLogin()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      mail: credentials.mail,
      password_plaintext: credentials.password,
    }

    login(payload)
  }
  
  return (
    <AuthCard
      title="Iniciar Sesión"
      description="Accede a tu cuenta para continuar aprendiendo"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="mail"
          label="Correo electrónico"
          name="mail"
          type="email"
          placeholder="tu@email.com"
          value={credentials.mail}
          onChange={handleChange}
          icon={<Mail className="h-5 w-5" />}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Tu contraseña"
          value={credentials.password}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5" />}
          required
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between text-sm pt-1">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="text-slate-600 cursor-pointer">
              Recordarme
            </label>
          </div>
          <Link
            to="/forgot-password"
            className="font-medium text-blue-500 hover:underline text-right"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">
            {isAxiosError(error)
              ? error.response?.data?.errors || 'Credenciales incorrectas.'
              : 'Ocurrió un error inesperado.'
            }
          </p>
        )}

        <div className="pt-6">
          <Button
            type="submit"
            isLoading={isPending}
            className="w-full text-base py-3 text-white"
          >
            Iniciar Sesión
          </Button>
        </div>

        <div className="text-center text-sm text-slate-500 pt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}

export default LoginPage
