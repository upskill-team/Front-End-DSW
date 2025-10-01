import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import SaveStatus from './SaveStatus';
import { ArrowLeft, Edit } from 'lucide-react';

interface CourseHeaderProps {
  courseName: string;
  onSave: () => void;
  onToggleEdit: () => void;
  isSaving: boolean;
  hasUnsavedChanges?: boolean;
  saveError?: string | null;
  lastSavedAt?: Date;
}

export default function CourseHeader({
  courseName,
  onSave,
  onToggleEdit,
  isSaving,
  hasUnsavedChanges = false,
  saveError = null,
  lastSavedAt,
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
          <Button
            variant="outline"
            onClick={onToggleEdit}
            className="flex items-center gap-2"
          >
            Editar Contenido
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
