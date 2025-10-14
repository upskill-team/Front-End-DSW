import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  RotateCcw,
  List,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { useAttemptDetails } from '../../hooks/useAssessments';

export default function AssessmentResultsPage() {
  const { courseId, assessmentId, attemptId } = useParams<{
    courseId: string;
    assessmentId: string;
    attemptId: string;
  }>();
  const navigate = useNavigate();

  const {
    data: attempt,
    isLoading,
    isError,
    error,
  } = useAttemptDetails(attemptId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-700 font-medium">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (isError || !attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Error al Cargar Resultados
            </h2>
            <p className="text-slate-600 mb-4">
              {error?.message || 'No pudimos cargar los resultados.'}
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

  const assessmentData =
    typeof attempt.assessment === 'string' ? null : attempt.assessment;

  const score = attempt.score ?? 0;
  const passed = attempt.passed ?? false;
  const timeSpent = attempt.timeSpent ?? 0;

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
            Resultados de la Evaluación
          </h1>
          {assessmentData && (
            <p className="text-slate-600 mt-1">{assessmentData.title}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Resultado Principal */}
        <Card
          className={`mb-8 overflow-hidden border-2 ${
            passed
              ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
              : 'border-red-300 bg-gradient-to-br from-red-50 to-rose-50'
          }`}
        >
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {passed ? (
                <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
              )}
              <h2
                className={`text-3xl font-bold mb-2 ${
                  passed ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {passed ? '¡Felicitaciones!' : 'No Aprobaste'}
              </h2>
              <p
                className={`text-lg ${
                  passed ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {passed
                  ? 'Has aprobado la evaluación exitosamente'
                  : 'Necesitas mejorar tu calificación para aprobar'}
              </p>
            </div>

            {/* Score */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-lg shadow-md">
                <Award className="w-10 h-10 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm text-slate-600">Tu Calificación</p>
                  <p className="text-4xl font-bold text-purple-700">{score}%</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                <TrendingUp className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Nota para Aprobar</p>
                <p className="text-xl font-bold text-slate-800">
                  {assessmentData?.passingScore ?? 70}%
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Tiempo Utilizado</p>
                <p className="text-xl font-bold text-slate-800">
                  {timeSpent} min
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <CheckCircle className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Preguntas Correctas</p>
                <p className="text-xl font-bold text-slate-800">
                  {attempt.answers?.filter((a) => a.isCorrect).length ?? 0} /{' '}
                  {attempt.answers?.length ?? 0}
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-center mt-6">
              <Button
                variant="outline"
                onClick={() =>
                  navigate(
                    `/courses/${courseId}/assessments/${assessmentId}/attempts`
                  )
                }
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <List className="w-4 h-4 mr-2" />
                Ver Todos los Intentos
              </Button>
              {!passed && (
                <Button
                  onClick={() =>
                    navigate(
                      `/courses/${courseId}/assessments/${assessmentId}/take`,
                      {
                        state: { fromResults: true },
                      }
                    )
                  }
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revisión de Respuestas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Revisión de Respuestas
          </h2>

          {attempt.answers?.map((answer, index) => {
            const question =
              typeof answer.question === 'string' ? null : answer.question;

            return (
              <Card
                key={answer.id || index}
                className={`overflow-hidden border-2 ${
                  answer.isCorrect
                    ? 'border-green-200 bg-green-50/30'
                    : 'border-red-200 bg-red-50/30'
                }`}
              >
                <CardHeader className="bg-white/80 border-b">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        answer.isCorrect
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold text-slate-800">
                          {question?.text || 'Pregunta'}
                        </CardTitle>
                        <Badge
                          className={
                            answer.isCorrect
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {answer.isCorrect ? 'Correcta' : 'Incorrecta'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {answer.points ?? question?.points ?? 0} puntos
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Pregunta de Opción Múltiple */}
                  {question?.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {question.options?.map(
                        (option: {
                          id: string;
                          text: string;
                          isCorrect: boolean;
                        }) => {
                          const isSelected = answer.selectedOptions?.includes(
                            option.id
                          );
                          const isCorrect = option.isCorrect;

                          return (
                            <div
                              key={option.id}
                              className={`p-4 rounded-lg border-2 ${
                                isSelected && isCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : isSelected && !isCorrect
                                  ? 'border-red-500 bg-red-50'
                                  : isCorrect
                                  ? 'border-green-300 bg-green-50/50'
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-slate-700">
                                  {option.text}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <Badge className="bg-blue-100 text-blue-700">
                                      Tu respuesta
                                    </Badge>
                                  )}
                                  {isCorrect && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}

                  {/* Pregunta Abierta */}
                  {question?.type === 'open_ended' && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">
                          Tu Respuesta:
                        </p>
                        <div className="p-4 bg-white border-2 border-slate-200 rounded-lg">
                          <p className="text-slate-800 whitespace-pre-wrap">
                            {answer.textAnswer || 'Sin respuesta'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback */}
                  {answer.feedback && (
                    <div
                      className={`mt-4 p-4 rounded-lg ${
                        answer.isCorrect
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-blue-100 border border-blue-300'
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          answer.isCorrect ? 'text-green-800' : 'text-blue-800'
                        }`}
                      >
                        <strong>Feedback:</strong> {answer.feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Botones Finales */}
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/courses/${courseId}/assessments`)}
          >
            Volver a Evaluaciones
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/courses/${courseId}/assessments/${assessmentId}/attempts`
              )
            }
          >
            <List className="w-4 h-4 mr-2" />
            Ver Todos los Intentos
          </Button>
        </div>
      </div>
    </div>
  );
}
