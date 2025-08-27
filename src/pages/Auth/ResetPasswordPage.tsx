import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type React from 'react';
import axios from 'axios';
import { Lock } from 'lucide-react';
import { authService } from '../../api/services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCard from '../../components/layouts/AuthCard';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
      setError("Token de reseteo no encontrado. Por favor, solicita un nuevo enlace.");
    }
    setToken(urlToken);
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
        return setError("Token inválido o faltante.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (formData.password.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres.');
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      alert("¡Contraseña actualizada con éxito!");
      navigate('/login');
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'El token es inválido, ha expirado o ya fue utilizado.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!token || isLoading}
            className="w-full text-base py-3"
          >
            Actualizar Contraseña
          </Button>
        </div>
      </form>
    </AuthCard>
  );
};

export default ResetPasswordPage;