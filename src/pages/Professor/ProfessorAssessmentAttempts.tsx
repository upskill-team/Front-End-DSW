import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAssessment,
  useAssessmentAttempts,
  useAttemptDetails,
} from '../../hooks/useAssessments';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trophy,
  Calendar,
} from 'lucide-react';
import type { AssessmentAttempt } from '../../types/entities';

export default function ProfessorAssessmentAttemptsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(
    null
  );

  const { data: assessment, isLoading: isLoadingAssessment } =
    useAssessment(assessmentId);
  const { data: attempts, isLoading: isLoadingAttempts } =
    useAssessmentAttempts(assessmentId);
  const { data: attemptDetails } = useAttemptDetails(selectedAttemptId || undefined);

  if (isLoadingAssessment || isLoadingAttempts) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando intentos...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Evaluación no encontrada</p>
      </div>
    );
  }

  const totalAttempts = attempts?.length || 0;
  const completedAttempts =
    attempts?.filter((a) => a.status === 'submitted').length || 0;
  const passedAttempts =
    attempts?.filter((a) => a.passed === true).length || 0;
  const averageScore =
    completedAttempts > 0 && attempts
      ? attempts
          .filter((a) => a.status === 'submitted' && a.score !== undefined)
          .reduce((sum, a) => sum + (a.score || 0), 0) / completedAttempts
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/professor/dashboard/assessments')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {assessment.title}
          </h1>
          <p className="text-gray-600 mt-1">
            Intentos de estudiantes - {assessment.course.name}
          </p>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Intentos</p>
              <p className="text-2xl font-bold">{totalAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold">{passedAttempts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold">{completedAttempts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Intentos */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Intentos de Estudiantes</h2>

        {!attempts || attempts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No hay intentos registrados</p>
            <p className="text-sm mt-1">
              Los intentos aparecerán aquí cuando los estudiantes realicen la
              evaluación
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Estudiante</th>
                  <th className="text-left py-3 px-4">Intento #</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Puntaje</th>
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {attempt.student.name}{' '}
                          {attempt.student.surname || ''}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        #{attempt.attemptNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          attempt.status === 'submitted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {attempt.status === 'submitted'
                          ? 'Enviado'
                          : 'En progreso'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {attempt.score !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {attempt.score.toFixed(1)}%
                          </span>
                          {attempt.passed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(attempt.startedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAttemptId(attempt.id)}
                        className="flex items-center gap-2"
                        disabled={attempt.status !== 'submitted'}
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal de Detalles del Intento */}
      {selectedAttemptId && attemptDetails && (
        <AttemptDetailsModal
          attempt={attemptDetails}
          onClose={() => setSelectedAttemptId(null)}
        />
      )}
    </div>
  );
}

// Modal para ver detalles del intento
interface AttemptDetailsModalProps {
  attempt: AssessmentAttempt;
  onClose: () => void;
}

function AttemptDetailsModal({ attempt, onClose }: AttemptDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Detalles del Intento</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              ×
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Estudiante: {attempt.student.name} {attempt.student.surname}
            </span>
            <span>•</span>
            <span>Intento #{attempt.attemptNumber}</span>
            <span>•</span>
            <span>
              Puntaje:{' '}
              <span className="font-bold text-gray-900">
                {attempt.score?.toFixed(1)}%
              </span>
            </span>
            <span>•</span>
            <span
              className={attempt.passed ? 'text-green-600' : 'text-red-600'}
            >
              {attempt.passed ? 'Aprobado' : 'Reprobado'}
            </span>
          </div>
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-lg font-semibold mb-4">Respuestas</h3>
          {attempt.answers && attempt.answers.length > 0 ? (
            <div className="space-y-4">
              {attempt.answers.map((answer, index) => (
                <Card
                  key={answer.id}
                  className={`p-4 ${
                    answer.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">
                          Pregunta #{index + 1}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                          {answer.question.questionType}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-3">
                        {answer.question.questionText}
                      </p>

                      {answer.question.questionType ===
                        'MultipleChoiceOption' && (
                        <div className="space-y-2">
                          {answer.question.payload.options.map(
                            (option: string, optIndex: number) => {
                              const isStudentAnswer =
                                typeof answer.answer === 'number' &&
                                answer.answer === optIndex;
                              const isCorrectAnswer =
                                answer.question.payload.correctAnswer ===
                                optIndex;

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded ${
                                    isCorrectAnswer
                                      ? 'bg-green-100 border border-green-300'
                                      : isStudentAnswer
                                      ? 'bg-red-100 border border-red-300'
                                      : 'bg-white border border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCorrectAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    {isStudentAnswer && !isCorrectAnswer && (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span>{option}</span>
                                    {isStudentAnswer && (
                                      <span className="text-xs text-gray-600 ml-auto">
                                        (Respuesta del estudiante)
                                      </span>
                                    )}
                                    {isCorrectAnswer && (
                                      <span className="text-xs text-green-600 ml-auto">
                                        (Respuesta correcta)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No hay respuestas disponibles
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
