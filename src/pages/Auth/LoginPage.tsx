import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type React from 'react';
import axios from 'axios';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCard from '../../components/layouts/AuthCard';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ mail: '', password: '' });

  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    setError(null);

    try {
      const payload = {
        mail: credentials.mail,
        password_plaintext: credentials.password,
      };


      const token = await authService.login(payload);


      if (!token || typeof token !== 'string') {
        throw new Error('No se recibió un token válido del servidor.');
      }

      await auth.login(token);

      navigate('/'); // In this case, it redirects to the home page. In a future we should change this to redirect to... courses maybe.
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Credenciales incorrectas.');
      } else {
        setError('Ocurrió un error inesperado. Por favor, intenta de nuevo.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
            className="font-medium text-blue-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="pt-6">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full text-base py-3"
          >
            Iniciar Sesión
          </Button>
        </div>

        <div className="text-center text-sm text-slate-500 pt-6">
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-500 hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
