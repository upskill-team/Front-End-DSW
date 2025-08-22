import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import CourseListPage from '../pages/Course/CourseListPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProfessorDashboard from '../pages/Professor/ProfessorDashboard';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import { ProfessorApplication } from '../pages/Professor/ProfessorApplication';
import AdminLayout from '../components/layouts/AdminLayout.tsx';
import ProfessorRequestsPage from '../pages/Admin/ProfessorRequestsPage.tsx';
import UsersPage from '../pages/Admin/UsersPage.tsx';
import AnalyticsPage from '../pages/Admin/AnalyticsPage.tsx';
import CoursesPage from '../pages/Admin/CoursesPage.tsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<MainLayout />}>

        <Route path="/courses" element={<ProtectedRoute allowedRoles={['admin', 'professor', 'student']}><CourseListPage /></ProtectedRoute>} />

        <Route path="/professor/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'professor']}><ProfessorDashboard /></ProtectedRoute>} />

        <Route path="/professor/apply" element={<ProtectedRoute allowedRoles={['admin', 'student']}><ProfessorApplication /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teacher-requests" element={<ProfessorRequestsPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
};

export default AppRouter;