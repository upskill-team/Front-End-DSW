import { /*Plus,*/ XIcon } from "lucide-react";
import Button from "../../components/ui/Button/Button.tsx";
import {
  Dialog,
  //DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog.tsx";
import Textarea from "../../components/ui/TextArea/TextArea.tsx";
import Input from "../../components/ui/Input/Input.tsx";
import Label from "../../components/ui/Label.tsx";

interface IActivity {
  question: string;
  options: string[];
  correctAnswer: number;
}

function ProfessorCourseActivityEdition({
  isActivityModalOpen,
  setIsActivityModalOpen,
  newActivity,
  setNewActivity,
  handleAddActivity,
}: {
  isActivityModalOpen: boolean;
  setIsActivityModalOpen: (open: boolean) => void;
  newActivity: IActivity;
  setNewActivity: (activity: IActivity) => void;
  handleAddActivity: () => void;
}) {
  return (
    <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
      <div
        data-slot="dialog-content"
        className={`fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] sm:max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-white p-6 shadow-lg`}
      >
        <button
          type="button"
          data-slot="dialog-close"
          className="absolute top-4 right-4 rounded opacity-70 hover:opacity-100 transition-opacity disabled:pointer-events-none"
          onClick={() => setIsActivityModalOpen(false)}
        >
          <XIcon className="w-4 h-4 text-gray-500" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle>Nueva Actividad - Opción Múltiple</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Textarea
              id="question"
              label="Pregunta"
              value={newActivity.question}
              onChange={(e) =>
                setNewActivity({ ...newActivity, question: e.target.value })
              }
              placeholder="Escribe tu pregunta aquí..."
              rows={3}
            />
          </div>
          <div className="grid gap-3">
            {<Label>Opciones de respuesta</Label>}
            {newActivity.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="correctAnswer" // Agrupa los radios
                  value={index.toString()}
                  checked={newActivity.correctAnswer === index}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      correctAnswer: Number.parseInt(e.target.value),
                    })
                  }
                  className="h-4 w-4 text-slate-900 focus:ring-slate-400"
                />
                <label htmlFor={`option-${index}`} className="cursor-pointer">
                  {/* Opcional: si quieres que el label sea clickeable para marcar el radio */}
                </label>

                <Input
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newActivity.options];
                    newOptions[index] = e.target.value;
                    setNewActivity({ ...newActivity, options: newOptions });
                  }}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1 p-4 border rounded-lg transition-all bg-slate-100/70 border-transparent 
                            focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white
                            resize-none text-sm placeholder:text-slate-500"
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsActivityModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleAddActivity}>Crear Actividad</Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default ProfessorCourseActivityEdition;
