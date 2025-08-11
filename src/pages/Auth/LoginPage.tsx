import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/services/auth.service';
import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/ui/Button.tsx';
import Input from '../../components/ui/Input.tsx';
import AuthCard from '../../components/ui/AuthCard.tsx';

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
      const payload = { mail: credentials.mail, password_plaintext: credentials.password };
      const { user, token } = await authService.login(payload);
      auth.login(user, token);
      navigate('/');
    } catch (err) {
      setError('Incorrect credentials. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // auth-container y auth-card fusionados en el layout
    <AuthCard
      title='Welcome'
      description='Please enter your credentials to continue'
    >

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          id="mail"
          label="Email"
          name="mail"
          type="mail"
          placeholder="your@email.com"
          value={credentials.mail}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faEnvelope} />}
          error={error && error.includes('mail') ? error : null}
          required
        />

        <Input
          id="password"
          label="Password"
          name="password"
          type="password" // El componente se encarga del toggle!
          placeholder="••••••••"
          value={credentials.password}
          onChange={handleChange}
          icon={<FontAwesomeIcon icon={faLock} />}
          required
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <input id="remember" name="remember" type="checkbox" className="h-4 w-4 rounded accent-primary-600" />
            <label htmlFor="remember" className="text-sm text-neutral-600 font-bold cursor-pointer">Remember me</label>
          </div>
          <a href="#" className="text-sm text-primary-600 hover:text-primary-800 hover:underline font-medium">
            Forgot your password?
          </a>
        </div>

        {error && <p className="text-sm text-error mt-1">{error}</p>}

        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>
        
        <div className="text-center mt-2">
          <p className="text-neutral-600">
            You don't have an account?
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium ml-2 hover:underline">Create one</Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default LoginPage;