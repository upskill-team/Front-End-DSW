import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  List,
  CheckCircle2,
} from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '../../components/ui/Card';
import { useAttemptDetails } from '../../hooks/useAssessments';
import { cn } from '../../lib/utils'; // <-- Importar la utilidad cn

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
  const correctAnswersCount = attempt.answers?.filter(a => a.isCorrect).length ?? 0;
  const totalQuestions = attempt.answers?.length ?? 0;

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
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="mb-6">
              {passed ? (
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 mx-auto mb-4" />
              )}
              <h2
                className={`text-2xl sm:text-3xl font-bold mb-2 ${
                  passed ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {passed ? '¡Felicitaciones!' : 'Puedes Mejorar'}
              </h2>
              <p
                className={`text-base sm:text-lg ${
                  passed ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {passed
                  ? 'Has aprobado la evaluación exitosamente.'
                  : 'Necesitas mejorar tu calificación para aprobar.'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                 <p className="text-sm text-slate-600">Tu Calificación</p>
                 <p className={`text-3xl font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>{score}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                 <p className="text-sm text-slate-600">Respuestas Correctas</p>
                 <p className="text-3xl font-bold text-slate-800">{correctAnswersCount} / {totalQuestions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                 <p className="text-sm text-slate-600">Tiempo Utilizado</p>
                 <p className="text-3xl font-bold text-slate-800">{timeSpent} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* --- NUEVA SECCIÓN DE REVISIÓN DE RESPUESTAS --- */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Revisión de Respuestas
          </h2>

          {attempt.answers?.map((answer, index) => {
            const question =
              typeof answer.question === 'string' ? null : answer.question;

            if (!question) return null; // No renderizar si no hay datos de la pregunta

            return (
              <Card
                key={answer.id || index}
                className={cn('overflow-hidden border-2', {
                  'border-green-200 bg-green-50/30': answer.isCorrect,
                  'border-red-200 bg-red-50/30': !answer.isCorrect,
                })}
              >
                <CardHeader className="bg-white/80 border-b">
                   <p className="text-sm font-semibold text-slate-800">Pregunta {index + 1}: <span className="font-normal">{question.text}</span></p>
                </CardHeader>

                <CardContent className="p-6">
                  {question.type === 'multiple_choice' && (
                    <div className="space-y-3">
                      {question.options?.map(
                        (option, optIndex) => {
                          const isSelectedByStudent = answer.answer === optIndex;
                          const isCorrectOption = question.payload.correctAnswer === optIndex;

                          return (
                            <div
                              key={option.id}
                              className={cn(
                                'p-3 rounded-lg border-2 flex items-center gap-3',
                                {
                                  'border-green-500 bg-green-100': isCorrectOption, // Resaltar siempre la correcta
                                  'border-red-500 bg-red-100': isSelectedByStudent && !isCorrectOption, // Resaltar la incorrecta del usuario
                                  'border-slate-200 bg-white': !isCorrectOption && !isSelectedByStudent,
                                }
                              )}
                            >
                              {isCorrectOption ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : isSelectedByStudent ? (
                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                              ) : (
                                <div className="w-5 h-5 flex-shrink-0" /> // Espaciador
                              )}
                              <span className="text-slate-800 flex-1">{option.text}</span>
                              {isSelectedByStudent && <Badge className="bg-blue-100 text-blue-700">Tu respuesta</Badge>}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                  {/* Aquí se podría añadir la lógica para preguntas abiertas si las tuvieras */}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* --- FIN DE LA NUEVA SECCIÓN --- */}
        
        {/* Botones Finales */}
        <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/${courseId}/assessments/${assessmentId}/attempts`)}
            >
              <List className="w-4 h-4 mr-2" />
              Ver Todos los Intentos
            </Button>
            {!passed && (
              <Button
                onClick={() => navigate(`/courses/${courseId}/assessments/${assessmentId}/take`)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}