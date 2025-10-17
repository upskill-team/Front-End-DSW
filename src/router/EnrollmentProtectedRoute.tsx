import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useExistingEnrollment } from "../hooks/useEnrollment";
import type { JSX } from "react";

interface EnrollmentProtectedRouteProps {
  children: JSX.Element;
}

const EnrollmentProtectedRoute = ({ children }: EnrollmentProtectedRouteProps): JSX.Element => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();

  const studentId = user?.studentProfile?.id || user?.id;

  const { data: enrollment, isLoading: isEnrollmentLoading, isError } = useExistingEnrollment(
    studentId,
    courseId
  );

  if (isAuthLoading || isEnrollmentLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Verificando acceso...</p> 
      </div>
    );
  }

  if (isError || !enrollment) {
    return <Navigate to={`/courses/${courseId}`} replace />;
  }

  return children;
};

export default EnrollmentProtectedRoute;