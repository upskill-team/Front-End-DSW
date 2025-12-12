import { Dialog, DialogHeader, DialogTitle } from '../../../ui/Dialog';
import Input from '../../../ui/Input/Input';
import Label from '../../../ui/Label';
import Textarea from '../../../ui/TextArea/TextArea';
import Select from '../../../ui/Select';
import Switch from '../../../ui/Swtich/Switch';
import Button from '../../../ui/Button/Button';

interface CourseConfig {
  name: string;
  description: string;
  status: string;
  isFree: boolean;
  price: number;
}

interface CourseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CourseConfig;
  onConfigChange: (config: CourseConfig) => void;
  onSave: () => void;
  onImageChange: (file: File | null) => void;
}

export default function CourseConfigModal({
  isOpen,
  onClose,
  config,
  onConfigChange,
  onSave,
  onImageChange,
}: CourseConfigModalProps) {
  const handleInputChange = (
    field: keyof CourseConfig,
    value: string | number | boolean
  ) => {
    onConfigChange({
      ...config,
      [field]: value,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle>Configuración del Curso</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Input
          id="course-name-config"
          label="Nombre del curso"
          value={config.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        <Textarea
          id="course-description-config"
          label="Descripción del curso"
          value={config.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <Select
          id="course-status"
          label="Estado del curso"
          value={config.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="en-desarrollo">En desarrollo</option>
          <option value="publicado">Publicado</option>
        </Select>

        <div>
          <Label htmlFor="course-image">
            Cambiar imagen del curso (opcional)
          </Label>
          <Input
            id="course-image"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onImageChange(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="is-free">Curso gratuito</Label>
            <Switch
              id="is-free"
              checked={config.isFree}
              onChange={(e) => handleInputChange('isFree', e.target.checked)}
            />
          </div>

          {!config.isFree && (
            <div className="space-y-2">
              <Input
                id="course-price"
                label="Precio del curso (ARS)"
                type="number"
                value={config.price}
                onChange={(e) =>
                  handleInputChange('price', Number(e.target.value))
                }
                placeholder="99"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={onSave}>Guardar cambios</Button>
      </div>
    </Dialog>
  );
}
