import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type React from 'react';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';
import { authService } from '../../api/services/auth.service';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AuthCard from '../../components/layouts/AuthCard';

const initialFormState = {
  name: '',
  surname: '',
  mail: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }
    if (formData.password.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres.');
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        surname: formData.surname,
        mail: formData.mail,
        password_plaintext: formData.password,
      };
      await authService.register(payload);
      navigate('/login');
    } catch (err) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Ocurrió un error inesperado al intentar registrar la cuenta.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Crea tu Cuenta"
      description="Completa el formulario para unirte a nosotros"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <Input
            id="name"
            label="Nombre"
            name="name"
            type="text"
            placeholder="Darth"
            value={formData.name}
            onChange={handleChange}
            icon={<User className="h-5 w-5" />}
            required
            autoComplete="given-name"
          />
          <Input
            id="surname"
            label="Apellido"
            name="surname"
            type="text"
            placeholder="Vader"
            value={formData.surname}
            onChange={handleChange}
            icon={<User className="h-5 w-5" />}
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          id="mail"
          label="Correo Electrónico"
          name="mail"
          type="email"
          placeholder="tu@email.com"
          value={formData.mail}
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
          placeholder="••••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5" />}
          required
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          label="Confirmar Contraseña"
          name="confirmPassword"
          type="password"
          placeholder="••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<Lock className="h-5 w-5" />}
          required
          autoComplete="new-password"
        />

        {error && (
          <p className="text-sm text-red-500 text-center -mt-2">{error}</p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full text-base py-3 text-white"
          >
            Registrarse
          </Button>
        </div>

        <div className="text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
