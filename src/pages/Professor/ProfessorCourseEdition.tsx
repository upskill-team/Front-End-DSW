import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useProfessorCourses } from '../../hooks/useCourses';
import {
  useCreateUnit,
  useUpdateUnit,
  useDeleteUnit,
  useReorderUnits,
} from '../../hooks/useUnits';
import { useUploadMaterial, useDeleteMaterial } from '../../hooks/useMaterials';
import { useQuickSave } from '../../hooks/useQuickSave';
import {
  useQuestions,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
} from '../../hooks/useQuestions';
import CourseHeader from '../../components/professor/courseEditor/CourseHeader';
import CourseSidebar from '../../components/professor/courseEditor/CourseSidebar';
import UnitContent from '../../components/professor/courseEditor/UnitContent';
import CourseConfigModal from '../../components/professor/courseEditor/modals/CourseConfigModal';
import UnitModal from '../../components/professor/courseEditor/modals/UnitModal';
import QuestionEditor from '../../components/professor/courseEditor/QuestionEditor';
import UnitModalUpload from '../../components/landing/professorCourseEdition/UnitModalUpload';
import GeneralQuestionsManager from '../../components/professor/courseEditor/GeneralQuestionsManager';
import type { Block } from '@blocknote/core';
import type { Unit, UnitEditorData, Question } from '../../types/entities';
import { QuestionType } from '../../types/entities';

