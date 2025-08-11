import { Link, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const headerContent = (
    <header className="bg-gray-100 p-4 mb-4 shadow-md">
      <nav className="container mx-auto flex gap-4 items-center">
        <Link to="/" className="text-gray-700 hover:text-primary-600 font-semibold">Courses</Link>
        
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 font-semibold">Admin</Link>}
            {(user?.role === 'admin' || user?.role === 'professor') && (
              <Link to="/professor/dashboard" className="text-gray-700 hover:text-primary-600 font-semibold">Professor</Link>
            )}
            <div className="ml-auto flex items-center gap-4">
              <span className="text-gray-800">Welcome, {user?.name || 'User'}</span>
              <button onClick={handleLogout} className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Logout
              </button>
            </div>
          </>
        ) : (
          <div className="ml-auto flex items-center gap-4">
            <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold">Login</Link>
            <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );

  return (
    <div className="bg-neutral-50 min-h-screen">
      {headerContent}
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;