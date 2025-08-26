import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  LogIn,
  UserPlus,
  GraduationCap,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function NavBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLinkClasses = 'bg-gradient-to-r from-blue-500 to-green-500 text-white';
  const inactiveLinkClasses = 'text-slate-700 hover:bg-blue-50 hover:text-blue-600';

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para poder aplicar.');
      navigate('/login');
    } else {
      navigate('/professor/apply');
    }
    setIsMobileMenuOpen(false);
  };

  const isProfessorDashboard = location.pathname.startsWith('/professor/dashboard');
  const isAdminDashboard = location.pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-poppins font-bold text-slate-800">UpSkill</span>
        </Link>

        <div className="hidden md:flex items-center space-x-2 md:space-x-4">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                 <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                    <Link to="/admin/dashboard" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/admin/dashboard') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Panel General
                    </Link>
                    <Link to="/admin/analytics" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/admin/analytics') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BarChart3 className="w-4 h-4 mr-2" /> Analíticas
                    </Link>
                    <Link to="/admin/users" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/admin/users') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <Users className="w-4 h-4 mr-2" /> Usuarios
                    </Link>
                    <Link to="/admin/courses" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/admin/courses') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BookOpen className="w-4 h-4 mr-2" /> Cursos
                    </Link>
                    <Link to="/admin/appeals" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/admin/appeals') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <GraduationCap className="w-4 h-4 mr-2" /> Solicitudes
                    </Link>
                 </div>
              )}

              {user?.role === 'student' && (
                <button
                  className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium"
                  onClick={handleApplyClick}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Quiero ser profesor</span>
                </button>
              )}
              
              {user?.role === 'professor' && (
                 <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                    <Link to="/professor/dashboard/courses" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/professor/dashboard/courses') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BookOpen className="w-4 h-4 mr-2" /> Mis Cursos
                    </Link>
                    <Link to="/professor/dashboard/analytics" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/professor/dashboard/analytics') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BarChart3 className="w-4 h-4 mr-2" /> Analíticas
                    </Link>
                    <Link to="/professor/dashboard/students" className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${location.pathname.startsWith('/professor/dashboard/students') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <Users className="w-4 h-4 mr-2" /> Estudiantes
                    </Link>
                 </div>
              )}

              {!isProfessorDashboard && !isAdminDashboard &&(
                <>
                  <button className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Bell className="w-5 h-5" /></button>
                </>
              )}
              <div className="ml-2 flex items-center gap-4">
                <span className="hidden md:inline text-sm font-medium text-slate-700">Hola, {user?.name}</span>
                <button onClick={handleLogout} className="text-sm font-medium text-slate-700 hover:text-blue-600">Salir</button>
              </div>
            </>
          ) : (
            <>
              <button className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium" onClick={handleApplyClick}>
                <GraduationCap className="w-4 h-4" />
                <span>Quiero ser profesor</span>
              </button>
              <Link to="/login" className="flex items-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm"><LogIn className="w-4 h-4 mr-2" />Login</Link>
              <Link to="/register" className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"><UserPlus className="w-4 h-4 mr-2" />Register</Link>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 pt-2 pb-4 space-y-2">
          {isLoading ? (
            <div className="h-8 w-full bg-slate-200 rounded-lg animate-pulse"></div>
          ) : isAuthenticated ? (
            <>
              <div className="flex items-center gap-4 mb-4 border-b pb-4">
                <span className="text-sm font-medium text-slate-700">Hola, {user?.name}</span>
              </div>
              {user?.role === 'admin' && (
                 <div className="space-y-2 border-b pb-4 mb-2">
                    <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/admin/dashboard') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <LayoutDashboard className="w-4 h-4 mr-2" /> Panel General
                    </Link>
                    <Link to="/admin/analytics" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/admin/analytics') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BarChart3 className="w-4 h-4 mr-2" /> Analíticas
                    </Link>
                    <Link to="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/admin/users') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <Users className="w-4 h-4 mr-2" /> Usuarios
                    </Link>
                    <Link to="/admin/courses" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/admin/courses') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BookOpen className="w-4 h-4 mr-2" /> Cursos
                    </Link>
                    <Link to="/admin/appeals" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/admin/appeals') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <GraduationCap className="w-4 h-4 mr-2" /> Solicitudes
                    </Link>
                 </div>
              )}
              {user?.role === 'student' && (
                <button onClick={handleApplyClick} className="w-full flex items-center justify-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium">
                  <GraduationCap className="w-4 h-4" />
                  <span>Quiero ser profesor</span>
                </button>
              )}
              {user?.role === 'professor' && (
                 <div className="space-y-2 border-b pb-4 mb-2">
                    <Link to="/professor/dashboard/courses" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/professor/dashboard/courses') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BookOpen className="w-4 h-4 mr-2" /> Mis Cursos
                    </Link>
                    <Link to="/professor/dashboard/analytics" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/professor/dashboard/analytics') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <BarChart3 className="w-4 h-4 mr-2" /> Analíticas
                    </Link>
                    <Link to="/professor/dashboard/students" onClick={() => setIsMobileMenuOpen(false)} className={`px-3 py-2 text-sm font-medium rounded-md flex items-center w-full justify-center transition-colors ${location.pathname.startsWith('/professor/dashboard/students') ? activeLinkClasses : inactiveLinkClasses}`}>
                        <Users className="w-4 h-4 mr-2" /> Estudiantes
                    </Link>
                 </div>
              )}
              <button onClick={handleLogout} className="w-full text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm"><LogIn className="w-4 h-4 mr-2" />Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"><UserPlus className="w-4 h-4 mr-2" />Register</Link>
              <button onClick={handleApplyClick} className="w-full flex items-center justify-center space-x-2 border-green-200 text-green-700 hover:bg-green-50 bg-transparent px-4 py-2 rounded-lg border text-sm font-medium mt-2">
                <GraduationCap className="w-4 h-4" />
                <span>Quiero ser profesor</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}