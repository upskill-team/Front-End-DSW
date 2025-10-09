import { useState } from 'react';
import { useAllCourseQuestions, useCreateGeneralQuestion } from '../../../hooks/useQuestions';
import Button from '../../ui/Button';
import { Card } from '../../ui/Card';
import QuestionForm from '../../common/QuestionForm';
import { HelpCircle, Plus, X } from 'lucide-react';
import type { Question } from '../../../types/entities';

interface GeneralQuestionsManagerProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GeneralQuestionsManager({
  courseId,
  isOpen,
  onClose,
}: GeneralQuestionsManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: allQuestions, isLoading } = useAllCourseQuestions(courseId);
  const createGeneralQuestionMutation = useCreateGeneralQuestion();

  const generalQuestions = allQuestions?.filter((q) => q.unitNumber === null) || [];

  const handleSave = async (question: Question) => {
    try {
      await createGeneralQuestionMutation.mutateAsync({
        courseId,
        data: {
          questionText: question.questionText,
          questionType: question.questionType,
          payload: question.payload,
        },
      });
      alert('Pregunta general creada exitosamente');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating general question:', error);
      alert('Error al crear la pregunta');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              Preguntas Generales del Curso
            </h2>
            <p className="text-gray-600 mt-1">
              Estas preguntas no están asociadas a ninguna unidad específica
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Pregunta General
            </Button>
          )}

          {showCreateForm && (
            <div className="mb-6 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Nueva Pregunta General</h3>
              <QuestionForm
                showUnitSelector={false}
                unitNumber={null}
                onSave={handleSave}
                onCancel={() => setShowCreateForm(false)}
                saveButtonText="Crear Pregunta"
              />
            </div>
          )}

          {isLoading && (
            <p className="text-center text-gray-500">Cargando preguntas...</p>
          )}

          {!isLoading && generalQuestions.length === 0 && !showCreateForm && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay preguntas generales creadas aún
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Estas preguntas se pueden usar en evaluaciones
              </p>
            </div>
          )}

          {!isLoading && generalQuestions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">
                Preguntas Existentes ({generalQuestions.length})
              </h3>
              {generalQuestions.map((question) => (
                <Card key={question.id} className="p-4 border-l-4 border-l-blue-500">
                  <p className="font-medium text-gray-900 mb-2">
                    {question.questionText}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Pregunta General
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50">
          <Button onClick={onClose} variant="outline" className="w-full">
            Cerrar
          </Button>
        </div>
      </Card>
    </div>
  );
}
