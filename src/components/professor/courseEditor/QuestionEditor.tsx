import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from '../../ui/Dialog.tsx';
import QuestionForm from '../../common/QuestionForm';
import type { Question } from '../../../types/entities.ts';

interface QuestionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onChange: (question: Question) => void;
  onSave: () => void;
  readonly?: boolean;
}

function QuestionEditor({
  isOpen,
  onClose,
  question,
  onChange,
  onSave,
  readonly = false,
}: QuestionEditorProps) {
  const handleSave = async (updatedQuestion: Question) => {
    onChange(updatedQuestion);
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>
          {readonly
            ? 'Ver Pregunta'
            : question.id
            ? 'Editar Pregunta'
            : 'Nueva Pregunta'}
        </DialogTitle>
      </DialogHeader>
      <div className="py-2 max-h-[70vh] overflow-y-auto">
        <QuestionForm
          initialQuestion={question}
          unitNumber={question.unitNumber}
          showUnitSelector={false}
          onSave={handleSave}
          onCancel={onClose}
          readonly={readonly}
          saveButtonText={question.id ? 'Actualizar Pregunta' : 'Crear Pregunta'}
        />
      </div>
    </Dialog>
  );
}

export default QuestionEditor;
