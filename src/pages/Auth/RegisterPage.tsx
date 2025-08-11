import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import AuthCard from '../../components/layouts/AuthCard.tsx';

const initialFormState = { name: '', surname: '', mail: '', password: '', confirmPassword: '' };

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (formData.password.length < 6) return setError('The password must have at least 6 characters');
    if (!/\S+@\S+\.\S+/.test(formData.mail)) return setError('Please enter a valid email address');
    
    setIsLoading(true);
    try {
      const payload = { name: formData.name, surname: formData.surname, mail: formData.mail, password_plaintext: formData.password };
      await authService.register(payload);
      navigate('/login');
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : 'An unexpected error occurred.';
      setError(message || 'A network error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title='Create Account'
      description='Please enter your credentials to register'
    >

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="name"
            label="Name"
            name="name"
            type="name"
            placeholder="John"
            value={formData.name}
            onChange={handleChange}
            icon={<FontAwesomeIcon icon={faUser} />}
            error={error && error.includes('name') ? error : null}
            required
          />
          <Input
            id="surname"
            label="Surname"
            name="surname"
            type="surname"
            placeholder="Doe"
            value={formData.surname}
            onChange={handleChange}
            icon={<FontAwesomeIcon icon={faUser} />}
            error={error && error.includes('surname') ? error : null}
            required
          />
        </div>

        <Input
          id="mail"
          label="Email"
          name="mail"
          type="mail"
          placeholder="your@email.com"
          value={formData.mail}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          error={error && error.includes('mail') ? error : null}
          required
        />

        <Input
          id="password"
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faLock} />}
          required
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faLock} />}
          required
        />

        {error && <p className="text-sm text-error mt-1">{error}</p>}

        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>

        <div className="text-center mt-2">
          <p className="text-neutral-600">
            You already have an account?
            <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium ml-2 hover:underline">Login</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;