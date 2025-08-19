import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  UserPlus,
  GraduationCap,
  ShoppingCart,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function NavBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  // Estado para controlar la apertura y cierre del menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false); // Cierra el menú al desloguearse
    navigate('/login');
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para poder aplicar.');
      navigate('/login');
    } else {
      navigate('/professor/apply');
    }
    setIsMobileMenuOpen(false); // Cierra el menú después de la acción
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-poppins font-bold text-slate-800">
            UpSkill
          </span>
        </Link>

        {/* Botón de Menú Móvil (Hamburguesa) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-slate-700 hover:bg-slate-100"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navegación de Escritorio */}
        <div className="hidden md:flex items-center space-x-2 md:space-x-4">
          {(!user || user.role === 'student') && (
            <button
              className="hidden sm:flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium"
              onClick={handleApplyClick}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Quiero ser profesor</span>
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

      {/* Menú Desplegable Móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 pt-2 pb-4 space-y-2">
          {isLoading ? (
             <div className="h-8 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-slate-700">
                  Hola, {user?.name}
                </span>
              </div>
              {(!user || user.role === 'student') && (
                <button
                  onClick={handleApplyClick}
                  className="w-full flex items-center justify-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Quiero ser profesor</span>
                </button>
              )}
               <button
                  onClick={handleLogout}
                  className="w-full text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 py-2 rounded-lg"
                >
                  Salir
                </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Link>
              {(!user || user.role === 'student') && (
                <button
                  onClick={handleApplyClick}
                  className="w-full flex items-center justify-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium mt-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Quiero ser profesor</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}