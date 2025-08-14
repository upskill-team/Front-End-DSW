import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  UserPlus,
  GraduationCap,
  ShoppingCart,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function NavBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log(
    '[NavBar Render] IsLoading:',
    isLoading,
    '| IsAuthenticated:',
    isAuthenticated,
    '| User:',
    user
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para poder aplicar.");
      navigate('/login');
      return; 
    }
      navigate('/professor/apply');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-poppins font-bold text-slate-800">
            UpSkill
          </span>
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {(!user || user.role === 'student') && (
            <button
              className="hidden sm:flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium"
              onClick={handleApplyClick}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="ml-2">Quiero ser profesor</span>
            </button>
          )}

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              <button className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <div className="ml-2 flex items-center gap-4">
                <span className="hidden md:inline text-sm font-medium text-slate-700">
                  Hola, {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600"
                >
                  Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
