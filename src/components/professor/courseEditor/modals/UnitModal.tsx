import { Dialog, DialogHeader, DialogTitle } from '../../../ui/Dialog';
import Input from '../../../ui/Input';
import Textarea from '../../../ui/TextArea';
import Button from '../../../ui/Button';
import type { Unit } from '../../../../types/entities';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUnit: Unit | null;
  unitName: string;
  unitDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
}

export default function UnitModal({
  isOpen,
  onClose,
  editingUnit,
  unitName,
  unitDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
}: UnitModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>
          {editingUnit ? 'Editar Unidad' : 'Nueva Unidad'}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Input
          id="unit-name"
          label="Nombre de la unidad"
          value={unitName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <Textarea
          id="unit-description"
          label="Descripción"
          value={unitDescription}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Breve descripción de lo que se aprenderá en esta unidad..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>{editingUnit ? 'Actualizar' : 'Crear'}</Button>
      </div>
    </Dialog>
  );
}
