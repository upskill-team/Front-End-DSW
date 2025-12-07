import { useState, useMemo } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button/Button';
import Input from '../../../ui/Input';
import { Building2, Search, Users, AlertCircle, Send } from 'lucide-react';
import type { Institution } from '../../../../types/entities';
import { useCreateJoinRequest } from '../../../../hooks/useJoinRequests';

interface JoinInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutions: Institution[];
}

export default function JoinInstitutionModal({
  isOpen,
  onClose,
  institutions,
}: JoinInstitutionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  const { mutate: createJoinRequest, isPending: isCreatingRequest } = useCreateJoinRequest();

  const filteredInstitutions = useMemo(() => {
    if (!Array.isArray(institutions)) return [];
    if (!searchQuery.trim()) return institutions;

    const query = searchQuery.toLowerCase();
    return institutions.filter(
      (inst) =>
        inst.name.toLowerCase().includes(query) ||
        inst.description.toLowerCase().includes(query) ||
        inst.aliases?.some((alias) => alias.toLowerCase().includes(query))
    );
  }, [institutions, searchQuery]);

  const handleSelectInstitution = (institution: Institution) => {
    setSelectedInstitution(institution);
  };

  const handleConfirmRequest = () => {
    if (!selectedInstitution) return;

    createJoinRequest(selectedInstitution.id, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error) => {
        alert(`Error al enviar la solicitud: ${error.message}`);
      },
    });
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedInstitution(null);
    onClose();
  };

  if (selectedInstitution) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Confirmar Solicitud">
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Enviar solicitud a esta institución?</p>
                <p>Se enviará una notificación al encargado. Deberás esperar su aprobación para formar parte de ella.</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 mb-1">{selectedInstitution.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{selectedInstitution.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500">{selectedInstitution.professors.length} profesores</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setSelectedInstitution(null)} disabled={isCreatingRequest}>
              Atrás
            </Button>
            <Button type="button" onClick={handleConfirmRequest} isLoading={isCreatingRequest} className="bg-blue-500 hover:bg-blue-600">
              <Send className="w-4 h-4 mr-2" />
              Enviar Solicitud
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Unirse a una Institución">
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Solicitar unirse a una institución</p>
              <p>Busca una institución y envía una solicitud. El encargado recibirá una notificación y podrá aprobar o rechazar tu petición.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar institución por nombre..."
            className="pl-10"
          />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {(filteredInstitutions || []).length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">{searchQuery ? 'No se encontraron instituciones' : 'No hay instituciones disponibles'}</p>
            </div>
          ) : (
            (filteredInstitutions || []).map((institution) => (
              <div key={institution.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 mb-1">{institution.name}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-2">{institution.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{institution.professors?.length || 0} profesores</span>
                        </div>
                        {institution.aliases && institution.aliases.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400">•</span>
                            <span>También: {institution.aliases.slice(0, 2).join(', ')}</span>
                            {institution.aliases.length > 2 && (
                              <span>+{institution.aliases.length - 2} más</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={() => handleSelectInstitution(institution)} className="flex-shrink-0">
                    Solicitar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}