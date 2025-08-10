import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // <-- ¡IMPORTANTE!
import { useAuth } from '../../hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Este header es el que ya tenías, perfecto para las páginas principales
  const headerContent = (
    <header style={{ background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Courses</Link>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && <Link to="/admin/dashboard">Admin</Link>}
            {(user?.role === 'admin' || user?.role === 'professor') && (
              <Link to="/professor/dashboard">Professor</Link>
            )}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Welcome</span>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </div>
          </>
        ) : (
          // En teoría, un usuario no autenticado no debería llegar a este layout,
          // pero es bueno tener un fallback.
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </nav>
    </header>
  );

  return (
    <div>
      {headerContent}
      <main style={{ backgroundColor: 'var(--neutral-50)', minHeight: '100vh' }}>
        {/* Outlet le dice a React Router: "Renderiza aquí la página específica (hija)" */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;