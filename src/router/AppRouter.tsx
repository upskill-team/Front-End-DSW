import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import CourseListPage from '../pages/Course/CourseListPage';
import CourseDetails from '../pages/Course/CourseDetails.tsx';
import CourseLearn from '../pages/Course/CourseLearn.tsx';
import PaymentSuccess from '../pages/Payment/PaymentSuccess.tsx';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProfessorDashboard from '../pages/Professor/ProfessorDashboard';
import ProfessorAppeal from '../pages/Professor/ProfessorAppeal.tsx';
import ProfessorAppealsPage from '../pages/Admin/ProfessorAppealsPage.tsx';
import ProfessorCoursesPage from '../pages/Professor/ProfessorCoursesPage.tsx';
import ProfessorAnalyticsPage from '../pages/Professor/ProfessorAnalyticsPage.tsx';
import ProfessorStudentsPage from '../pages/Professor/ProfessorStudentsPage.tsx';
import ProfessorCourseCreation from '../pages/Professor/ProfessorCourseCreation.tsx';
import ProfessorCourseEdition from '../pages/Professor/ProfessorCourseEdition.tsx';
import ProfessorAssessmentsPage from '../pages/Professor/ProfessorAssessmentsPage.tsx';
import ProfessorAssessmentEditor from '../pages/Professor/ProfessorAssessmentEditor.tsx';
import ProfessorAssessmentAttempts from '../pages/Professor/ProfessorAssessmentAttempts.tsx';
import UsersPage from '../pages/Admin/UsersPage.tsx';
import AnalyticsPage from '../pages/Admin/AnalyticsPage.tsx';
import CoursesPage from '../pages/Admin/CoursesPage.tsx';
import CourseTypesPage from '../pages/Admin/CourseTypesPage.tsx';
import ProfilePage from '../pages/User/ProfilePage.tsx';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import ProtectedRoute from './ProtectedRoute';
import ScrollToTop from '../components/layouts/ScrollToTop';
import CourseAssessmentsPage from '../pages/Course/CourseAssessmentsPage.tsx';
import TakeAssessmentPage from '../pages/Course/TakeAssessmentPage.tsx';
import AssessmentResultsPage from '../pages/Course/AssessmentResultsPage.tsx';
import AssessmentAttemptsPage from '../pages/Course/AssessmentAttemptsPage.tsx';
import MyLearningPage from '../pages/User/MyLearningPage.tsx';

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ============= AUTH LAYOUT ============= */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* ============= MAIN LAYOUT ============= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route path="/courses/learn/:courseId" element={<CourseLearn />} />
          <Route
            path="/courses/:courseId/assessments"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <CourseAssessmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/assessments/:assessmentId/take"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <TakeAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/assessments/:assessmentId/results/:attemptId"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <AssessmentResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/assessments/:assessmentId/attempts"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <AssessmentAttemptsPage />
              </ProtectedRoute>
            }
          />

          {/* --- Pago (NO PROTEGIDA) --- */}
          {/* La ruta en sí no está protegida para que Mercado Pago pueda redirigir */}
          {/* El flujo de pago se protege en el backend (createPreference requiere auth) */}
          <Route path="/payment/success" element={<PaymentSuccess />} />

          {/* --- Protegidas: Perfil --- */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-learning"
            element={
              <ProtectedRoute allowedRoles={['student', 'professor']}>
                <MyLearningPage />
              </ProtectedRoute>
            }
          />

          {/* --- Protegidas: Profesor --- */}
          <Route
            path="/professor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['professor']}>
                <ProfessorDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="courses" replace />} />
            <Route path="courses" element={<ProfessorCoursesPage />} />
            <Route path="courses/new" element={<ProfessorCourseCreation />} />
            <Route path="courses/:courseId/edit" element={<ProfessorCourseEdition />} />
            <Route path="assessments" element={<ProfessorAssessmentsPage />} />
            <Route path="assessments/new" element={<ProfessorAssessmentEditor />} />
            <Route
              path="assessments/:assessmentId/edit"
              element={<ProfessorAssessmentEditor />}
            />
            <Route
              path="assessments/:assessmentId/attempts"
              element={<ProfessorAssessmentAttempts />}
            />
            <Route path="analytics" element={<ProfessorAnalyticsPage />} />
            <Route path="students" element={<ProfessorStudentsPage />} />
          </Route>

          <Route
            path="/professor/apply"
            element={
              <ProtectedRoute allowedRoles={['admin', 'student']}>
                <ProfessorAppeal />
              </ProtectedRoute>
            }
          />

          {/* --- Protegidas: Admin --- */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/appeals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ProfessorAppealsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CoursesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/courseTypes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CourseTypesPage />
              </ProtectedRoute>
            }
          />

          {/* --- Redirecciones Admin --- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ============= ERROR PAGES ============= */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* --- Ruta por defecto (catch-all) --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default AppRouter;
