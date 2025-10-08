import { useState, useEffect } from 'react';
import { useProfessorCourses } from '../../../hooks/useCourses';
import { questionService } from '../../../api/services/question.service';
import { useCreateQuestion } from '../../../hooks/useQuestions';
import Button from '../../ui/Button';
import { Card } from '../../ui/Card';
import Input from '../../ui/Input';
import QuestionForm from '../../common/QuestionForm';
import { X, Search, Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import type { Question } from '../../../types/entities';

interface QuestionSelectorProps {
  courseId: string;
  selectedQuestions: Question[];
  onSelect: (questions: Question[]) => void;
  onClose: () => void;
}

export default function QuestionSelector({
  courseId,
  selectedQuestions,
  onSelect,
  onClose,
}: QuestionSelectorProps) {
  const [tempSelected, setTempSelected] = useState<Question[]>(
    selectedQuestions
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: courses } = useProfessorCourses();

  useEffect(() => {
    const loadQuestions = async () => {
      if (!courseId || !courses) return;

      const course = courses.find((c) => c.id === courseId);
      if (!course || !course.units) {
        setIsLoading(false);
        return;
      }

      try {
        const questionsPromises = course.units.map((unit) =>
          questionService
            .getByUnit(courseId, unit.unitNumber)
            .catch(() => [] as Question[])
        );

        const questionsArrays = await Promise.all(questionsPromises);
        const flattenedQuestions = questionsArrays.flat();
        setAllQuestions(flattenedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [courseId, courses]);

  const filteredQuestions = allQuestions.filter((q) =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (questionId: string) => {
    return tempSelected.some((q) => q.id === questionId);
  };

  const toggleQuestion = (question: Question) => {
    if (isSelected(question.id!)) {
      setTempSelected(tempSelected.filter((q) => q.id !== question.id));
    } else {
      setTempSelected([...tempSelected, question]);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Seleccionar Preguntas</h2>
            <p className="text-gray-600 mt-1">
              {tempSelected.length} pregunta(s) seleccionada(s)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar preguntas..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Create New Question Button */}
          <div className="mb-4">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant={showCreateForm ? "outline" : undefined}
              className={`w-full flex items-center justify-center gap-2 ${
                showCreateForm 
                  ? 'border-red-300 text-red-700 hover:bg-red-50' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              {showCreateForm ? 'Cancelar' : 'Crear Nueva Pregunta'}
            </Button>
          </div>

          {/* Create Question Form */}
          {showCreateForm && (
            <CreateQuestionForm
              courseId={courseId}
              courses={courses}
              onQuestionCreated={(newQuestion) => {
                setAllQuestions([...allQuestions, newQuestion]);
                setTempSelected([...tempSelected, newQuestion]);
                setShowCreateForm(false);
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando preguntas...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No se encontraron preguntas</p>
              <p className="text-sm mt-1">
                {searchQuery
                  ? 'Intenta con otro término de búsqueda'
                  : 'Crea preguntas usando el botón de arriba'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((question) => {
                const selected = isSelected(question.id!);
                const isExpanded = expandedQuestionId === question.id;
                return (
                  <div
                    key={question.id}
                    className={`border rounded-lg transition-all ${
                      selected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div
                      onClick={() => toggleQuestion(question)}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center mt-0.5 ${
                            selected
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              Unidad {question.unitNumber}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                              {question.questionType}
                            </span>
                          </div>
                          <p className="text-gray-900 font-medium">
                            {question.questionText}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedQuestionId(isExpanded ? null : question.id!);
                          }}
                          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Options */}
                    {isExpanded && question.questionType === 'MultipleChoiceOption' && (
                      <div className="px-4 pb-4 border-t pt-3 mt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Opciones de respuesta:
                        </p>
                        <div className="space-y-2">
                          {question.payload.options.map((option: string, idx: number) => {
                            const isCorrect =
                              question.payload.correctAnswer === idx;
                            return (
                              <div
                                key={idx}
                                className={`p-2 rounded text-sm ${
                                  isCorrect
                                    ? 'bg-green-100 border border-green-300'
                                    : 'bg-gray-50 border border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-600">
                                    {String.fromCharCode(65 + idx)})
                                  </span>
                                  <span>{option}</span>
                                  {isCorrect && (
                                    <Check className="w-4 h-4 text-green-600 ml-auto" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            {filteredQuestions.length} pregunta(s) disponible(s)
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={tempSelected.length === 0}>
              Confirmar Selección ({tempSelected.length})
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface CreateQuestionFormProps {
  courseId: string;
  courses: Array<{
    id: string;
    units?: Array<{ unitNumber: number; name: string }>;
  }> | undefined;
  onQuestionCreated: (question: Question) => void;
  onCancel: () => void;
}

function CreateQuestionForm({
  courseId,
  courses,
  onQuestionCreated,
  onCancel,
}: CreateQuestionFormProps) {
  const createQuestionMutation = useCreateQuestion();
  const course = courses?.find((c) => c.id === courseId);

  const handleSave = async (question: Question) => {
    try {
      const newQuestion = await createQuestionMutation.mutateAsync({
        courseId,
        unitNumber: question.unitNumber || 1, // Si no hay unitNumber, asignar a unidad 1
        data: {
          questionText: question.questionText,
          questionType: question.questionType,
          payload: question.payload,
        },
      });

      onQuestionCreated(newQuestion);
      alert('Pregunta creada exitosamente');
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Error al crear la pregunta');
      throw error;
    }
  };

  return (
    <div className="mb-6">
      <QuestionForm
        showUnitSelector={true}
        availableUnits={course?.units || []}
        unitNumber={null}
        onSave={handleSave}
        onCancel={onCancel}
        saveButtonText="Crear Pregunta"
      />
    </div>
  );
}
