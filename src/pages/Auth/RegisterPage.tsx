import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';
import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const initialFormState = {
  name: '',
  surname: '',
  mail: '',
  password: '',
  confirmPassword: '',
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('The password must have at least 6 characters');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.mail)) {
      setError('Please enter a valid email address');
      return;
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

      navigate('/');

    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Dentro de este bloque, TypeScript sabe que 'err' es un AxiosError
        const message = err.response?.data?.message || 'A network error occurred.';
        setError(message);
      } else {
        // Manejamos cualquier otro tipo de error
        setError('An unexpected error occurred.');
        console.error('Error not related to Axios:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <h1>Create Account</h1>
          <p className="auth-description">Please enter your credentials to register</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <div className="input-container">
                <span className="input-icon left" aria-hidden="true">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John"
                value={formData.name}
                onChange={handleChange}
                className="form-input with-icon-left"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="surname" className="form-label">Surname</label>
              <div className="input-container">
                <span className="input-icon left" aria-hidden="true">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <input
                id="surname"
                name="surname"
                type="text"
                required
                placeholder="Doe"
                value={formData.surname}
                onChange={handleChange}
                className="form-input with-icon-left"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mail" className="form-label">Email</label>
            <div className="input-container">
              <span className="input-icon left" aria-hidden="true">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <input
                id="mail"
                name="mail"
                type="email"
                required
                placeholder="your@email.com"
                value={formData.mail}
                onChange={handleChange}
                className="form-input with-icon-left"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-container">
              <span className="input-icon left" aria-hidden="true">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="form-input with-icon-left with-icon-right"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon right"
              >
                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye}/>}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon left" aria-hidden="true">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input with-icon-left with-icon-right"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="input-icon right"
              >
                {showConfirmPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye}/>}
              </button>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? <span className="loading-spinner"></span> : "Register"}
          </button>
          <div className="form-switch">
            <p>
              You alredy have an account?
              <Link to="/login" className="switch-link">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;