import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../api/services/auth.service';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ mail: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="mail">Mail:</label>
          <input
            type="mail"
            id="mail"
            name="mail"
            value={credentials.mail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default LoginPage;