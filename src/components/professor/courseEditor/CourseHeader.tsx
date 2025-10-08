import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import SaveStatus from './SaveStatus';
import Switch from '../../ui/Switch';
import { ArrowLeft, Edit, Eye } from 'lucide-react';

interface CourseHeaderProps {
  courseName: string;
  onSave: () => void;
  onToggleEdit: () => void;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  saveError?: string | null;
  lastSavedAt?: Date;
  isEditMode?: boolean;
}

export default function CourseHeader({
  courseName,
  onSave,
  onToggleEdit,
  isSaving,
  hasUnsavedChanges = false,
  saveError = null,
  lastSavedAt,
  isEditMode = false,
}: CourseHeaderProps) {
  return (
    <div className="mb-8">
      <Link to="/professor/dashboard/courses">
        <Button
          variant="ghost"
          className="mb-4 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Cursos
        </Button>
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
            {courseName}
          </h1>
          <p className="text-lg text-slate-600">
            Edita el contenido, las actividades y la configuración de tu curso.
          </p>
        </div>

        <div className="flex items-center space-x-3">
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
            className="bg-green-500 hover:bg-green-600"
          >
            Guardar Cambios
          </Button>

          <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-4 py-2 border border-slate-200">
            <div className="flex items-center gap-2">
              <Eye
                className={`w-4 h-4 ${
                  !isEditMode ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
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
            <div className="flex items-center gap-2">
              <Edit
                className={`w-4 h-4 ${
                  isEditMode ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isEditMode ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                Editar
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
