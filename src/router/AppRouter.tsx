import {Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.tsx';
import LoginPage from '../pages/Auth/LoginPage.tsx'
import RegisterPage from '../pages/Auth/RegisterPage.tsx'
import CourseListPage from '../pages/Course/CourseListPage.tsx'
import AdminDashboard from '../pages/Admin/AdminDashboard.tsx'
import ProfessorDashboard from '../pages/Professor/ProfessorDashboard.tsx'
import UnauthorizedPage from '../pages/UnauthorizedPage.tsx';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<CourseListPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} /> 
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/professor/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'professor']}>
            <ProfessorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
