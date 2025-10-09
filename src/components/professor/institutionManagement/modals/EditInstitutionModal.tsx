import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import Textarea from '../../../ui/TextArea';
import { Plus, X } from 'lucide-react';
import { useUpdateManagedInstitution } from '../../../../hooks/useInstitutionMutations';
import type { Institution } from '../../../../types/entities';

// Schema para la edición, que coincide con el del backend
const EditInstitutionSchema = v.object({
  description: v.pipe(
    v.string('La descripción es requerida.'),
    v.minLength(10, 'La descripción debe tener al menos 10 caracteres.'),
    v.maxLength(1000, 'La descripción no puede exceder 1000 caracteres.'),
    v.trim()
  ),
});

type EditInstitutionFormData = v.InferInput<typeof EditInstitutionSchema>;

interface EditInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution;
}

export default function EditInstitutionModal({ isOpen, onClose, institution }: EditInstitutionModalProps) {
  const { mutate: updateInstitution, isPending } = useUpdateManagedInstitution();
  
  const [aliases, setAliases] = useState<string[]>([]);
  const [currentAlias, setCurrentAlias] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditInstitutionFormData>({
    resolver: valibotResolver(EditInstitutionSchema),
  });

  // Pre-llenar el formulario cuando el modal se abre con datos de la institución
  useEffect(() => {
    if (institution) {
      reset({ description: institution.description });
      setAliases(institution.aliases || []);
    }
  }, [institution, isOpen, reset]); // Añadimos isOpen para resetear cada vez que se abre

  const handleAddAlias = () => {
    const trimmed = currentAlias.trim();
    if (trimmed && !aliases.includes(trimmed) && aliases.length < 10) {
      setAliases([...aliases, trimmed]);
      setCurrentAlias('');
    }
  };

  const handleRemoveAlias = (index: number) => {
    setAliases(aliases.filter((_, i) => i !== index));
  };

  const onSubmit = (data: EditInstitutionFormData) => {
    updateInstitution({ description: data.description, aliases }, {
      onSuccess: () => {
        onClose(); // La UI se actualizará automáticamente gracias a la invalidación de queries
      },
      onError: (error) => {
        alert(`Error al actualizar la institución: ${error.message}`);
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar "${institution.name}"`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Textarea
          id="description"
          label="Descripción"
          {...register('description')}
          rows={5}
          disabled={isPending}
          error={errors.description?.message}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Alias / Nombres Alternativos</label>
          <div className="flex gap-2">
            <Input
              value={currentAlias}
              onChange={(e) => setCurrentAlias(e.target.value)}
              placeholder="Agregar nuevo alias..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAlias())}
              disabled={isPending || aliases.length >= 10}
            />
            <Button type="button" onClick={handleAddAlias} disabled={!currentAlias.trim() || aliases.length >= 10 || isPending} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {aliases.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {aliases.map((alias, index) => (
                <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm border border-blue-200">
                  <span>{alias}</span>
                  <button type="button" onClick={() => handleRemoveAlias(index)} className="hover:bg-blue-200 rounded-full p-0.5" disabled={isPending}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
           <p className="text-xs text-slate-500">{aliases.length}/10 alias agregados</p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button type="submit" isLoading={isPending}>Guardar Cambios</Button>
        </div>
      </form>
    </Modal>
  );
}