import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Textarea from "../../components/ui/TextArea";
import Select from "../../components/ui/Select";
import Switch from "../../components/ui/Switch";
import { Dialog, DialogHeader, DialogTitle } from "../../components/ui/Dialog";
import {
  BookOpen,
  Plus,
  Edit,
  Settings,
  ArrowLeft,
  GripVertical,
  Trash2,
  Upload,
  FileText,
  X,
  //Check,
} from "lucide-react";
import UnitEditor from "../../components/landing/UnitEditor.tsx";
import {
  useProfessorCourses,
  useUpdateCourse,
} from "../../hooks/useCourses.ts";
import type { Block } from "@blocknote/core";
import ProfessorCourseActivityEdition from "./ProfessorCourseActivityEdition.tsx";
import ActivityCard from "../../components/landing/ActivityCard.tsx";

const initialUnits = [
  {
    unitNumber: 1,
    name: "Unidad 1: Introducción",
    description: "Conceptos básicos e iniciales.",
    detail: JSON.stringify([
      { type: "heading", content: "Bienvenido a la Unidad 1" },
      {
        type: "paragraph",
        content: "Aquí puedes empezar a escribir el contenido...",
      },
    ]),
    activities: [] as Activity[],
    materials: [] as StagedMaterial[],
  },
];

type Unit = (typeof initialUnits)[0];

type StagedMaterial = {
  id: number;
  name: string;
  file: File;
};

type Activity = {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
};

// Uploads a file to tmpfiles.org and returns the URL to the uploaded file.

