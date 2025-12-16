import { Link, useNavigate } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import SaveStatus from './SaveStatus';
import Switch from '../../ui/Swtich/Switch';
import { ArrowLeft, Edit, Eye, FileText, HelpCircle } from 'lucide-react';

interface CourseHeaderProps {
  courseId?: string;
  courseName: string;
  onSave: () => void;
  onToggleEdit: () => void;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  saveError?: string | null;
  lastSavedAt?: Date;
  isEditMode?: boolean;
  onOpenGeneralQuestions?: () => void;
}

export default function CourseHeader({
  courseId,
  courseName,
  onSave,
  onToggleEdit,
  isSaving,
  hasUnsavedChanges = false,
  saveError = null,
  lastSavedAt,
  isEditMode = false,
  onOpenGeneralQuestions,
}: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Link to="/professor/dashboard/courses">
          <Button
            variant="ghost"
            className="text-slate-600 hover:text-slate-800"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
        {courseId && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/professor/dashboard/assessments?courseId=${courseId}`)}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Evaluaciones
            </Button>
            {onOpenGeneralQuestions && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenGeneralQuestions}
                className="flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                Preguntas Gral.
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-slate-800 mb-1">
            {courseName}
          </h1>
          <p className="text-sm lg:text-lg text-slate-600">
            Edita el contenido y configuración.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <SaveStatus
            hasUnsavedChanges={hasUnsavedChanges}
            isLoading={isSaving}
            error={saveError}
            lastSavedAt={lastSavedAt}
          />
          
          <Button
            onClick={onSave}
            isLoading={isSaving}
            disabled={isSaving}
            className="bg-green-500 hover:bg-green-600 whitespace-nowrap"
            size="md"
          >
            Guardar
          </Button>

          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
            <div className="flex items-center gap-1.5">
              <Eye
                className={`w-4 h-4 ${
                  !isEditMode ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-xs font-medium uppercase ${
                  !isEditMode ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                Ver
              </span>
            </div>
            <Switch
              id="edit-mode-toggle"
              checked={isEditMode}
              onChange={onToggleEdit}
            />
            <div className="flex items-center gap-1.5">
              <Edit
                className={`w-4 h-4 ${
                  isEditMode ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-xs font-medium uppercase ${
                  isEditMode ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                Edit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}