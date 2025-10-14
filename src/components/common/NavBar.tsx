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
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar.tsx';
import RoleBadge from '../ui/RoleBadge.tsx';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { AdminControls } from './navBar/AdminControls.tsx';
import { ProfessorControls } from './navBar/ProfessorControls.tsx';

export function NavBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeLinkClasses =
    'bg-gradient-to-r from-blue-500 to-green-500 text-white';
  const inactiveLinkClasses =
    'text-slate-700 hover:bg-blue-50 hover:text-blue-600';

  const handleLogout = () => {
    try {
      logout();
      setIsMobileMenuOpen(false);

      // Force a small delay to ensure logout completes
      setTimeout(() => {
        navigate('/login');
      }, 100);
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Force cleanup even if logout fails
      localStorage.clear();
      navigate('/login');
    }
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

  const handleLinkClick = (path: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const isProfessorDashboard = location.pathname.startsWith(
    '/professor/dashboard'
  );
  const isAdminDashboard = location.pathname.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => handleLinkClick('/')}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-poppins font-bold text-slate-800">
            UpSkill
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-2 md:space-x-4">
          <Link
            to="/courses"
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
              location.pathname === '/courses'
                ? activeLinkClasses
                : inactiveLinkClasses
            }`}
          >
            <BookOpen className="w-4 h-4" />{' '}
            <span className="xl:inline ml-2">Cursos</span>
          </Link>

          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <AdminControls
                  handleLinkClick={handleLinkClick}
                  activeLinkClasses={activeLinkClasses}
                  inactiveLinkClasses={inactiveLinkClasses}
                  location={location}
                />
              )}
              {(user?.role === 'student' || user?.role === 'professor') && (
                <Link
                  to="/my-learning"
                  className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
                    location.pathname === '/my-learning'
                      ? activeLinkClasses
                      : inactiveLinkClasses
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span className="xl:inline ml-2">Mis Aprendizajes</span>
                </Link>
              )}
              {user?.role === 'student' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-700 hover:bg-green-50"
                    onClick={handleApplyClick}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>Quiero ser profesor</span>
                  </Button>
                </>
              )}
              {user?.role === 'professor' && (
                <ProfessorControls
                  handleLinkClick={handleLinkClick}
                  activeLinkClasses={activeLinkClasses}
                  inactiveLinkClasses={inactiveLinkClasses}
                  location={location}
                />
              )}
              {!isProfessorDashboard && !isAdminDashboard && (
                <>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="w-5 h-5" />
                  </Button>
                </>
              )}
              <div className="ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user?.profile_picture}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-green-400 text-white font-bold">
                          {user?.name.charAt(0).toUpperCase()}
                          {user?.surname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium">
                        {user?.name} {user?.surname}
                      </p>
                      <p className="text-xs text-slate-500 mb-2">
                        {user?.mail}
                      </p>
                      {user && <RoleBadge role={user.role} />}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Mi Perfil</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={handleApplyClick}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Quiero ser profesor</span>
              </Button>
              <Link
                to="/login"
                onClick={() => handleLinkClick('/login')}
                className="flex items-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium text-sm"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => handleLinkClick('/register')}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              {(user?.role === 'student' || user?.role === 'professor') && (
                <Link
                  to="/my-learning"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    className="justify-start text-blue-700 hover:bg-blue-50"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    <span>Mis Aprendizajes</span>
                  </Button>
                </Link>
              )}
              {user?.role === 'student' && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={handleApplyClick}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  <span>Quiero ser profesor</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50"
              >
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                className="border-green-200 text-green-700 hover:bg-green-50 mt-2"
                onClick={handleApplyClick}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                <span>Quiero ser profesor</span>
              </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
