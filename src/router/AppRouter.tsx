import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import ScrollToTop from '../components/layouts/ScrollToTop';
import ProtectedRoute from './ProtectedRoute';
import EnrollmentProtectedRoute from './EnrollmentProtectedRoute';

const PageLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

const LandingPage = lazy(() => import('../pages/LandingPage'));
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/Auth/ResetPasswordPage'));
const CourseListPage = lazy(() => import('../pages/Course/CourseListPage'));
const CourseDetails = lazy(() => import('../pages/Course/CourseDetails'));
const CourseLearn = lazy(() => import('../pages/Course/CourseLearn'));
const PaymentSuccess = lazy(() => import('../pages/Payment/PaymentSuccess'));
const AdminDashboard = lazy(() => import('../pages/Admin/AdminDashboard'));
const ProfessorDashboard = lazy(() => import('../pages/Professor/ProfessorDashboard'));
const ProfessorAppeal = lazy(() => import('../pages/Professor/ProfessorAppeal'));
const ProfessorAppealStatusPage = lazy(() => import('../pages/Professor/ProfessorAppealStatusPage'));
const ProfessorAppealsPage = lazy(() => import('../pages/Admin/ProfessorAppealsPage'));
const ProfessorCoursesPage = lazy(() => import('../pages/Professor/ProfessorCoursesPage'));
const ProfessorAnalyticsPage = lazy(() => import('../pages/Professor/ProfessorAnalyticsPage'));
const ProfessorCourseCreation = lazy(() => import('../pages/Professor/ProfessorCourseCreation'));
const ProfessorCourseEdition = lazy(() => import('../pages/Professor/ProfessorCourseEdition'));
const ProfessorAssessmentsPage = lazy(() => import('../pages/Professor/ProfessorAssessmentsPage'));
const ProfessorAssessmentEditor = lazy(() => import('../pages/Professor/ProfessorAssessmentEditor'));
const ProfessorAssessmentAttempts = lazy(() => import('../pages/Professor/ProfessorAssessmentAttempts'));
const AnalyticsPage = lazy(() => import('../pages/Admin/AnalyticsPage'));
const CourseTypesPage = lazy(() => import('../pages/Admin/CourseTypesPage'));
const ProfilePage = lazy(() => import('../pages/User/ProfilePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FAQPage = lazy(() => import('../pages/FAQPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const CourseAssessmentsPage = lazy(() => import('../pages/Course/CourseAssessmentsPage'));
const TakeAssessmentPage = lazy(() => import('../pages/Course/TakeAssessmentPage'));
const AssessmentResultsPage = lazy(() => import('../pages/Course/AssessmentResultsPage'));
const AssessmentAttemptsPage = lazy(() => import('../pages/Course/AssessmentAttemptsPage'));
const MyLearningPage = lazy(() => import('../pages/User/MyLearningPage'));

const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback = {<PageLoader />}>
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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/courses" element={<CourseListPage />} />
            
            <Route path="/courses/learn/:courseId" element={
              <EnrollmentProtectedRoute>
                <CourseLearn />
              </EnrollmentProtectedRoute>
              }
            />
            
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route
              path="/courses/:courseId/assessments"
              element={
                <ProtectedRoute allowedRoles={['student', 'professor']}>
                  <EnrollmentProtectedRoute>
                    <CourseAssessmentsPage />
                  </EnrollmentProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/assessments/:assessmentId/take"
              element={
                <ProtectedRoute allowedRoles={['student', 'professor']}>
                  <EnrollmentProtectedRoute>
                    <TakeAssessmentPage />
                  </EnrollmentProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/assessments/:assessmentId/results/:attemptId"
              element={
                <ProtectedRoute allowedRoles={['student', 'professor']}>
                  <EnrollmentProtectedRoute>
                    <AssessmentResultsPage />
                  </EnrollmentProtectedRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:courseId/assessments/:assessmentId/attempts"
              element={
                <ProtectedRoute allowedRoles={['student', 'professor']}>
                  <EnrollmentProtectedRoute>
                    <AssessmentAttemptsPage />
                  </EnrollmentProtectedRoute>
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
            </Route>

            <Route
              path="/professor/apply"
              element={
                <ProtectedRoute allowedRoles={['admin', 'student']}>
                  <ProfessorAppeal />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/professor/applications" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ProfessorAppealStatusPage />
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
      </Suspense>
    </>
  );
};

export default AppRouter;
