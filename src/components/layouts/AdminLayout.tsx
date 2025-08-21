import { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, LayoutDashboard, Users, GraduationCap, LogOut, Menu, X, BarChart3 } from 'lucide-react';

const sidebarItems = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Solicitudes', href: '/admin/teacher-requests', icon: GraduationCap },
  { title: 'Cursos', href: '/admin/courses', icon: BookOpen },
  { title: 'Usuarios', href: '/admin/users', icon: Users },
  { title: 'Estadísticas', href: '/admin/analytics', icon: BarChart3 },
];

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const conditionalClasses = (isActive: boolean) => {
    return isActive
      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-blue-100">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">UpSkill</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
          </div>

          <div className="px-6 py-4"><div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium text-center">Panel de Administrador</div></div>

          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${conditionalClasses(isActive)}`} onClick={() => setSidebarOpen(false)}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-blue-100">
            <button onClick={handleLogout} className="w-full flex items-center text-left space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-slate-700 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-blue-100">
          <div className="flex items-center justify-between lg:justify-end px-6 py-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
            <div className="text-sm text-slate-600">
              Administrador: <span className="font-medium text-slate-800">{user?.name || 'Admin Dev'}</span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;