import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProfessorCourses } from "../../hooks/useCourses";
import { useCreateUnit, useUpdateUnit, useDeleteUnit } from "../../hooks/useUnits";
import { useUploadMaterial, useDeleteMaterial } from "../../hooks/useMaterials";
import { useQuickSave } from "../../hooks/useQuickSave";
import CourseHeader from "../../components/professor/courseEditor/CourseHeader";
import CourseSidebar from "../../components/professor/courseEditor/CourseSidebar";
import UnitContent from "../../components/professor/courseEditor/UnitContent";
import CourseConfigModal from "../../components/professor/courseEditor/modals/CourseConfigModal";
import UnitModal from "../../components/professor/courseEditor/modals/UnitModal";
import ProfessorCourseActivityEdition from "./ProfessorCourseActivityEdition";
import UnitModalUpload from "../../components/landing/professorCourseEdition/UnitModalUpload";
import type { Block } from "@blocknote/core";
import type { Unit, UnitEditorData } from "../../types/entities";

export default function ProfessorCourseEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();

  // Hooks para datos del backend
  const { data: courses, isLoading: isLoadingCourses } = useProfessorCourses();
  const createUnitMutation = useCreateUnit();
  const updateUnitMutation = useUpdateUnit();
  const deleteUnitMutation = useDeleteUnit();
  // const reorderUnitsMutation = useReorderUnits(); // TODO: Implementar reordenamiento
  const uploadMaterialMutation = useUploadMaterial();
  const deleteMaterialMutation = useDeleteMaterial();
  const quickSaveMutation = useQuickSave();

  // Estados principales
  const [courseConfig, setCourseConfig] = useState({
    name: "",
    description: "",
    status: "en-desarrollo",
    isFree: false,
    price: 0,
  });
  const [units, setUnits] = useState<UnitEditorData[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [editable, setEditable] = useState(true);

  // Estados para feedback de guardado
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Estados para modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Estados para formularios
  const [tempConfig, setTempConfig] = useState(courseConfig);
  const [, setNewImageFile] = useState<File | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitDescription, setNewUnitDescription] = useState("");
  const [stagedMaterials, setStagedMaterials] = useState<{ id: number | string; name: string; file?: File; url?: string; }[]>([]);
  const [newActivity, setNewActivity] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  // Estados para drag & drop
  const [draggedUnit, setDraggedUnit] = useState<UnitEditorData | null>(null);

  const selectedUnit = units.find((u) => u.unitNumber === selectedUnitId);

  // Cargar datos del curso desde el backend
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

        // Convertir unidades del backend a formato del editor
        const unitsFromBackend: UnitEditorData[] = (currentCourse.units || []).map(unitBackend => ({
          unitNumber: unitBackend.unitNumber,
          name: unitBackend.name,
          detail: unitBackend.detail,
          questions: unitBackend.questions,
          materials: unitBackend.materials,
          // Compatibilidad temporal - convertir questions a activities
          activities: [], // Se poblará después
        }));

        setUnits(unitsFromBackend);

        if (unitsFromBackend.length > 0) {
          setSelectedUnitId(unitsFromBackend[0].unitNumber);
        }
      }
    }
  }, [courses, courseId]);

  // Handlers para unidades
  const handleCreateUnit = () => {
    if (!courseId) return;

    const data = {
      name: newUnitName,
      detail: `<h1>${newUnitName}</h1><p></p>`,
    };

    createUnitMutation.mutate(
      { courseId, data },
      {
        onSuccess: () => {
          handleCloseUnitModal();
        },
      }
    );
  };

  const handleUpdateUnit = () => {
    if (!courseId || !editingUnit) return;

    const data = {
      name: newUnitName,
      detail: editingUnit.detail, // Mantener el detalle actual
    };

    updateUnitMutation.mutate(
      { courseId, unitNumber: editingUnit.unitNumber, data },
      {
        onSuccess: () => {
          handleCloseUnitModal();
        },
      }
    );
  };

  const handleDeleteUnit = (unitNumber: number) => {
    if (!courseId) return;

    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta unidad? Esta acción no se puede deshacer."
    );

    if (isConfirmed) {
      deleteUnitMutation.mutate({ courseId, unitNumber });
      
      if (selectedUnitId === unitNumber) {
        const remainingUnits = units.filter(u => u.unitNumber !== unitNumber);
        setSelectedUnitId(remainingUnits.length > 0 ? remainingUnits[0].unitNumber : null);
      }
    }
  };

  const handleUnitDetailChange = (newBlocks: Block[]) => {
    if (!selectedUnitId || !courseId) return;

    const newDetailJson = JSON.stringify(newBlocks);

    // Actualizar estado local inmediatamente (optimistic update)
    setUnits((currentUnits) =>
      currentUnits.map((unit) =>
        unit.unitNumber === selectedUnitId
          ? { ...unit, detail: newDetailJson, hasUnsavedChanges: true, isLoading: false }
          : unit
      )
    );

    // Debounced save - guardar después de 1 segundo de inactividad
    const timeoutId = setTimeout(() => {
      quickSaveMutation.mutate({
        courseId,
        data: {
          type: 'unit-content',
          data: {
            unitNumber: selectedUnitId,
            detail: newDetailJson,
          },
        },
      }, {
        onSuccess: () => {
          // Marcar como guardado exitosamente
          setUnits((currentUnits) =>
            currentUnits.map((unit) =>
              unit.unitNumber === selectedUnitId
                ? { ...unit, hasUnsavedChanges: false }
                : unit
            )
          );
          setSaveError(null);
          setLastSavedAt(new Date());
        },
        onError: (error) => {
          // En caso de error, marcar para retry
          setUnits((currentUnits) =>
            currentUnits.map((unit) =>
              unit.unitNumber === selectedUnitId
                ? { ...unit, hasUnsavedChanges: true }
                : unit
            )
          );
          setSaveError(error.message || "Error desconocido");
        },
      });
    }, 1000);

    // Limpiar timeout anterior si hay cambios rápidos
    return () => clearTimeout(timeoutId);
  };

  // Handlers para materiales
  const handleUploadMaterial = () => {
    if (!courseId || !selectedUnitId || stagedMaterials.length === 0) return;

    stagedMaterials.forEach((material) => {
      if (material.file) {
        uploadMaterialMutation.mutate({
          courseId,
          unitNumber: selectedUnitId,
          file: material.file,
          title: material.name,
        });
      }
    });

    setStagedMaterials([]);
    setIsMaterialModalOpen(false);
  };

  const handleDeleteMaterial = (materialId: string | number) => {
    if (!courseId || !selectedUnitId) return;

    const isConfirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este material?"
    );

    if (isConfirmed) {
      // Convertir ID a índice si es necesario
      const materialIndex = typeof materialId === 'number' ? materialId : parseInt(materialId as string, 10);
      
      deleteMaterialMutation.mutate({
        courseId,
        unitNumber: selectedUnitId,
        materialIndex,
      });
    }
  };

  // Handlers para drag & drop
  const handleDragStart = (_e: React.DragEvent, unit: UnitEditorData) => {
    setDraggedUnit(unit);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetUnit: UnitEditorData) => {
    e.preventDefault();
    if (!draggedUnit || !courseId || draggedUnit.unitNumber === targetUnit.unitNumber) {
      setDraggedUnit(null);
      return;
    }

    // TODO: Implementar reordenamiento usando el nuevo endpoint
    const draggedIndex = units.findIndex(u => u.unitNumber === draggedUnit.unitNumber);
    const targetIndex = units.findIndex(u => u.unitNumber === targetUnit.unitNumber);
    
    const newUnits = [...units];
    const [removed] = newUnits.splice(draggedIndex, 1);
    newUnits.splice(targetIndex, 0, removed);
    
    setUnits(newUnits);
    setDraggedUnit(null);
  };

  // Handlers para modales
  const handleOpenConfigModal = () => {
    setTempConfig({ ...courseConfig });
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    setCourseConfig(tempConfig);
    setIsConfigModalOpen(false);
    
    // TODO: Implementar guardado de configuración usando quick-save
    if (courseId) {
      quickSaveMutation.mutate({
        courseId,
        data: {
          type: 'course-config',
          data: tempConfig,
        },
      });
    }
  };

  const handleOpenCreateUnitModal = () => {
    setEditingUnit(null);
    setNewUnitName("");
    setNewUnitDescription("");
    setIsUnitModalOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnitName(unit.name);
    setNewUnitDescription(""); // Backend no tiene description
    setIsUnitModalOpen(true);
  };

  const handleCloseUnitModal = () => {
    setIsUnitModalOpen(false);
    setEditingUnit(null);
    setNewUnitName("");
    setNewUnitDescription("");
  };

  const handleSaveUnit = () => {
    if (editingUnit) {
      handleUpdateUnit();
    } else {
      handleCreateUnit();
    }
  };

  // Handlers para archivo de imagen
  const handleImageChange = (file: File | null) => {
    setNewImageFile(file);
  };

  // Handler para guardado global (legacy - mantener por compatibilidad)
  const handleGlobalSave = () => {
    // Por ahora, mostrar mensaje indicando que se usa guardado automático
    alert("Los cambios se guardan automáticamente. No es necesario usar este botón.");
  };

  // Loading state
  if (isLoadingCourses) {
    return <p>Cargando información del curso...</p>;
  }

  // Error state
  if (!isLoadingCourses && !courses?.find((c) => c.id === courseId)) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Curso no encontrado</h1>
        <p>El curso que intentas editar no existe o no tienes permiso para verlo.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <CourseHeader
        courseName={courseConfig.name}
        onSave={handleGlobalSave}
        onToggleEdit={() => setEditable(!editable)}
        isSaving={quickSaveMutation.isPending}
        hasUnsavedChanges={units.some(unit => unit.hasUnsavedChanges)}
        saveError={saveError}
        lastSavedAt={lastSavedAt || undefined}
      />

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Unidades */}
        <div className="lg:col-span-1">
          <CourseSidebar
            units={units}
            selectedUnitId={selectedUnitId}
            onUnitSelect={setSelectedUnitId}
            onCreateUnit={handleOpenCreateUnitModal}
            onEditUnit={handleEditUnit}
            onDeleteUnit={handleDeleteUnit}
            onOpenConfig={handleOpenConfigModal}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-3">
          <UnitContent
            selectedUnit={selectedUnit || null}
            activities={selectedUnit?.activities || []}
            materials={selectedUnit?.materials || []}
            editable={editable}
            onUnitDetailChange={handleUnitDetailChange}
            onCreateActivity={() => setIsActivityModalOpen(true)}
            onUploadMaterial={() => setIsMaterialModalOpen(true)}
            onDeleteMaterial={handleDeleteMaterial}
            onCreateUnit={handleOpenCreateUnitModal}
          />
        </div>
      </div>

      {/* Modales */}
      <CourseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={tempConfig}
        onConfigChange={setTempConfig}
        onSave={handleSaveConfig}
        onImageChange={handleImageChange}
      />

      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={handleCloseUnitModal}
        editingUnit={editingUnit}
        unitName={newUnitName}
        unitDescription={newUnitDescription}
        onNameChange={setNewUnitName}
        onDescriptionChange={setNewUnitDescription}
        onSave={handleSaveUnit}
      />

      <ProfessorCourseActivityEdition
        isActivityModalOpen={isActivityModalOpen}
        setIsActivityModalOpen={setIsActivityModalOpen}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        handleAddActivity={() => {
          // TODO: Implementar creación de actividades usando nuevo endpoint
          setIsActivityModalOpen(false);
        }}
      />

      <UnitModalUpload
        isMaterialModalOpen={isMaterialModalOpen}
        setIsMaterialModalOpen={setIsMaterialModalOpen}
        stagedMaterials={stagedMaterials}
        setStagedMaterials={setStagedMaterials}
        handleFileSelect={(e) => {
          const files = e.target.files;
          if (files) {
            const newMaterials = Array.from(files).map((file) => ({
              id: Date.now() + Math.random(),
              name: file.name.replace(/\.[^/.]+$/, ""),
              url: "", // Se llenará después de subir
              file: file,
            }));
            setStagedMaterials((prev) => [...prev, ...newMaterials]);
          }
        }}
        handleRemoveStagedFile={(id) => {
          setStagedMaterials((prev) => prev.filter((m) => m.id !== id));
        }}
        handleTitleChange={(id, newTitle) => {
          setStagedMaterials((prev) =>
            prev.map((m) => (m.id === id ? { ...m, name: newTitle } : m))
          );
        }}
        handleAddMaterials={handleUploadMaterial}
      />
    </div>
  );
}