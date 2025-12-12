import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from '../../ui/Dialog/Dialog.tsx';
import QuestionForm from '../../common/QuestionForm';
import type { Question } from '../../../types/entities.ts';
import { useState } from 'react';

interface QuestionEditorProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  onChange: (question: Question) => void;
  onSave: (question: Question) => void;
  readonly?: boolean;
}

function QuestionEditor({
  isOpen,
  onClose,
  question,
  onSave,
  readonly = false,
}: QuestionEditorProps) {
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (updatedQuestion: Question) => {
    setIsPending(true);
    try {
      await onSave(updatedQuestion);
    } finally {
      setIsPending(false);
    }
  }

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
          isLoading={isPending}
          saveButtonText={question.id ? 'Actualizar Pregunta' : 'Crear Pregunta'}
        />
      </div>
    </Dialog>
  );
}

export default QuestionEditor;
