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
} from "lucide-react";
import UnitEditor from "../../components/landing/UnitEditor.tsx";
import {
  useProfessorCourses,
  useUpdateCourse,
} from "../../hooks/useCourses.ts";
import type { Block } from "@blocknote/core";
import ProfessorCourseActivityEdition from "./ProfessorCourseActivityEdition.tsx";
import ActivityCard from "../../components/landing/professorCourseEdition/ActivityCard.tsx";
import UnitModalUpload from "../../components/landing/professorCourseEdition/UnitModalUpload.tsx";
import type { Question } from "../../types/entities.ts";

type Unit = {
  unitNumber: number;
  name: string;
  description: string; // Este campo parece no estar en el backend, lo mantendremos localmente.
  detail: string;
  activities: Activity[];
  materials: Material[];
}

type Material = {
  id: number | string;
  name: string;
  file?: File;
  url?: string; // URL only for uploaded files
}

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
  const [, setImagePreview] = useState<string | null>(null)
  const [tempConfig, setTempConfig] = useState(courseConfig)
  const [newImageFile, setNewImageFile] = useState<File | null>(null)

  // Estado de la nueva actividad
  const [newActivity, setNewActivity] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  // Estado de las unidades (debería venir de tu API)
  const [units, setUnits] = useState<Unit[]>([]);

  // Estado de si el editor es editable o solo lectura
  const [editable, setEditable] = useState(true);

  const [draggedUnit, setDraggedUnit] = useState<Unit | null>(null);

  // Estados de los modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [stagedMaterials, setStagedMaterials] = useState<Material[]>([]);
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
    setTempConfig({ ...courseConfig });
    setIsConfigModalOpen(true);
  };

  const handleApplyConfigChanges = () => {
    setCourseConfig(tempConfig);
    setIsConfigModalOpen(false);
  };

  const handleGlobalSave = () => {
  if (!courseId) {
    alert("No se pudo encontrar el ID del curso.");
    return;
  }

  const formData = new FormData();

  const courseDataForBackend = {
    name: courseConfig.name,
    description: courseConfig.description,
    status: courseConfig.status,
    price: courseConfig.isFree ? 0 : courseConfig.price,

    units: units.map(unit => {
        const materialsForBackend = unit.materials.map(material => {
          if (material.file) {
            return {
              title: material.name,
              url: material.file.name, // Placeholder
            };
          }
          return {
            title: material.name,
            url: material.url,
          };
        })

      const questionsForBackend = unit.activities.map(activity => ({
          questionText: activity.question,
          questionType: 'MultipleChoiceOption',
          payload: {
            options: activity.options,
            correctAnswer: activity.correctAnswer,
          },
      }))

      return {
        unitNumber: unit.unitNumber,
        name: unit.name,
        detail: unit.detail,
        materials: materialsForBackend,
        questions: questionsForBackend,
      };
    }),
  };

  if (newImageFile) {
    formData.append('image', newImageFile);
  }

  units.forEach(unit => {
    unit.materials.forEach(material => {
      if (material.file) {
        formData.append('materials', material.file);
      }
    });
  });

  formData.append('courseData', JSON.stringify(courseDataForBackend));

  updateCourse({ courseId, data: formData });
}

  // Add file handlers for materials
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

      const newMaterials: Material[] = validFiles.map((file) => ({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name.replace(/\.[^/.]+$/, ""),
      }));

      setStagedMaterials((prev) => [...prev, ...newMaterials]);
    }
  }; 

  const handleTitleChange = (id: number | string, newTitle: string) => { // <-- CAMBIO AQUÍ
    setStagedMaterials((prev) =>
      prev.map((material) =>
        material.id === id ? { ...material, name: newTitle } : material
      )
    );
  }

  const handleRemoveStagedFile = (idToRemove: number | string) => {
    setStagedMaterials((prev) =>
      prev.filter((material) => material.id !== idToRemove)
    );
  }

  /*
  * Adds the staged materials to the selected unit and clears the staged list.
  */
  const handleAddMaterials = () => {
    if (!selectedUnitId || stagedMaterials.length === 0) return;

    const newMaterials: Material[] = stagedMaterials.map((material) => ({
      id: material.id,
      name: material.name,
      file: material.file,
    }));

    setUnits((currentUnits) =>
      currentUnits.map((unit) =>
        unit.unitNumber === selectedUnitId
          ? { ...unit, materials: [...unit.materials, ...newMaterials] }
          : unit
      )
    );

    setStagedMaterials([]);
    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (materialIdToDelete: number | string) => {
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
          status: "en-desarrollo", // El estado es local del frontend por ahora
          isFree: currentCourse.isFree,
          price: currentCourse.price,
        });

        if (currentCourse.imageUrl) {
          setImagePreview(currentCourse.imageUrl);
        }

        const unitsFromBackend: Unit[] = (currentCourse.units || []).map(unitBackend => ({
          unitNumber: unitBackend.unitNumber,
          name: unitBackend.name,
          description: "Descripción de la unidad",
          detail: unitBackend.detail,
          materials: (unitBackend.materials || []).map(materialBackend => ({
            id: materialBackend.url,
            name: materialBackend.title,
            url: materialBackend.url,
            file: undefined
          })),
          activities: (unitBackend.questions || []).map((questionBackend: Question, index: number) => ({
            id: index,
            type: "multiple-choice",
            question: questionBackend.questionText,
            options: questionBackend.payload.options,
            correctAnswer: questionBackend.payload.correctAnswer as number,
            createdAt: new Date().toISOString()
          }))
        }));

        setUnits(unitsFromBackend);

        if (unitsFromBackend.length > 0) {
          setSelectedUnitId(unitsFromBackend[0].unitNumber);
        }
      }
    }
  }, [courses, courseId])

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
                            <ActivityCard activity={activity} />
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

          <div>
            <Label htmlFor="course-image">Cambiar imagen del curso (opcional)</Label>
            <Input
              id="course-image"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewImageFile(e.target.files[0]);
                }
              }}
            />
          </div>

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
          <Button onClick={handleApplyConfigChanges}>Guardar cambios</Button>
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

      <UnitModalUpload
        isMaterialModalOpen={isMaterialModalOpen}
        setIsMaterialModalOpen={setIsMaterialModalOpen}
        stagedMaterials={stagedMaterials}
        setStagedMaterials={setStagedMaterials}
        handleFileSelect={handleFileSelect}
        handleRemoveStagedFile={handleRemoveStagedFile}
        handleTitleChange={handleTitleChange}
        handleAddMaterials={handleAddMaterials}
      />
    </div>
  );
}
