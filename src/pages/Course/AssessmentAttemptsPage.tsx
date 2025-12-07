import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  BarChart3,
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge';
import { Card, CardContent } from '../../components/ui/Card';
import {
  useAssessmentAttempts,
  useAssessment,
} from '../../hooks/useAssessments';

export default function AssessmentAttemptsPage() {
  const { courseId, assessmentId } = useParams<{
    courseId: string;
    assessmentId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: attempts,
    isLoading: attemptsLoading,
    isError: attemptsError,
  } = useAssessmentAttempts(assessmentId);

  const { data: assessment, isLoading: assessmentLoading } =
    useAssessment(assessmentId);

  const isLoading = attemptsLoading || assessmentLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Cargando intentos...</p>
        </div>
      </div>
    );
  }

  if (attemptsError || !attempts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Error al Cargar Intentos
            </h2>
            <p className="text-slate-600 mb-4">
              No pudimos cargar tus intentos.
            </p>
            <Button
              onClick={() => navigate(`/courses/${courseId}/assessments`)}
            >
              Volver a Evaluaciones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedAttempts = attempts.filter((a) => a.submittedAt);
  const scores = completedAttempts.map((a) => a.score ?? 0);
  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
      : 0;
  const bestAttemptId = completedAttempts.find(
    (a) => a.score === bestScore
  )?.id;

  const attemptsRemaining =
    assessment && 'attemptsRemaining' in assessment
      ? (assessment.attemptsRemaining as number)
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/courses/${courseId}/assessments`)}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Evaluaciones
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">
            Historial de Intentos
          </h1>
          {assessment && (
            <p className="text-slate-600 mt-1">{assessment.title}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-700 font-medium mb-1">
                Mejor Calificación
              </p>
              <p className="text-3xl font-bold text-purple-800">{bestScore}%</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-medium mb-1">Promedio</p>
              <p className="text-3xl font-bold text-blue-800">
                {averageScore}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-700 font-medium mb-1">
                Intentos Realizados
              </p>
              <p className="text-3xl font-bold text-slate-800">
                {completedAttempts.length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700 font-medium mb-1">
                Intentos Disponibles
              </p>
              <p className="text-3xl font-bold text-green-800">
                {attemptsRemaining ?? '∞'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Todos los Intentos
            </h2>
            <Badge className="bg-purple-100 text-purple-700">
              {attempts.length} {attempts.length === 1 ? 'intento' : 'intentos'}
            </Badge>
          </div>

          {attempts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No hay intentos registrados
                </h3>
                <p className="text-slate-600 mb-6">
                  Aún no has realizado ningún intento en esta evaluación.
                </p>
                <Button
                  onClick={() =>
                    navigate(
                      `/courses/${courseId}/assessments/${assessmentId}/take`
                    )
                  }
                  className="bg-gradient-to-r from-purple-600 to-purple-700"
                >
                  Iniciar Evaluación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {attempts
                .sort((a, b) => {
                  const dateA = new Date(a.startedAt).getTime();
                  const dateB = new Date(b.startedAt).getTime();
                  return dateB - dateA; // Más reciente primero
                })
                .map((attempt, index) => {
                  const isBest = attempt.id === bestAttemptId;
                  const isCompleted = !!attempt.submittedAt;
                  const score = attempt.score ?? 0;
                  const passed = attempt.passed ?? false;

                  return (
                    <Card
                      key={attempt.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isBest
                          ? 'border-2 border-purple-400 bg-gradient-to-r from-purple-50 to-indigo-50'
                          : 'hover:border-purple-300'
                      }`}
                      onClick={() => {
                        if (isCompleted) {
                          navigate(
                            `/courses/${courseId}/assessments/${assessmentId}/results/${attempt.id}`
                          );
                        }
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                isBest
                                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {attempts.length - index}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="text-sm text-slate-600">
                                  {new Date(attempt.startedAt).toLocaleString(
                                    'es-ES',
                                    {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {isBest && (
                                  <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                    <Award className="w-3 h-3 mr-1" />
                                    Mejor Intento
                                  </Badge>
                                )}
                                {isCompleted ? (
                                  <Badge
                                    className={
                                      passed
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }
                                  >
                                    {passed ? 'Aprobado' : 'Reprobado'}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700">
                                    En Progreso
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            {isCompleted ? (
                              <>
                                <div className="text-right">
                                  <p className="text-sm text-slate-600 mb-1">
                                    Calificación
                                  </p>
                                  <p
                                    className={`text-2xl font-bold ${
                                      passed ? 'text-green-600' : 'text-red-600'
                                    }`}
                                  >
                                    {score}%
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm text-slate-600 mb-1">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    Tiempo
                                  </p>
                                  <p className="text-lg font-semibold text-slate-700">
                                    {attempt.submittedAt && attempt.startedAt
                                      ? Math.round(
                                          (new Date(
                                            attempt.submittedAt
                                          ).getTime() -
                                            new Date(
                                              attempt.startedAt
                                            ).getTime()) /
                                            60000
                                        )
                                      : 0}{' '}
                                    min
                                  </p>
                                </div>

                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                >
                                  Ver Detalles
                                </Button>
                              </>
                            ) : (
                              <div className="text-slate-600 italic">
                                Evaluación sin completar
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}/assessments`)}
          >
            Volver a Evaluaciones
          </Button>
          {attemptsRemaining !== 0 && (
            <Button
              onClick={() =>
                navigate(
                  `/courses/${courseId}/assessments/${assessmentId}/take`
                )
              }
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              Realizar Nuevo Intento
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
