import { useState, useEffect } from 'react';
import { Link, /*useNavigate,*/ useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Label from '../../components/ui/Label'
import Textarea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch'
import { Dialog, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import {
  BookOpen,
  Plus,
  Edit,
  Settings,
  ArrowLeft,
  GripVertical,
} from 'lucide-react';
import UnitEditor from '../../components/landing/UnitEditor.tsx';
import { useProfessorCourses } from '../../hooks/useCourses.ts'

const initialUnits = [
  {
    unitNumber: 1,
    name: 'Unidad 1: Introducción',
    description: 'Conceptos básicos e iniciales.',
    detail: 'Este es el contenido de la primera unidad...',
    activities: [],
    materials: [],
  },
];

type Unit = typeof initialUnits[0];



// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.

export default function ProfessorCourseEditorPage() {
  const { courseId } = useParams();
  //const { courseName } = useParams()

  const { data: courses, isLoading: isLoadingCourses } = useProfessorCourses()

  // Estado del curso (debería venir de tu API)
  const [courseConfig, setCourseConfig] = useState({
    name: '',
    description: '',
    status: 'en-desarrollo',
    isFree: false,
    price: 0,
  });

  useEffect(() => {
    if (courses && courseId) {
      const currentCourse = courses.find(course => course.id === courseId);
      if (currentCourse) {
        setCourseConfig({
          name: currentCourse.name,
          description: currentCourse.description,
          status: 'en-desarrollo',
          isFree: currentCourse.isFree,
          price: currentCourse.price,
        });
      }
    }
  }, [courses, courseId])

  // Estado de las unidades (debería venir de tu API)
  const [units, setUnits] = useState(initialUnits)

  // Estado de si el editor es editable o solo lectura
  const [editable, setEditable] = useState(true);

  const [draggedUnit, setDraggedUnit] = useState<Unit | null>(null);

  // Estados de los modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  //const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  //const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState(1);

  // Estados de los formularios
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitDescription, setNewUnitDescription] = useState('');

  /*const [newActivity, setNewActivity] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });*/

  const handleDragStart = (e: React.DragEvent, unit: Unit) => {
    setDraggedUnit(unit);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetUnit: Unit) => {
    e.preventDefault();
    if (draggedUnit && draggedUnit.unitNumber !== targetUnit.unitNumber) {
      const draggedIndex = units.findIndex((u) => u.unitNumber === draggedUnit.unitNumber);
      const targetIndex = units.findIndex((u) => u.unitNumber === targetUnit.unitNumber);
      const newUnits = [...units];
      const [removed] = newUnits.splice(draggedIndex, 1);
      newUnits.splice(targetIndex, 0, removed);
      setUnits(newUnits);
    }
    setDraggedUnit(null);
  };

  const handleCloseUnitModal = () => {
    setIsUnitModalOpen(false);
    setEditingUnit(null);
    setNewUnitName('');
    setNewUnitDescription('');
  };

  // Nueva función para abrir el modal en modo "Crear"
  const handleOpenCreateUnitModal = () => {
    setEditingUnit(null); // Aseguramos que no esté en modo edición
    setNewUnitName('');
    setNewUnitDescription('');
    setIsUnitModalOpen(true);
  };

  const handleAddOrUpdateUnit = () => {
    if (editingUnit) {
      // Lógica de actualización (usar mutación)
      setUnits(
        units.map((u) =>
          u.unitNumber === editingUnit.unitNumber
            ? { ...u, name: newUnitName, description: newUnitDescription }
            : u
        )
      );
    } else {
      // Lógica de creación (usar mutación)
      const newUnit = {
        unitNumber: units.length + 1,
        name: newUnitName,
        description: newUnitDescription,
        detail: '',
        activities: [],
        materials: [],
      };
      setUnits([...units, newUnit]);
    }
    // La lógica de limpieza ahora está en handleCloseUnitModal
    handleCloseUnitModal();
  }

  const handleEditUnitClick = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnitName(unit.name);
    setNewUnitDescription(unit.description);
    setIsUnitModalOpen(true);
  };

  const handleContentChange = (newContent: string) => {
    setUnits(
      units.map((unit) =>
        unit.unitNumber === selectedUnitId ? { ...unit, content: newContent } : unit
      )
    );
  };

  const handleSaveCourseConfig = () => {
    console.log('Guardando configuración:', courseConfig);
    setIsConfigModalOpen(false);
  }
  
  const selectedUnit = units.find((u) => u.unitNumber === selectedUnitId);

  if (isLoadingCourses) {
    return <p>Cargando información del curso...</p>;
  }

  if (!isLoadingCourses && !courses?.find(c => c.id === courseId)) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Curso no encontrado</h1>
        <p>El curso que intentas editar no existe o no tienes permiso para verlo.</p>
        <Link to="/professor/dashboard/courses">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Cursos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
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
              {courseConfig.name}
            </h1>
            <p className="text-lg text-slate-600">
              Edita el contenido, las actividades y la configuración de tu curso.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setEditable(!editable)}>
              Editar Contenido
              <Edit className="w-4 h-4 flex items-right" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Unidades */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Contenido del Curso</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-slate-800">Unidades</h3>
                <Button size="sm" variant="ghost" onClick={() => setIsUnitModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {units.map((unit) => (
                  <div
                    key={unit.unitNumber}
                    draggable
                    onDragStart={(e) => handleDragStart(e, unit)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, unit)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUnitId === unit.unitNumber
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedUnitId(unit.unitNumber)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-slate-800">
                            {unit.name}
                          </h4>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditUnitClick(unit);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
                onClick={() => setIsConfigModalOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración del curso
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal - Editor de Unidad */}
        <div className="lg:col-span-3">
          {selectedUnit && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>{selectedUnit.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {selectedUnit.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>

                  <UnitEditor editable={editable}/>
                  {/*<div className="space-y-4">
                    <Textarea
                      id="unit-content"
                      label="Contenido de la unidad (soporta Markdown)"
                      value={selectedUnit.detail}
                      onChange={(e) => handleContentChange(e.target.value)} 
                      placeholder='Escribe aquí el contenido de tu unidad'
                      rows={10}
                    />
                    <div className="flex items-center justify-end pt-4 border-t gap-2">
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => alert('Funcionalidad de "Crear Actividad" pendiente.')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Actividad
                      </Button>
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => alert('Funcionalidad de "Subir Material" pendiente.')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Material
                      </Button>
                    </div>
                  </div>*/}
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Actividades de la Unidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUnit.activities.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-8">
                        No hay actividades.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {/* Mapear actividades aquí */}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Material de la Unidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedUnit.materials.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-8">
                        No hay materiales.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {/* Mapear materiales aquí */}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* --- DIALOGS / MODALS --- */}
      
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogHeader>
          <DialogTitle>Configuración del Curso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            id="course-name-config"
            label="Nombre del curso"
            value={courseConfig.name}
            onChange={(e) =>
              setCourseConfig({ ...courseConfig, name: e.target.value })
            }
          />
          <Select
            id="course-status"
            label="Estado del curso"
            value={courseConfig.status}
            onChange={(e) =>
              setCourseConfig({ ...courseConfig, status: e.target.value })
            }
          >
            <option value="en-desarrollo">En desarrollo</option>
            <option value="revision">En revisión</option>
            <option value="publicado">Publicado</option>
            <option value="pausado">Pausado</option>
          </Select>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is-free">Curso gratuito</Label>
              <Switch
                id="is-free"
                checked={courseConfig.isFree}
                onChange={(e) =>
                  setCourseConfig((prev) => ({ ...prev, isFree: e.target.checked }))
                }
              />
            </div>

            {!courseConfig.isFree && (
              <div className="space-y-2">
                <Input
                  id="course-price"
                  label="Precio del curso (ARS)"
                  type="number"
                  value={courseConfig.price}
                  onChange={(e) =>
                    setCourseConfig((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  placeholder="99"
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsConfigModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSaveCourseConfig}>Guardar cambios</Button>
        </div>
      </Dialog>
      
      <Dialog open={isUnitModalOpen} onOpenChange={(isOpen) => !isOpen && handleCloseUnitModal()}>
        <DialogHeader>
          <DialogTitle>{editingUnit ? 'Editar Unidad' : 'Nueva Unidad'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            id="unit-name"
            label="Nombre de la unidad"
            placeholder="Unidad 2: Conceptos básicos"
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
          />
          <Textarea
            id="unit-description"
            label="Descripción"
            placeholder="En esta unidad se tratará..."
            value={newUnitDescription}
            onChange={(e) => setNewUnitDescription(e.target.value)}
          />
        </div>
        <div className='flex justify-end gap-2'>
            {/* MODIFICADO: El botón de cancelar ahora también usa la nueva función */}
            <Button variant="outline" onClick={handleCloseUnitModal}>Cancelar</Button>
            <Button onClick={handleAddOrUpdateUnit}>{editingUnit ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </Dialog>

    </div>
  );
}