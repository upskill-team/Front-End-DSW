import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout.tsx';
import AuthLayout from '../components/layouts/AuthLayout.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import LoginPage from '../pages/Auth/LoginPage.tsx';
import RegisterPage from '../pages/Auth/RegisterPage.tsx';
import CourseListPage from '../pages/Course/CourseListPage.tsx';
import AdminDashboard from '../pages/Admin/AdminDashboard.tsx';
import ProfessorDashboard from '../pages/Professor/ProfessorDashboard.tsx';
import UnauthorizedPage from '../pages/UnauthorizedPage.tsx';

const AppRouter = () => {
  return (
    <Routes>
      {/* --- GRUPO 1: RUTAS DE AUTENTICACIÓN (usan AuthLayout) --- */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* --- GRUPO 2: RUTAS QUE USAN EL LAYOUT PRINCIPAL --- */}
      {/* Esta ruta padre es pública y define el marco (Header/Footer) para un grupo de páginas. */}
      <Route path="/" element={<MainLayout />}>
        
        {/* PÁGINA DE INICIO - PÚBLICA */}
        {/* "index" significa que esta es la página por defecto para la ruta padre "/" */}
        <Route index element={<CourseListPage />} />
        
        {/* PÁGINAS PROTEGIDAS DENTRO DEL MISMO LAYOUT */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="professor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'professor']}>
              <ProfessorDashboard />
            </ProtectedRoute>
          }
        />
        {/* Aquí irían otras rutas, como /profile, que también estarían protegidas */}
        {/* <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> */}
      </Route>

      {/* --- RUTAS SUELTAS (no usan un layout común) --- */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
};

export default AppRouter;