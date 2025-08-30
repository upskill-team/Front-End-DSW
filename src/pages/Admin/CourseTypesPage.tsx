import { useState, useMemo } from 'react';
import { Card, CardDescription, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Dialog, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/TextArea';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import type { CourseType } from '../../types/entities';
import { useCourseTypes, useCreateCourseType, useUpdateCourseType, useDeleteCourseType } from '../../hooks/useCourseTypes';

export default function CourseTypesPage() {
  const { data: courseTypes = [], isLoading, error } = useCourseTypes();
  const createMutation = useCreateCourseType();
  const updateMutation = useUpdateCourseType();
  const deleteMutation = useDeleteCourseType();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<Partial<CourseType>>({});
  const [formValues, setFormValues] = useState({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const openModalForCreate = () => {
    setCurrentType({});
    setFormValues({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (type: CourseType) => {
    setCurrentType(type);
    setFormValues({ name: type.name, description: type.description });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro? Esta acción eliminará el tipo de curso.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: formValues.name, description: formValues.description };

    if (currentType.id) {
      updateMutation.mutate({ id: currentType.id, data: payload }, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const filteredAndSortedTypes = useMemo(() => {
    return courseTypes
      .filter(type => 
        type.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [courseTypes, searchTerm, sortOrder]);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error.message}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Gestión de Tipos de Curso</h1>
          <p className="text-slate-600">Crea y administra las categorías de los cursos.</p>
        </div>
        <Button onClick={openModalForCreate} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Tipo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Tipos de Curso Existentes ({courseTypes.length})</CardTitle>
              <CardDescription>Lista de todas las categorías disponibles</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')} className="px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="asc">Ordenar A-Z</option>
                <option value="desc">Ordenar Z-A</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedTypes.map(type => (
              <div key={type.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:bg-slate-50/50">
                <div className="flex-1 mb-3 sm:mb-0">
                  <h3 className="font-semibold text-slate-800">{type.name}</h3>
                  <p className="text-sm text-slate-600">{type.description}</p>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <Button variant="outline" onClick={() => openModalForEdit(type)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(type.id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredAndSortedTypes.length === 0 && ( <p className="text-center text-slate-500 py-8">No se encontraron tipos de curso.</p> )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>{currentType.id ? 'Editar' : 'Crear'} Tipo de Curso</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
          <Input 
            id="name"
            label="Nombre del Tipo de Curso"
            value={formValues.name}
            onChange={e => setFormValues({...formValues, name: e.target.value})}
            placeholder="Ej: Programación"
            required
          />
          <Textarea
            id="description"
            label="Descripción"
            value={formValues.description}
            onChange={e => setFormValues({...formValues, description: e.target.value})}
            placeholder="Ej: Cursos relacionados con el desarrollo de software y la codificación."
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}