import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/Card';
import Button from '../../ui/Button';
import { BookOpen, Plus, Upload, FileText, Trash2 } from 'lucide-react';
import UnitEditor from '../../landing/UnitEditor';
import ActivityCard from '../../landing/professorCourseEdition/ActivityCard';
import type { Block } from '@blocknote/core';
import type {
  UnitEditorData,
  Activity,
  Material,
} from '../../../types/entities';

interface UnitContentProps {
  selectedUnit: UnitEditorData | null;
  activities: Activity[];
  materials: Material[];
  editable: boolean;
  onUnitDetailChange: (newBlocks: Block[]) => void;
  onCreateActivity: () => void;
  onUploadMaterial: () => void;
  onDeleteMaterial: (materialId: string | number) => void;
  onCreateUnit: () => void;
}

export default function UnitContent({
  selectedUnit,
  activities,
  materials,
  editable,
  onUnitDetailChange,
  onCreateActivity,
  onUploadMaterial,
  onDeleteMaterial,
  onCreateUnit,
}: UnitContentProps) {
  if (!selectedUnit) {
    return (
      <div className="text-center p-12 bg-slate-50 border rounded-lg h-full flex flex-col justify-center items-center">
        <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-slate-800 font-semibold text-xl">
          No hay unidades
        </h3>
        <p className="text-slate-600 mt-2">
          Crea tu primera unidad para empezar a añadir contenido.
        </p>
        <Button size="md" className="mt-4" onClick={onCreateUnit}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Unidad
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>{selectedUnit.name}</span>
          </CardTitle>
          <CardDescription>Unidad {selectedUnit.unitNumber}</CardDescription>
        </CardHeader>
        <CardContent>
          <UnitEditor
            editable={editable}
            initialContent={selectedUnit.detail}
            onChange={onUnitDetailChange}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-end pt-4 gap-2">
              <Button size="md" variant="outline" onClick={onCreateActivity}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Actividad
              </Button>
              <Button size="md" variant="outline" onClick={onUploadMaterial}>
                <Upload className="w-4 h-4 mr-2" />
                Subir Material
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividades de la Unidad</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No hay actividades.
              </p>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Material de la Unidad</CardTitle>
          </CardHeader>
          <CardContent>
            {materials.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                No hay materiales subidos.
              </p>
            ) : (
              <div className="space-y-2">
                {materials.map((material, index) => (
                  <div
                    key={`${material.title}-${index}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 truncate">
                        {material.title}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-slate-500 hover:text-red-600"
                      onClick={() => onDeleteMaterial(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
