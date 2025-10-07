import Button from '../../ui/Button.tsx';
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/Dialog.tsx';
import Textarea from '../../ui/TextArea.tsx';
import Input from '../../ui/Input.tsx';
import Label from '../../ui/Label.tsx';
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
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.payload.options];
    newOptions[index] = value;
    onChange({
      ...question,
      payload: {
        ...question.payload,
        options: newOptions,
      },
    });
  };

  const handleCorrectAnswerChange = (index: number) => {
    onChange({
      ...question,
      payload: {
        ...question.payload,
        correctAnswer: index,
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div data-slot="dialog-content" className={`grid gap-4`}>
        <DialogHeader>
          <DialogTitle>
            {readonly
              ? 'Ver Pregunta'
              : question.id
              ? 'Editar Pregunta'
              : 'Nueva Pregunta'}{' '}
            - Opción Múltiple
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="question"
              label="Pregunta"
              value={question.questionText}
              onChange={(e) =>
                !readonly &&
                onChange({ ...question, questionText: e.target.value })
              }
              placeholder="Escribe tu pregunta aquí..."
              rows={3}
              disabled={readonly}
            />
          </div>
          <div className="grid gap-3">
            <Label>Opciones de respuesta</Label>
            {question.payload.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="correctAnswer"
                  value={index.toString()}
                  checked={question.payload.correctAnswer === index}
                  onChange={() => !readonly && handleCorrectAnswerChange(index)}
                  disabled={readonly}
                  className="h-4 w-4 text-slate-900 focus:ring-slate-400 disabled:opacity-50"
                />
                <label htmlFor={`option-${index}`} className="cursor-pointer">
                  {/* Opcional: si quieres que el label sea clickeable para marcar el radio */}
                </label>

                <Input
                  value={option}
                  onChange={(e) =>
                    !readonly && handleOptionChange(index, e.target.value)
                  }
                  placeholder={`Opción ${index + 1}`}
                  disabled={readonly}
                  className="flex-1 p-4 border rounded-lg transition-all bg-slate-100/70 border-transparent 
                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
                            resize-none text-sm placeholder:text-slate-500 disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {readonly ? 'Cerrar' : 'Cancelar'}
          </Button>
          {!readonly && (
            <Button onClick={onSave}>
              {question.id ? 'Actualizar Pregunta' : 'Crear Pregunta'}
            </Button>
          )}
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default QuestionEditor;
