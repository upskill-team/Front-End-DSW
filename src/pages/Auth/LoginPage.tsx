import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/services/auth.service';
import type React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

  const LoginPage = () => {
  const [credentials, setCredentials] = useState({ mail: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
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

      const { user, token } = await authService.login(payload);
    
      auth.login(user, token);
      navigate('/'); 

    } catch (err) {
      setError('Incorrect credentials. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <h1>Welcome</h1>
          <p className="auth-description">Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
                value={credentials.mail}
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
                value={credentials.password}
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

          <div className="form-options">
            <div className="checkbox-container">
              <input id="remember" name="remember" type="checkbox" className="checkbox" />
              <label htmlFor="remember" className="checkbox-label">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot your password?</a>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? "Starting session..." : "Login"}
          </button>
          <div className="form-switch">
            <p>
              You dont have an account?
              <Link to="/register" className="switch-link">Create one</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