export default function ProfessorCourseEditorPage() {
  const { courseId } = useParams<{ courseId: string }>();

  // Hooks para datos del backend
  const { data: courses, isLoading: isLoadingCourses } = useProfessorCourses();
  const createUnitMutation = useCreateUnit();
  const updateUnitMutation = useUpdateUnit();
  const deleteUnitMutation = useDeleteUnit();
  const reorderUnitsMutation = useReorderUnits();
  const uploadMaterialMutation = useUploadMaterial();
  const deleteMaterialMutation = useDeleteMaterial();
  const quickSaveMutation = useQuickSave();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  // Estados principales
  const [courseConfig, setCourseConfig] = useState({
    name: '',
    description: '',
    status: 'en-desarrollo',
    isFree: false,
    price: 0,
  });
  const [units, setUnits] = useState<UnitEditorData[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [editable, setEditable] = useState(false);

  // Hook para preguntas de la unidad seleccionada
  const { data: questions = [] } = useQuestions(courseId || '', selectedUnitId);

  // Estados para feedback de guardado
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Refs para el debouncing mejorado
  const saveTimeoutRef = useRef<number | null>(null);
  const lastChangeRef = useRef<Date>(new Date());
  const previousUnitRef = useRef<number | null>(null);

  // Estados para modales
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isGeneralQuestionsOpen, setIsGeneralQuestionsOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>({
    questionText: '',
    questionType: QuestionType.MultipleChoiceOption,
    payload: {
      options: ['', '', '', ''],
      correctAnswer: 0,
    },
  });

  // Estados para formularios
  const [tempConfig, setTempConfig] = useState(courseConfig);
  const [, setNewImageFile] = useState<File | null>(null);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitDescription, setNewUnitDescription] = useState('');
  const [stagedMaterials, setStagedMaterials] = useState<
    { id: number | string; name: string; file?: File; url?: string }[]
  >([]);

  // Estados para drag & drop
  const [draggedUnit, setDraggedUnit] = useState<UnitEditorData | null>(null);

  const selectedUnit = units.find((u) => u.unitNumber === selectedUnitId);

  // Función para realizar el guardado
  const performSave = useCallback(
    (unitId: number, detailJson: string) => {
      if (!courseId) return;

      quickSaveMutation.mutate(
        {
          courseId,
          data: {
            type: 'unit-content',
            data: {
              unitNumber: unitId,
              detail: detailJson,
            },
          },
        },
        {
          onSuccess: () => {
            setUnits((currentUnits) =>
              currentUnits.map((unit) =>
                unit.unitNumber === unitId
                  ? { ...unit, hasUnsavedChanges: false }
                  : unit
              )
            );
            setSaveError(null);
            setLastSavedAt(new Date());
          },
          onError: (error) => {
            setUnits((currentUnits) =>
              currentUnits.map((unit) =>
                unit.unitNumber === unitId
                  ? { ...unit, hasUnsavedChanges: true }
                  : unit
              )
            );
            setSaveError(error.message || 'Error desconocido');
          },
        }
      );
    },
    [courseId, quickSaveMutation]
  );

  // Función para guardado manual
  const handleManualSave = useCallback(() => {
    if (!selectedUnitId || !courseId) {
      setSaveError('No hay unidad seleccionada para guardar');
      return;
    }

    const currentUnit = units.find((u) => u.unitNumber === selectedUnitId);
    if (currentUnit && currentUnit.hasUnsavedChanges) {
      performSave(selectedUnitId, currentUnit.detail);
    } else {
      // Si no hay cambios pendientes, actualiza el timestamp para mostrar feedback positivo
      setLastSavedAt(new Date());
      setSaveError(null);
    }
  }, [selectedUnitId, courseId, units, performSave]);

  // Cargar datos del curso desde el backend
  useEffect(() => {
    if (courses && courseId) {
      const currentCourse = courses.find((course) => course.id === courseId);
      if (currentCourse) {
        setCourseConfig({
          name: currentCourse.name,
          description: currentCourse.description,
          status: currentCourse.status || 'en-desarrollo',
          isFree: currentCourse.isFree,
          price: currentCourse.price,
        });

        // Convertir unidades del backend a formato del editor
        const unitsFromBackend: UnitEditorData[] = (
          currentCourse.units || []
        ).map((unitBackend) => ({
          unitNumber: unitBackend.unitNumber,
          name: unitBackend.name,
          description: unitBackend.description,
          detail: unitBackend.detail,
          questions: unitBackend.questions,
          materials: unitBackend.materials,
          // Las preguntas ahora se manejan directamente desde questions[]
        }));

        setUnits(unitsFromBackend);

        if (unitsFromBackend.length > 0) {
          setSelectedUnitId(unitsFromBackend[0].unitNumber);
        }
      }
    }
  }, [courses, courseId]);

  // Efecto para auto-guardar cuando cambias de unidad
  useEffect(() => {
    const currentUnitId = selectedUnitId;
    const previousUnitId = previousUnitRef.current;

    // Si cambió de unidad y hay una unidad anterior con cambios no guardados
    if (previousUnitId && previousUnitId !== currentUnitId && courseId) {
      const previousUnit = units.find((u) => u.unitNumber === previousUnitId);

      if (previousUnit && previousUnit.hasUnsavedChanges) {
        performSave(previousUnitId, previousUnit.detail);
      }
    }

    // Actualizar referencia de unidad anterior
    previousUnitRef.current = currentUnitId;
  }, [selectedUnitId, courseId, units, performSave]);

  // Efecto para auto-guardar antes de salir de la página
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const hasUnsavedChanges = units.some((unit) => unit.hasUnsavedChanges);

      if (hasUnsavedChanges) {
        // Intentar guardar rápidamente
        const unitWithChanges = units.find((unit) => unit.hasUnsavedChanges);
        if (unitWithChanges && courseId) {
          performSave(unitWithChanges.unitNumber, unitWithChanges.detail);
        }

        // Mostrar advertencia al usuario
        event.preventDefault();
        event.returnValue =
          '¿Estás seguro de que quieres salir? Hay cambios sin guardar.';
        return event.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [units, courseId, performSave]);

  // Handlers para unidades
  const handleCreateUnit = () => {
    if (!courseId || !courses) return;

    const currentCourse = courses.find((course) => course.id === courseId);
    if (!currentCourse) return;

    // Calcular el siguiente unitNumber
    const maxUnitNumber = Math.max(
      0,
      ...(currentCourse.units || []).map((u) => u.unitNumber)
    );
    const nextUnitNumber = maxUnitNumber + 1;

    const data = {
      name: newUnitName,
      description: newUnitDescription,
      detail: `<h1>${newUnitName}</h1><p>${newUnitDescription}</p>`,
      unitNumber: nextUnitNumber,
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

  // Handler para preguntas (crear o editar)
  const handleSaveQuestion = () => {
    if (!courseId || !selectedUnitId) return;

    const questionData = {
      questionText: newQuestion.questionText,
      questionType: newQuestion.questionType,
      payload: newQuestion.payload,
    };

    const isEditing = !!newQuestion.id;

    if (isEditing) {
      // Actualizar pregunta existente
      updateQuestionMutation.mutate(
        {
          courseId,
          unitNumber: selectedUnitId,
          questionId: newQuestion.id!,
          data: questionData,
        },
        {
          onSuccess: () => {
            setIsQuestionModalOpen(false);
            resetQuestionForm();
          },
          onError: (error) => {
            alert(`Error al actualizar pregunta: ${error.message}`);
          },
        }
      );
    } else {
      // Crear nueva pregunta
      createQuestionMutation.mutate(
        {
          courseId,
          unitNumber: selectedUnitId,
          data: questionData,
        },
        {
          onSuccess: () => {
            setIsQuestionModalOpen(false);
            resetQuestionForm();
          },
          onError: (error) => {
            alert(`Error al crear pregunta: ${error.message}`);
          },
        }
      );
    }
  };

  const resetQuestionForm = () => {
    setNewQuestion({
      questionText: '',
      questionType: QuestionType.MultipleChoiceOption,
      payload: {
        options: ['', '', '', ''],
        correctAnswer: 0,
      },
    });
  };

  // Handler para editar pregunta
  const handleEditQuestion = (question: Question) => {
    setNewQuestion({ ...question });
    setIsQuestionModalOpen(true);
  };

  // Handler para cerrar el modal de pregunta
  const handleCloseQuestionModal = () => {
    setIsQuestionModalOpen(false);
    resetQuestionForm();
  };

  // Handler para borrar pregunta
  const handleDeleteQuestion = (questionId: string) => {
    if (!courseId || !selectedUnitId) return;

    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      deleteQuestionMutation.mutate(
        {
          courseId,
          unitNumber: selectedUnitId,
          questionId,
        },
        {
          onSuccess: () => {
            console.log('Pregunta eliminada exitosamente');
          },
          onError: (error) => {
            alert(`Error al eliminar pregunta: ${error.message}`);
          },
        }
      );
    }
  };

  const handleUpdateUnit = () => {
    if (!courseId || !editingUnit) return;

    const data = {
      name: newUnitName,
      description: newUnitDescription,
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
      '¿Estás seguro de que quieres eliminar esta unidad? Esta acción no se puede deshacer.'
    );

    if (isConfirmed) {
      deleteUnitMutation.mutate({ courseId, unitNumber });

      if (selectedUnitId === unitNumber) {
        const remainingUnits = units.filter((u) => u.unitNumber !== unitNumber);
        setSelectedUnitId(
          remainingUnits.length > 0 ? remainingUnits[0].unitNumber : null
        );
      }
    }
  };

  const handleUnitDetailChange = (newBlocks: Block[]) => {
    if (!selectedUnitId || !courseId) return;

    const newDetailJson = JSON.stringify(newBlocks);
    lastChangeRef.current = new Date();

    // Actualizar estado local inmediatamente (optimistic update)
    setUnits((currentUnits) =>
      currentUnits.map((unit) =>
        unit.unitNumber === selectedUnitId
          ? {
              ...unit,
              detail: newDetailJson,
              hasUnsavedChanges: true,
              isLoading: false,
            }
          : unit
      )
    );

    // Limpiar timeout anterior
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce mejorado: guardar después de 5 segundos de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      performSave(selectedUnitId, newDetailJson);
    }, 5000);
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
      '¿Estás seguro de que quieres eliminar este material?'
    );

    if (isConfirmed) {
      // Convertir ID a índice si es necesario
      const materialIndex =
        typeof materialId === 'number'
          ? materialId
          : parseInt(materialId as string, 10);

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
    if (
      !draggedUnit ||
      !courseId ||
      draggedUnit.unitNumber === targetUnit.unitNumber
    ) {
      setDraggedUnit(null);
      return;
    }

    const draggedIndex = units.findIndex(
      (u) => u.unitNumber === draggedUnit.unitNumber
    );
    const targetIndex = units.findIndex(
      (u) => u.unitNumber === targetUnit.unitNumber
    );

    // Crear nuevo array reordenado
    const newUnits = [...units];
    const [removed] = newUnits.splice(draggedIndex, 1);
    newUnits.splice(targetIndex, 0, removed);

    // Reasignar unitNumbers basados en la posición (1, 2, 3, etc.)
    const unitsWithNewNumbers = newUnits.map((unit, index) => ({
      ...unit,
      unitNumber: index + 1,
    }));

    // Actualizar estado local inmediatamente
    setUnits(unitsWithNewNumbers);

    // Crear array de reordenamiento para el backend
    const reorderData = {
      units: unitsWithNewNumbers.map((unit, index) => ({
        unitNumber:
          units.find((u) => u.name === unit.name)?.unitNumber ||
          unit.unitNumber,
        newOrder: index + 1,
      })),
    };

    // Llamar al backend para persistir el reordenamiento
    reorderUnitsMutation.mutate(
      { courseId, data: reorderData },
      {
        onError: () => {
          // Si falla, revertir cambios
          setUnits(units);
        },
      }
    );

    setDraggedUnit(null);
  };

  // Handlers para modales
  const handleOpenConfigModal = () => {
    setTempConfig({ ...courseConfig });
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = () => {
    if (!courseId) return;

    console.log('Saving course config:', tempConfig);

    quickSaveMutation.mutate(
      {
        courseId,
        data: {
          type: 'course-config',
          data: tempConfig,
        },
      },
      {
        onSuccess: () => {
          setCourseConfig(tempConfig);
          setIsConfigModalOpen(false);
          setSaveError(null);
          setLastSavedAt(new Date());
        },
        onError: (error) => {
          setSaveError(error.message || 'Error al guardar configuración');
          alert('Error al guardar la configuración del curso');
        },
      }
    );
  };

  const handleOpenCreateUnitModal = () => {
    setEditingUnit(null);
    setNewUnitName('');
    setNewUnitDescription('');
    setIsUnitModalOpen(true);
  };

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit);
    setNewUnitName(unit.name);
    setNewUnitDescription(unit.description || '');; // Backend no tiene description
    setIsUnitModalOpen(true);
  };

  const handleCloseUnitModal = () => {
    setIsUnitModalOpen(false);
    setEditingUnit(null);
    setNewUnitName('');
    setNewUnitDescription('');
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
  const handleGlobalSave = handleManualSave;

  // Loading state
  if (isLoadingCourses) {
    return <p>Cargando información del curso...</p>;
  }

  // Error state
  if (!isLoadingCourses && !courses?.find((c) => c.id === courseId)) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Curso no encontrado</h1>
        <p>
          El curso que intentas editar no existe o no tienes permiso para verlo.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <CourseHeader
        courseId={courseId}
        courseName={courseConfig.name}
        onSave={handleGlobalSave}
        onToggleEdit={() => setEditable(!editable)}
        isSaving={quickSaveMutation.isPending}
        hasUnsavedChanges={units.some((unit) => unit.hasUnsavedChanges)}
        saveError={saveError}
        isEditMode={editable}
        lastSavedAt={lastSavedAt || undefined}
        onOpenGeneralQuestions={() => setIsGeneralQuestionsOpen(true)}
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
            questions={questions}
            materials={selectedUnit?.materials || []}
            editable={editable}
            onUnitDetailChange={handleUnitDetailChange}
            onCreateQuestion={() => setIsQuestionModalOpen(true)}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
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

      <QuestionEditor
        isOpen={isQuestionModalOpen}
        onClose={handleCloseQuestionModal}
        question={newQuestion}
        onChange={setNewQuestion}
        onSave={handleSaveQuestion}
        readonly={!editable}
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
              name: file.name.replace(/\.[^/.]+$/, ''),
              url: '', // Se llenará después de subir
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

      {courseId && (
        <GeneralQuestionsManager
          courseId={courseId}
          isOpen={isGeneralQuestionsOpen}
          onClose={() => setIsGeneralQuestionsOpen(false)}
        />
      )}
    </div>
  );
}
