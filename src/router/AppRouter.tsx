import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import CourseListPage from '../pages/Course/CourseListPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProfessorDashboard from '../pages/Professor/ProfessorDashboard';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import { ProfessorApplication } from '../pages/Professor/ProfessorApplication';
import ProfessorAppealsPage from '../pages/Admin/ProfessorAppealsPage.tsx';
import UsersPage from '../pages/Admin/UsersPage.tsx';
import AnalyticsPage from '../pages/Admin/AnalyticsPage.tsx';
import CoursesPage from '../pages/Admin/CoursesPage.tsx';
import CourseTypesPage from '../pages/Admin/CourseTypesPage.tsx';
import ProfessorCoursesPage from '../pages/Professor/ProfessorCoursesPage.tsx';
import ProfessorAnalyticsPage from '../pages/Professor/ProfessorAnalyticsPage.tsx';
import ProfessorStudentsPage from '../pages/Professor/ProfessorStudentsPage.tsx';
import ScrollToTop from '../components/layouts/ScrollToTop';

const AppRouter = () => {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<MainLayout />}>
      
        <Route path="/" element={<LandingPage />} />

        <Route path="/courses" element={<CourseListPage />} />

        <Route path="/professor/dashboard" element={<ProtectedRoute allowedRoles={['professor']}><ProfessorDashboard /></ProtectedRoute>}>
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<ProfessorCoursesPage />} />
            <Route path="analytics" element={<ProfessorAnalyticsPage />} />
            <Route path="students" element={<ProfessorStudentsPage />} />
        </Route>

        <Route path="/professor/apply" element={<ProtectedRoute allowedRoles={['admin', 'student']}><ProfessorApplication /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/admin/dashboard" replace /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/appeals" element={<ProtectedRoute allowedRoles={['admin']}><ProfessorAppealsPage /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRoles={['admin']}><CoursesPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/admin/courseTypes" element={<ProtectedRoute allowedRoles={['admin']}><CourseTypesPage /></ProtectedRoute>} />

      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
    </>
  );
};

export default AppRouter;