import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  useExistingEnrollment,
  useCompleteUnit,
} from '../../hooks/useEnrollment';
import { useState, useEffect } from 'react';
import UnitSidebar from '../../components/student/UnitSidebar';
import UnitContentViewer from '../../components/student/UnitContentViewer';
import MaterialsList from '../../components/student/MaterialsList';
import QuestionsList from '../../components/student/QuestionsList';
import Button from '../../components/ui/Button';
import ErrorBoundary from '../../components/ui/ErrorBoundary';
import { CheckCircle2, BookOpen, ArrowLeft } from 'lucide-react';
import type { Unit } from '../../types/entities';

export default function CourseLearn() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null);

  const {
    data: enrollment,
    isLoading: isLoadingEnrollment,
    isError: isErrorEnrollment,
    error: enrollmentError,
  } = useExistingEnrollment(user?.studentProfile?.id, courseId);

  const { completeUnit, isPending: isCompletingUnit } = useCompleteUnit();

  useEffect(() => {
    if (isErrorEnrollment && enrollmentError?.response?.status === 404) {
      navigate(`/courses/${courseId}`);
    }
  }, [isErrorEnrollment, enrollmentError, courseId, navigate]);

  useEffect(() => {
    if (
      enrollment?.course?.units &&
      Array.isArray(enrollment.course.units) &&
      enrollment.course.units.length > 0 &&
      !currentUnit
    ) {
      setCurrentUnit(enrollment.course.units[0]);
    }
  }, [enrollment, currentUnit]);

  const handleSelectUnit = (unitNumber: number) => {
    const unit = enrollment?.course?.units.find(
      (u) => u.unitNumber === unitNumber
    );
    if (unit) {
      setCurrentUnit(unit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteUnit = () => {
    if (currentUnit && enrollment) {
      completeUnit(
        { enrollmentId: enrollment.id, unitNumber: currentUnit.unitNumber },
        {
          onError: (error) => {
            console.error(
              'Error al marcar unidad como completada:',
              error.response?.data || error.message
            );
          },
        }
      );
    }
  };

  if (isLoadingEnrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (isErrorEnrollment || !enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            No tienes acceso a este curso
          </h2>
          <p className="text-slate-600 mb-6">
            Debes inscribirte primero para acceder al contenido del curso.
          </p>
          <Button onClick={() => navigate(`/courses/${courseId}`)}>
            Ver Detalles del Curso
          </Button>
        </div>
      </div>
    );
  }

  const isUnitCompleted = currentUnit
    ? (enrollment.completedUnits || []).includes(currentUnit.unitNumber)
    : false;

  const courseProgress = enrollment.progress ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/courses')}
                className="hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Volver</span>
              </Button>
              <div className="sm:border-l sm:border-slate-300 sm:pl-4 flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 flex items-center truncate">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" />
                  <span className="truncate">{enrollment.course?.name}</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
                  Instructor: {enrollment.course?.professor?.user?.name}{' '}
                  {enrollment.course?.professor?.user?.surname}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/courses/${courseId}/assessments`)}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center gap-1 sm:gap-2 flex-1 sm:flex-initial justify-center"
              >
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">Evaluaciones</span>
              </Button>
              <div className="text-right bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-blue-200 flex-shrink-0">
                <p className="text-[10px] sm:text-xs text-slate-600 font-medium">
                  Progreso
                </p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  {courseProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-88px)]">
        <div className="hidden lg:block lg:w-80 flex-shrink-0 bg-white border-r border-slate-200 shadow-sm lg:overflow-y-auto">
          <UnitSidebar
            units={enrollment.course?.units || []}
            completedUnits={enrollment.completedUnits || []}
            currentUnitNumber={currentUnit?.unitNumber || null}
            onSelectUnit={handleSelectUnit}
            progress={courseProgress}
          />
        </div>

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-blue-50">
          {currentUnit ? (
            <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
              <div className="lg:hidden mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Seleccionar Unidad
                </label>
                <select
                  value={currentUnit.unitNumber}
                  onChange={(e) => handleSelectUnit(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {enrollment.course?.units.map((unit) => (
                    <option key={unit.unitNumber} value={unit.unitNumber}>
                      Unidad {unit.unitNumber}: {unit.name}
                      {(enrollment.completedUnits || []).includes(
                        unit.unitNumber
                      )
                        ? ' ✓'
                        : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold rounded-full">
                        Unidad {currentUnit.unitNumber}
                      </span>
                      {isUnitCompleted && (
                        <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-full">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          Completada
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                      {currentUnit.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
                      {currentUnit.materials.length > 0 && (
                        <span>
                          📎 {currentUnit.materials.length} materiales
                        </span>
                      )}
                      {currentUnit.questions.length > 0 && (
                        <span>❓ {currentUnit.questions.length} preguntas</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* --- CÓDIGO RESTAURADO AQUÍ --- */}
              <div className="mb-4 sm:mb-6 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                    Contenido de la Unidad
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  <ErrorBoundary
                    fallback={
                      <div className="text-center py-8 text-slate-600">
                        <p className="font-medium text-sm sm:text-base">Error al cargar el contenido</p>
                        <p className="text-xs sm:text-sm mt-2">Por favor, contacta al instructor si el problema persiste.</p>
                      </div>
                    }
                  >
                    <UnitContentViewer content={currentUnit.detail || ''} />
                  </ErrorBoundary>
                </div>
              </div>

              {currentUnit.materials.length > 0 && (
                <div className="mb-6">
                  <MaterialsList materials={currentUnit.materials} />
                </div>
              )}

              {currentUnit.questions.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <QuestionsList
                    courseId={enrollment.course!.id}
                    questionIds={currentUnit.questions}
                  />
                </div>
              )}

              <div className="mt-4 sm:mt-6">
                {isUnitCompleted ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-6 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
                      <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">¡Unidad Completada!</h3>
                    <p className="text-sm sm:text-base text-green-700 font-medium mb-1">Has terminado esta unidad exitosamente</p>
                    <p className="text-xs sm:text-sm text-green-600">Continúa con la siguiente unidad para seguir aprendiendo.</p>
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-blue-200 p-4 sm:p-6 shadow-sm">
                    <div className="text-center mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">¿Completaste esta unidad?</h3>
                      <p className="text-xs sm:text-sm text-slate-600">Marca esta unidad como completada para actualizar tu progreso</p>
                    </div>
                    <Button
                      onClick={handleCompleteUnit}
                      disabled={isCompletingUnit}
                      className="w-full py-4 sm:py-6 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-200"
                      size="lg"
                    >
                      {isCompletingUnit ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          <span className="text-sm sm:text-base">Guardando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span className="text-sm sm:text-base">Marcar como Completada</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[50vh] p-4 sm:p-8">
              <div className="text-center max-w-md bg-white/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-2">Comienza tu Aprendizaje</h3>
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  <span className="hidden lg:inline">Selecciona una unidad del menú lateral para comenzar a ver el contenido del curso</span>
                  <span className="lg:hidden">Usa el selector de arriba para elegir una unidad</span>
                </p>
                <div className="text-xs sm:text-sm text-slate-500">
                  {enrollment.course?.units && enrollment.course.units.length > 0 ? (
                    <span>📚 {enrollment.course.units.length} unidades disponibles</span>
                  ) : (
                    <span>No hay unidades disponibles aún</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}