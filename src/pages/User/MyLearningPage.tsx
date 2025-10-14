import { useAuth } from '../../hooks/useAuth';
import { useStudentEnrollments } from '../../hooks/useEnrollment';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import StatusBadge from '../../components/ui/StatusBadge';

/**
 * MyLearningPage Component
 *
 * Displays the user's enrolled courses with their progress and status.
 * Supports both students and professors as learners.
 */
export default function MyLearningPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Get the student ID for fetching enrollments.
   * For students: uses studentProfile.id or user.id
   * For professors: uses user.id (backend creates studentProfile on enrollment)
   */
  const getStudentId = () => {
    if (user?.studentProfile?.id) {
      return user.studentProfile.id;
    }
    if (user?.professorProfile?.id || user?.role === 'professor') {
      return user.id;
    }
    if (user?.role === 'student') {
      return user.id;
    }
    return undefined;
  };

  const studentId = getStudentId();

  const {
    data: enrollments,
    isLoading,
    isError,
    error,
  } = useStudentEnrollments(studentId);

  // Check if user doesn't have a valid ID
  if (!studentId && !isLoading && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              No se pudo cargar tu perfil
            </h2>
            <p className="text-slate-600 mb-4">
              Ocurrió un error al cargar tu información. Por favor, intenta
              iniciar sesión nuevamente.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al Inicio
              </Button>
              <Button onClick={() => window.location.reload()}>
                Recargar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Cargando tus cursos...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Error al Cargar
            </h2>
            <p className="text-slate-600 mb-4">
              No pudimos cargar tus cursos. Por favor, intenta de nuevo.
            </p>
            <p className="text-sm text-red-600">
              {error?.message || 'Error desconocido'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeEnrollments =
    enrollments?.filter((e) => e.state === 'enrolled') || [];
  const completedEnrollments =
    enrollments?.filter((e) => e.state === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center mb-2">
                <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
                Mis Aprendizajes
              </h1>
              <p className="text-slate-600">
                Gestiona y continúa con tus cursos
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {enrollments?.length || 0}
                  </p>
                  <p className="text-sm text-slate-600">Total Cursos</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {completedEnrollments.length}
                  </p>
                  <p className="text-sm text-slate-600">Completados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {activeEnrollments.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Cursos en Progreso
              <Badge className="ml-3 bg-blue-100 text-blue-700">
                {activeEnrollments.length}
              </Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onContinue={() =>
                    navigate(`/courses/learn/${enrollment.course.id}`)
                  }
                  onViewAssessments={() =>
                    navigate(`/courses/${enrollment.course.id}/assessments`)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {completedEnrollments.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-green-600" />
              Cursos Completados
              <Badge className="ml-3 bg-green-100 text-green-700">
                {completedEnrollments.length}
              </Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEnrollments.map((enrollment) => (
                <EnrollmentCard
                  key={enrollment.id}
                  enrollment={enrollment}
                  onContinue={() =>
                    navigate(`/courses/learn/${enrollment.course.id}`)
                  }
                  onViewAssessments={() =>
                    navigate(`/courses/${enrollment.course.id}/assessments`)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {enrollments?.length === 0 && (
          <Card className="max-w-2xl mx-auto mt-12">
            <CardContent className="text-center py-16">
              <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Aún no estás inscrito en ningún curso
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Explora nuestro catálogo de cursos y comienza tu viaje de
                aprendizaje hoy mismo.
              </p>
              <Button
                onClick={() => navigate('/courses')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Explorar Cursos
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

/**
 * EnrollmentCard Component
 *
 * Displays a single course enrollment with progress, status, and actions.
 */
interface EnrollmentCardProps {
  enrollment: import('../../types/entities').Enrollment;
  onContinue: () => void;
  onViewAssessments: () => void;
}

function EnrollmentCard({
  enrollment,
  onContinue,
  onViewAssessments,
}: EnrollmentCardProps) {
  const progress = enrollment.progress ?? 0;
  const isCompleted = enrollment.state === 'completed';

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Imagen del curso */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-slate-100">
        {enrollment.course.imageUrl ? (
          <img
            src={enrollment.course.imageUrl}
            alt={enrollment.course.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-slate-400" />
          </div>
        )}
        {/* Badge de estado */}
        <div className="absolute top-3 right-3 shadow-lg">
          <StatusBadge status={isCompleted ? 'completed' : 'in-progress'} />
        </div>
      </div>

      <CardContent className="p-6">
        <Badge className="mb-3 bg-blue-100 text-blue-700">
          {enrollment.course.courseType?.name || 'Curso'}
        </Badge>

        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {enrollment.course.name}
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          {enrollment.course.professor?.user?.name}{' '}
          {enrollment.course.professor?.user?.surname}
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">Progreso</span>
            <span className="text-sm font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isCompleted && enrollment.grade && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">
                Calificación
              </span>
              <span className="text-lg font-bold text-green-700">
                {enrollment.grade}/100
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onContinue}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            size="sm"
          >
            {isCompleted ? 'Revisar' : 'Continuar'}
          </Button>
          <Button
            onClick={onViewAssessments}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Clock className="w-4 h-4 mr-1" />
            Evaluaciones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