export default function ProfessorCourseEditorPage() {
  const { courseId } = useParams();

  const { data: courses, isLoading: isLoadingCourses } = useProfessorCourses();
  const { mutate: updateCourse, isPending: isUpdatingCourse } =
    useUpdateCourse();

  // Estado del curso (debería venir de tu API)
  const [courseConfig, setCourseConfig] = useState({
    name: "",
    description: "",
    status: "en-desarrollo",
    isFree: false,
    price: 0,
  });
  const [tempConfig, setTempConfig] = useState(courseConfig);

  // Estado de la nueva actividad
  const [newActivity, setNewActivity] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  // Estado de las unidades (debería venir de tu API)
  const [units, setUnits] = useState(initialUnits);

  // Estado de si el editor es editable o solo lectura
  const [editable, setEditable] = useState(true);

  const [draggedUnit, setDraggedUnit] = useState<Unit | null>(null);

  // Estados de los modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [stagedMaterials, setStagedMaterials] = useState<StagedMaterial[]>([])
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(1);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Estados de los formularios
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitDescription, setNewUnitDescription] = useState("");

  const selectedUnit = units.find((u) => u.unitNumber === selectedUnitId);

  // Manejadores -------------------------------------------

  const handleDragStart = (e: React.DragEvent, unit: Unit) => {
    setDraggedUnit(unit);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetUnit: Unit) => {
    e.preventDefault();
    if (draggedUnit && draggedUnit.unitNumber !== targetUnit.unitNumber) {
      const draggedIndex = units.findIndex(
        (u) => u.unitNumber === draggedUnit.unitNumber
      );
      const targetIndex = units.findIndex(
        (u) => u.unitNumber === targetUnit.unitNumber
      );
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
    setNewUnitName("");
    setNewUnitDescription("");
  };

  const handleOpenCreateUnitModal = () => {
    setEditingUnit(null);
    setNewUnitName("");
    setNewUnitDescription("");
    setIsUnitModalOpen(true);
  };

  const handleAddOrUpdateUnit = () => {
    if (editingUnit) {
      setUnits(
        units.map((u) =>
          u.unitNumber === editingUnit.unitNumber
            ? { ...u, name: newUnitName, description: newUnitDescription }
            : u
        )
      );
    } else {
      const newUnit = {
        unitNumber: units.length + 1,
        name: newUnitName,
        description: newUnitDescription,
        detail: JSON.stringify([
          { type: "heading", content: newUnitName },
          { type: "paragraph", content: "" },
        ]),
        activities: [],
        materials: [],
      };
      setUnits([...units, newUnit]);
    }
    handleCloseUnitModal();
  };

  const handleEditUnitClick = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnitName(unit.name);
    setNewUnitDescription(unit.description);
    setIsUnitModalOpen(true);
  };

  const handleDeleteUnit = (unitNumberToDelete: number) => {
    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta unidad? Esta acción no se puede deshacer."
    );

    if (isConfirmed) {
      const updatedUnits = units.filter(
        (unit) => unit.unitNumber !== unitNumberToDelete
      );
      setUnits(updatedUnits);

      if (selectedUnitId === unitNumberToDelete) {
        setSelectedUnitId(
          updatedUnits.length > 0 ? updatedUnits[0].unitNumber : null
        );
      }
    }
  };

  const handleUnitDetailChange = (newBlocks: Block[]) => {
    if (!selectedUnitId) return;

    const newDetailJson = JSON.stringify(newBlocks);

    setUnits((currentUnits) =>
      currentUnits.map((unit) =>
        unit.unitNumber === selectedUnitId
          ? { ...unit, detail: newDetailJson }
          : unit
      )
    );
  };

  const handleOpenConfigModal = () => {
    setTempConfig({ ...courseConfig })
    setIsConfigModalOpen(true)
  }

  const handleApplyConfigChanges = () => {
    setCourseConfig(tempConfig);
    setIsConfigModalOpen(false);
  }

  const handleGlobalSave = () => {
    if (!courseId) {
      alert("No se pudo encontrar el ID del curso.");
      return;
    }

    const payload = {
      name: courseConfig.name,
      description: courseConfig.description,
      isFree: courseConfig.isFree,
      price: courseConfig.isFree ? 0 : courseConfig.price,
      // Aquí incluirías también las unidades con su contenido
      // units: units,
    };

    updateCourse(
      { courseId, data: payload },
      {
        onSuccess: () => {
          alert("¡Curso guardado con éxito!")
        },
        onError: (error) => {
          console.error("Error al guardar el curso:", error)
          alert(`Error al guardar: ${error.message}`);
        },
      }
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validFiles = Array.from(files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length !== files.length) {
        alert(
          "Algunos archivos fueron descartados por tener un formato no permitido (solo PDF, DOCX, XLSX)."
        );
      }

      const newMaterials: StagedMaterial[] = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name.replace(/\.[^/.]+$/, "")
      }));
      
      setStagedMaterials(prev => [...prev, ...newMaterials]);
    }
  }

  const handleTitleChange = (id: number, newTitle: string) => {
    setStagedMaterials(prev =>
      prev.map(material =>
        material.id === id ? { ...material, name: newTitle } : material
      )
    )
  }

  const handleRemoveStagedFile = (idToRemove: number) => {
    setStagedMaterials(prev => prev.filter(material => material.id !== idToRemove))
  }

  const handleAddMaterials = () => {
    if (!selectedUnitId || stagedMaterials.length === 0) return;

    const newMaterials: StagedMaterial[] = stagedMaterials.map(material => ({
      id: material.id,
      name: material.name,
      file: material.file,
    }));

    setUnits(currentUnits =>
      currentUnits.map(unit =>
        unit.unitNumber === selectedUnitId
          ? { ...unit, materials: [...unit.materials, ...newMaterials] }
          : unit
      )
    );

    setStagedMaterials([]);
    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (materialIdToDelete: number) => {
    if (!selectedUnitId) return;

    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este material?"
    );
    if (isConfirmed) {
      setUnits((currentUnits) =>
        currentUnits.map((unit) =>
          unit.unitNumber === selectedUnitId
            ? {
                ...unit,
                materials: unit.materials.filter(
                  (m) => m.id !== materialIdToDelete
                ),
              }
            : unit
        )
      );
    }
  };

  const handleAddActivity = () => {
    if (
      newActivity.question.trim() &&
      newActivity.options.every((opt) => opt.trim())
    ) {
      const activity = {
        id: Date.now(),
        type: "multiple-choice",
        question: newActivity.question,
        options: newActivity.options,
        correctAnswer: newActivity.correctAnswer,
        createdAt: new Date().toISOString(),
      };

      setUnits(
        units.map((unit) =>
          unit.unitNumber === selectedUnitId
            ? { ...unit, activities: [...unit.activities, activity] }
            : unit
        )
      );

      setNewActivity({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      });
      setIsActivityModalOpen(!isActivityModalOpen);

      console.log(units);
    }
  };

  useEffect(() => {
    if (courses && courseId) {
      const currentCourse = courses.find((course) => course.id === courseId);
      if (currentCourse) {
        setCourseConfig({
          name: currentCourse.name,
          description: currentCourse.description,
          status: "en-desarrollo", // Este estado es local, no se envía al backend
          isFree: currentCourse.isFree,
          price: currentCourse.price,
        });
      }
    }
  }, [courses, courseId]);

  if (isLoadingCourses) {
    return <p>Cargando información del curso...</p>;
  }

  if (!isLoadingCourses && !courses?.find((c) => c.id === courseId)) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Curso no encontrado</h1>
        <p>
          El curso que intentas editar no existe o no tienes permiso para verlo.
        </p>
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
              Edita el contenido, las actividades y la configuración de tu
              curso.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleGlobalSave}
              isLoading={isUpdatingCourse}
              disabled={isUpdatingCourse}
              className="bg-green-500 hover:bg-green-600"
            >
              Guardar Cambios
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditable(!editable)}
              className="flex items-center gap-2"
            >
              Editar Contenido
              <Edit className="w-4 h-4" />
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsUnitModalOpen(true)}
                >
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
                        ? "bg-blue-50 border-blue-200"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                    onClick={() => setSelectedUnitId(unit.unitNumber)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <GripVertical className="w-4 h-4 text-slate-400 cursor-grab flex-shrink-0" />
                        <div className="flex-1 truncate">
                          <h4 className="font-medium text-sm text-slate-800 truncate">
                            {unit.name}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUnit(unit.unitNumber);
                          }}
                          className="h-6 w-6 p-0 text-slate-500 hover:bg-red-100 hover:text-red-600"
                          aria-label="Eliminar unidad"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditUnitClick(unit);
                          }}
                          className="h-6 w-6 p-1 text-slate-500 hover:bg-blue-100 hover:text-blue-600"
                          aria-label="Editar unidad"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
                onClick={handleOpenConfigModal}
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración del curso
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal - Editor de Unidad */}
        <div className="lg:col-span-3">
          {selectedUnit ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>{selectedUnit.name}</span>
                  </CardTitle>
                  <CardDescription>{selectedUnit.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <UnitEditor
                    editable={editable}
                    initialContent={selectedUnit.detail}
                    onChange={handleUnitDetailChange}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-end pt-4 gap-2">
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() =>
                          setIsActivityModalOpen(!isActivityModalOpen)
                        }
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Actividad
                      </Button>
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => setIsMaterialModalOpen(true)}
                      >
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
                        {units
                          .find((u) => u.unitNumber === selectedUnitId)
                          ?.activities.map((activity) => (
                            <ActivityCard activity={activity}  />
                          ))}
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
                        No hay materiales subidos.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedUnit.materials.map((material) => (
                          <div
                            key={material.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border"
                          >
                            <div className="flex items-center space-x-2 min-w-0">
                              <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <span className="text-sm text-slate-700 truncate">
                                {material.name}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-slate-500 hover:text-red-600"
                              onClick={() => handleDeleteMaterial(material.id)}
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
          ) : (
            <div className="text-center p-12 bg-slate-50 border rounded-lg h-full flex flex-col justify-center items-center">
              <BookOpen className="w-12 h-12 text-slate-400 mb-4" />
              <h3 className="text-slate-800 font-semibold text-xl">
                No hay unidades
              </h3>
              <p className="text-slate-600 mt-2">
                Crea tu primera unidad para empezar a añadir contenido.
              </p>
              <Button
                size="md"
                className="mt-4"
                onClick={handleOpenCreateUnitModal}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Unidad
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals / Dialogs --- */}

      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogHeader>
          <DialogTitle>Configuración del Curso</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            id="course-name-config"
            label="Nombre del curso"
            value={tempConfig.name}
            onChange={(e) =>
              setTempConfig({ ...tempConfig, name: e.target.value })
            }
          />
          <Textarea
            id="course-description-config"
            label="Descripción del curso"
            value={tempConfig.description}
            onChange={(e) =>
              setTempConfig({ ...tempConfig, description: e.target.value })
            }
          />
          <Select
            id="course-status"
            label="Estado del curso"
            value={tempConfig.status}
            onChange={(e) =>
              setTempConfig({ ...tempConfig, status: e.target.value })
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
                checked={tempConfig.isFree}
                onChange={(e) =>
                  setTempConfig((prev) => ({
                    ...prev,
                    isFree: e.target.checked,
                  }))
                }
              />
            </div>

            {!tempConfig.isFree && (
              <div className="space-y-2">
                <Input
                  id="course-price"
                  label="Precio del curso (ARS)"
                  type="number"
                  value={tempConfig.price}
                  onChange={(e) =>
                    setTempConfig((prev) => ({
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
          <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleApplyConfigChanges}
          >
            Guardar cambios
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={isUnitModalOpen}
        onOpenChange={(isOpen) => !isOpen && handleCloseUnitModal()}
      >
        <DialogHeader>
          <DialogTitle>
            {editingUnit ? "Editar Unidad" : "Nueva Unidad"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            id="unit-name"
            label="Nombre de la unidad"
            value={newUnitName}
            onChange={(e) => setNewUnitName(e.target.value)}
          />
          <Textarea
            id="unit-description"
            label="Descripción"
            value={newUnitDescription}
            onChange={(e) => setNewUnitDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCloseUnitModal}>
            Cancelar
          </Button>
          <Button onClick={handleAddOrUpdateUnit}>
            {editingUnit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </Dialog>

      <ProfessorCourseActivityEdition
        isActivityModalOpen={isActivityModalOpen}
        setIsActivityModalOpen={setIsActivityModalOpen}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        handleAddActivity={handleAddActivity}
      />

      <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
        <DialogHeader>
          <DialogTitle>Subir Materiales a la Unidad</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="material-files"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <p className="mb-2 text-sm text-slate-500">
                  <span className="font-semibold">Haz clic o arrastra</span>
                </p>
                <p className="text-xs text-slate-400">PDF, DOCX, XLSX</p>
              </div>
              <input
                id="material-files"
                type="file"
                className="hidden"
                multiple
                accept=".pdf,.docx,.xlsx"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {stagedMaterials.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">
                Archivos seleccionados:
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto p-1">
                {stagedMaterials.map((material) => (
                  <div key={material.id} className="space-y-2 p-3 rounded-lg bg-slate-100 border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm truncate font-medium text-slate-600 flex items-center gap-2">
                        <FileText size={14}/> {material.file.name}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-red-100"
                        onClick={() => handleRemoveStagedFile(material.id)}
                      >
                        <X className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                    <Input
                      id={`material-title-${material.id}`}
                      label="Título del material"
                      value={material.name}
                      onChange={(e) => handleTitleChange(material.id, e.target.value)}
                      placeholder="Dale un nombre al material"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsMaterialModalOpen(false);
              setStagedMaterials([]);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAddMaterials}
            disabled={stagedMaterials.length === 0}
          >
            Añadir {stagedMaterials.length > 0 ? `(${stagedMaterials.length})` : ""}{" "}
            Materiales
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
