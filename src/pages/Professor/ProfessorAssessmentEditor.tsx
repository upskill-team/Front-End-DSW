import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfessorCourses } from '../../hooks/useCourses';
import {
  useAssessment,
  useCreateAssessment,
  useUpdateAssessment,
} from '../../hooks/useAssessments';
import Button from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';
import Label from '../../components/ui/Label';
import QuestionSelector from '../../components/professor/assessments/QuestionSelector';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import type {
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  Question,
} from '../../types/entities';
import { toast } from 'react-hot-toast';

export default function ProfessorAssessmentEditorPage() {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const isEditMode = !!assessmentId;

  const { data: courses, isLoading: isLoadingCourses } = useProfessorCourses();
  const { data: existingAssessment, isLoading: isLoadingAssessment } =
    useAssessment(assessmentId);
  const createMutation = useCreateAssessment();
  const updateMutation = useUpdateAssessment();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    courseId: '',
    durationMinutes: '',
    passingScore: '70',
    maxAttempts: '',
    isActive: true,
    availableFrom: '',
    availableUntil: '',
  });

  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  useEffect(() => {
    if (existingAssessment && isEditMode) {
      setFormData({
        title: existingAssessment.title,
        description: existingAssessment.description || '',
        courseId: existingAssessment.course.id,
        durationMinutes: existingAssessment.durationMinutes?.toString() || '',
        passingScore: existingAssessment.passingScore.toString(),
        maxAttempts: existingAssessment.maxAttempts?.toString() || '',
        isActive: existingAssessment.isActive,
        availableFrom: existingAssessment.availableFrom
          ? new Date(existingAssessment.availableFrom)
              .toISOString()
              .slice(0, 16)
          : '',
        availableUntil: existingAssessment.availableUntil
          ? new Date(existingAssessment.availableUntil)
              .toISOString()
              .slice(0, 16)
          : '',
      });
      setSelectedQuestions(existingAssessment.questions);
    }
  }, [existingAssessment, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseId) {
      alert('Por favor selecciona un curso');
      return;
    }

    if (selectedQuestions.length === 0) {
      alert('Por favor selecciona al menos una pregunta');
      return;
    }

    try {
      const questionIds = selectedQuestions.map((q) => q.id!);

      if (isEditMode && assessmentId) {
        const updateData: UpdateAssessmentRequest = {
          title: formData.title,
          description: formData.description || undefined,
          questionIds,
          durationMinutes: formData.durationMinutes
            ? parseInt(formData.durationMinutes)
            : null,
          passingScore: parseInt(formData.passingScore),
          maxAttempts: formData.maxAttempts
            ? parseInt(formData.maxAttempts)
            : null,
          isActive: formData.isActive,
          availableFrom: formData.availableFrom
            ? new Date(formData.availableFrom).toISOString()
            : undefined,
          availableUntil: formData.availableUntil
            ? new Date(formData.availableUntil).toISOString()
            : undefined,
        };

        await updateMutation.mutateAsync({ id: assessmentId, data: updateData });
        toast.success('Evaluación actualizada')
      } else {
        const createData: CreateAssessmentRequest = {
          title: formData.title,
          description: formData.description || undefined,
          courseId: formData.courseId,
          questionIds,
          durationMinutes: formData.durationMinutes
            ? parseInt(formData.durationMinutes)
            : undefined,
          passingScore: parseInt(formData.passingScore),
          maxAttempts: formData.maxAttempts
            ? parseInt(formData.maxAttempts)
            : undefined,
          isActive: formData.isActive,
          availableFrom: formData.availableFrom
            ? new Date(formData.availableFrom).toISOString()
            : undefined,
          availableUntil: formData.availableUntil
            ? new Date(formData.availableUntil).toISOString()
            : undefined,
        };

        await createMutation.mutateAsync(createData);
        toast.success('Evaluación creada exitosamente')
      }

      navigate('/professor/dashboard/assessments');
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast.error('Error al guardar la evaluación')
    }
  };

  if (isLoadingCourses || (isEditMode && isLoadingAssessment)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate('/professor/dashboard/assessments')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Editar Evaluación' : 'Nueva Evaluación'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Modifica los detalles de la evaluación'
              : 'Crea una nueva evaluación formal para tu curso'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Información Básica</h2>

          <div className="space-y-4">
            <Input
              label="Título de la Evaluación"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Ej: Examen Final de JavaScript"
            />

            <TextArea
              label="Descripción (opcional)"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Instrucciones y detalles sobre la evaluación"
              rows={3}
            />

            {!isEditMode && (
              <Select
                label="Curso"
                value={formData.courseId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                required
              >
                <option value="">Selecciona un curso</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Configuración</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Duración (minutos)"
              type="number"
              value={formData.durationMinutes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, durationMinutes: e.target.value })
              }
              placeholder="Dejar vacío para sin límite"
              min="1"
            />

            <Input
              label="Puntaje Mínimo (%)"
              type="number"
              value={formData.passingScore}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, passingScore: e.target.value })
              }
              required
              min="0"
              max="100"
            />

            <Input
              label="Máximo de Intentos"
              type="number"
              value={formData.maxAttempts}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, maxAttempts: e.target.value })
              }
              placeholder="Dejar vacío para ilimitado"
              min="1"
            />

            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <Label htmlFor="isActive">Evaluación Activa</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Disponibilidad</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Disponible Desde"
              type="datetime-local"
              value={formData.availableFrom}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, availableFrom: e.target.value })
              }
            />

            <Input
              label="Disponible Hasta"
              type="datetime-local"
              value={formData.availableUntil}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, availableUntil: e.target.value })
              }
            />
          </div>
        </Card>

        <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">
            Preguntas ({selectedQuestions.length})
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm" 
            onClick={() => setShowQuestionSelector(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {selectedQuestions.length === 0 ? 'Seleccionar' : 'Editar Selección'}
          </Button>
        </div>

        {selectedQuestions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            <p>No hay preguntas seleccionadas</p>
            <p className="text-sm mt-1">
              Haz clic en "Seleccionar" para agregar preguntas a la evaluación
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedQuestions.map((question, index) => (
              <div
                key={question.id}
                className="flex items-start justify-between p-3 sm:p-4 border rounded-lg bg-slate-50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-500">#{index + 1}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{question.questionType}</span>
                  </div>
                  <p className="text-gray-900 truncate">{question.questionText}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedQuestions(
                      selectedQuestions.filter((q) => q.id !== question.id)
                    );
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                  aria-label="Eliminar pregunta"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/professor/dashboard/assessments')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : isEditMode
              ? 'Guardar Cambios'
              : 'Crear Evaluación'}
          </Button>
        </div>
      </form>

      {showQuestionSelector && formData.courseId && (
        <QuestionSelector
          courseId={formData.courseId}
          selectedQuestions={selectedQuestions}
          onSelect={(questions: Question[]) => {
            setSelectedQuestions(questions);
            setShowQuestionSelector(false);
          }}
          onClose={() => setShowQuestionSelector(false)}
        />
      )}
    </div>
  );
}
