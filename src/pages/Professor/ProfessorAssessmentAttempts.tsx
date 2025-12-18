import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useAssessment,
  useAllAttemptsForProfessor,
  useAssessmentStatistics,
  useAttemptDetails,
} from '../../hooks/useAssessments';
import Button from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  Trophy,
  Calendar,
  Percent,
} from 'lucide-react';
import type { AssessmentAttempt } from '../../types/entities';

export default function ProfessorAssessmentAttemptsPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

  const { data: assessment, isLoading: isLoadingAssessment } = useAssessment(assessmentId);
  const { data: attempts, isLoading: isLoadingAttempts } = useAllAttemptsForProfessor(assessmentId);
  const { data: statistics, isLoading: isLoadingStats } = useAssessmentStatistics(assessmentId);
  const { data: attemptDetails } = useAttemptDetails(selectedAttemptId || undefined);
    
  const isLoading = isLoadingAssessment || isLoadingAttempts || isLoadingStats;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas y intentos...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <p className="text-center text-gray-600">Evaluación no encontrada</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="container mx-auto max-w-7xl pt-24 pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/professor/dashboard/assessments')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">{assessment.title}</h1>
          <p className="text-gray-600 mt-1 truncate">Resultados de Estudiantes - {assessment.course.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Estudiantes</p>
              <p className="text-2xl font-bold">{statistics?.uniqueStudents || 0}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Tasa Aprobación</p>
              <p className="text-2xl font-bold">{statistics?.passRate?.toFixed(1) || 0}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg"><Trophy className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Mejor Nota</p>
              <p className="text-2xl font-bold">{statistics?.highestScore?.toFixed(1) || 0}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg"><Percent className="w-6 h-6 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Promedio</p>
              <p className="text-2xl font-bold">{statistics?.averageScore?.toFixed(1) || 0}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4">Intentos de Estudiantes</h2>
        {(!attempts || attempts.length === 0) ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p>No hay intentos registrados</p>
            <p className="text-sm mt-1">
              Los intentos aparecerán aquí cuando los estudiantes realicen la evaluación
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 md:hidden">
              {attempts.map(attempt => (
                <Card key={attempt.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium truncate">{attempt.student.name} {attempt.student.surname || ''}</p>
                    {attempt.score !== undefined && (
                        <span className={`font-bold text-lg ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>{attempt.score.toFixed(1)}%</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                     <p><strong>Intento:</strong> #{attempt.attemptNumber}</p>
                     <p><strong>Fecha:</strong> {new Date(attempt.startedAt).toLocaleDateString()}</p>
                     <p><strong>Estado:</strong> {attempt.passed ? 'Aprobado' : 'Reprobado'}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAttemptId(attempt.id)} className="w-full" disabled={attempt.status !== 'submitted'}>
                    <Eye className="w-4 h-4 mr-2" />Ver Detalles
                  </Button>
                </Card>
              ))}
            </div>
            
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left font-semibold py-3 px-4">Estudiante</th>
                        <th className="text-center font-semibold py-3 px-4">Intento #</th>
                        <th className="text-left font-semibold py-3 px-4">Estado</th>
                        <th className="text-right font-semibold py-3 px-4">Puntaje</th>
                        <th className="text-left font-semibold py-3 px-4">Fecha</th>
                        <th className="text-center font-semibold py-3 px-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                            <p className="font-medium truncate">{attempt.student.name} {attempt.student.surname || ''}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                            <span className="text-gray-600">#{attempt.attemptNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                        <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            attempt.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            {attempt.status === 'submitted' ? 'Enviado' : 'En progreso'}
                        </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                        {attempt.score !== undefined ? (
                            <div className="flex items-center justify-end gap-2">
                            <span className="font-semibold">{attempt.score.toFixed(1)}%</span>
                            {attempt.passed ? ( <CheckCircle className="w-4 h-4 text-green-500" /> ) : ( <XCircle className="w-4 h-4 text-red-500" /> )}
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
                        <td className="py-3 px-4 text-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedAttemptId(attempt.id)}
                            className="flex items-center gap-2 mx-auto"
                            disabled={attempt.status !== 'submitted'}
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden lg:inline">Ver</span>
                        </Button>
                        </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      {selectedAttemptId && attemptDetails && (
        <AttemptDetailsModal attempt={attemptDetails} onClose={() => setSelectedAttemptId(null)} />
      )}
    </div>
  );
}

interface AttemptDetailsModalProps {
  attempt: AssessmentAttempt;
  onClose: () => void;
}

function AttemptDetailsModal({ attempt, onClose }: AttemptDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl sm:text-2xl font-bold">Detalles del Intento</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span><strong>Estudiante:</strong> {attempt.student.name} {attempt.student.surname}</span>
            <span className="hidden sm:inline">•</span>
            <span><strong>Intento:</strong> #{attempt.attemptNumber}</span>
            <span className="hidden sm:inline">•</span>
            <span><strong>Puntaje:</strong> <span className="font-bold text-gray-900">{attempt.score?.toFixed(1)}%</span></span>
            <span className="hidden sm:inline">•</span>
            <span className={attempt.passed ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
              {attempt.passed ? 'Aprobado' : 'Reprobado'}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                        <span className="font-semibold">Pregunta #{index + 1}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">{answer.question.questionType}</span>
                      </div>
                      <p className="text-gray-900 mb-3">{answer.question.questionText}</p>
                      {answer.question.questionType === 'MultipleChoiceOption' && (
                        <div className="space-y-2">
                          {answer.question.payload.options.map(
                            (option: string, optIndex: number) => {
                              const isStudentAnswer = typeof answer.answer === 'number' && answer.answer === optIndex;
                              const isCorrectAnswer = answer.question.payload.correctAnswer === optIndex;

                              return (
                                <div key={optIndex} className={`p-2 rounded ${isCorrectAnswer ? 'bg-green-100 border border-green-300' : isStudentAnswer ? 'bg-red-100 border border-red-300' : 'bg-white border border-gray-200'}`}>
                                  <div className="flex items-center gap-2">
                                    {isCorrectAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
                                    {isStudentAnswer && !isCorrectAnswer && <XCircle className="w-4 h-4 text-red-600" />}
                                    <span>{option}</span>
                                    {isStudentAnswer && <span className="text-xs text-gray-600 ml-auto">(Respuesta del estudiante)</span>}
                                    {isCorrectAnswer && !isStudentAnswer && <span className="text-xs text-green-600 ml-auto">(Respuesta correcta)</span>}
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
            <p className="text-center text-gray-500 py-8">No hay respuestas disponibles</p>
          )}
        </div>

        <div className="p-4 sm:p-6 border-t flex justify-end">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}