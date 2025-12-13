import { BookOpen, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import type { Unit } from '../../types/entities';
import { cn } from '../../lib/utils';

interface UnitSidebarProps {
  units: Unit[];
  completedUnits: number[];
  currentUnitNumber: number | null;
  onSelectUnit: (unitNumber: number) => void;
  progress: number;
}

export default function UnitSidebar({
  units,
  completedUnits,
  currentUnitNumber,
  onSelectUnit,
  progress,
}: UnitSidebarProps) {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header con progreso - Estilo mejorado */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50">
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Contenido del Curso
        </h2>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-700">
              Tu Progreso
            </span>
            <span className="text-lg font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {completedUnits.length} de {units.length} completadas
            </span>
            {progress === 100 && (
              <span className="text-green-600 font-semibold">
                ¡Curso completo! 🎉
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Lista de unidades - Estilo mejorado */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {units.map((unit) => {
            const isCompleted = completedUnits.includes(unit.unitNumber);
            const isCurrent = currentUnitNumber === unit.unitNumber;

            return (
              <button
                key={unit.unitNumber}
                onClick={() => onSelectUnit(unit.unitNumber)}
                className={cn(
                  'w-full text-left p-4 rounded-xl border transition-all duration-200',
                  'hover:shadow-md hover:scale-[1.01]',
                  isCurrent
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg scale-[1.02]'
                    : isCompleted
                    ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50/30 hover:border-green-400'
                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50',
                  'group'
                )}
              >
                <div className="flex items-start space-x-3">
                  {/* Indicador de completado */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 drop-shadow-sm" />
                    ) : isCurrent ? (
                      <Circle className="w-6 h-6 text-blue-600 fill-blue-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />
                    )}
                  </div>

                  {/* Información de la unidad */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wide',
                          isCurrent ? 'text-blue-600' : 'text-slate-500'
                        )}
                      >
                        Unidad {unit.unitNumber}
                      </span>
                      {isCompleted && (
                        <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full font-semibold shadow-sm">
                          ✓
                        </span>
                      )}
                      {isCurrent && !isCompleted && (
                        <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded-full font-semibold shadow-sm animate-pulse">
                          •
                        </span>
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm font-bold leading-tight',
                        isCurrent ? 'text-slate-900' : 'text-slate-700'
                      )}
                    >
                      {unit.name}
                    </p>

                    {/* Indicadores adicionales */}
                    <div className="flex items-center gap-3 mt-2">
                      {((unit.materials && unit.materials.length > 0) ||
                        (unit.materialsCount && unit.materialsCount > 0)) && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          {unit.materialsCount ?? unit.materials?.length ?? 0}{' '}
                          material
                          {(unit.materialsCount ??
                            unit.materials?.length ??
                            0) !== 1
                            ? 'es'
                            : ''}
                        </span>
                      )}
                      {((unit.questions && unit.questions.length > 0) ||
                        (unit.questionsCount && unit.questionsCount > 0)) && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          {unit.questionsCount ?? unit.questions?.length ?? 0}{' '}
                          pregunta
                          {(unit.questionsCount ??
                            unit.questions?.length ??
                            0) !== 1
                            ? 's'
                            : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flecha indicadora para unidad actual */}
                  {isCurrent && (
                    <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
