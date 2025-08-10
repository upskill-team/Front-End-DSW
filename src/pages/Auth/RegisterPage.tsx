import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/auth.service';

const initialFormState = {
  name: '',
  surname: '',
  mail: '',
  password: '',
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); 
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const { password, ...restOfData } = formData;

      const payload = {
        ...restOfData,
        password_plaintext: password,
      };

      await authService.register(payload);

      setSuccess('Registration successful! You will be redirected to the login page.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('An error occurred during registration. The email address may already be in use.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="surname">Surname:</label>
          <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="mail">Mail:</label>
          <input type="mail" id="mail" name="mail" value={formData.mail} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;