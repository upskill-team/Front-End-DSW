import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  // Este layout no tiene un header complejo, solo centra el contenido.
  return (
    <div className="auth-container">
      <Link to="/" style={{
        position: 'absolute',
        top: 'var(--spacing-8)',
        left: 'var(--spacing-8)',
        color: 'var(--primary-100)',
        textDecoration: 'none',
        fontWeight: '600',
      }}>
        Home
      </Link>

      <main>
        {/* Aquí se renderizará LoginPage o RegisterPage */}
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;