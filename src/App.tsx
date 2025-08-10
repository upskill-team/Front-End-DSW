import {Link, useNavigate} from 'react-router-dom';
import AppRouter from './router/AppRouter.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
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
                <span>Welcome, {user?.name} ({user?.mail})</span>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </header>
      <main>
        <AppRouter />
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;