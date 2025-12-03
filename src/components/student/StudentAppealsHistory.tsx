import { useState } from 'react';
import { Card } from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import Button from '../ui/Button';
import { Dialog, DialogHeader, DialogTitle } from '../ui/Dialog';
import { FileText, Calendar, Eye, GraduationCap, ExternalLink } from 'lucide-react';
import { useMyAppeals } from '../../hooks/useAppeals';
import type { Appeal } from '../../types/entities';
import DocumentViewer from '../ui/DocumentViewer';

export default function StudentAppealsHistory() {
  const { data: appeals, isLoading, isError } = useMyAppeals();
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [showDoc, setShowDoc] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-slate-500">Cargando historial...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-200">
        No se pudo cargar el historial de solicitudes.
      </div>
    );
  }

  if (!appeals || appeals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-700">Sin solicitudes</h3>
        <p className="text-slate-500 max-w-xs mt-2 text-sm">
          Aún no has enviado ninguna solicitud para convertirte en profesor.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {appeals.map((appeal) => (
          <Card key={appeal.id} className="overflow-hidden hover:shadow-md transition-shadow border border-slate-200">
            <div className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge status={appeal.state} />
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(appeal.date).toLocaleDateString('es-ES', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Especialización</p>
                  <h4 className="font-semibold text-slate-800 text-lg leading-tight">{appeal.expertise}</h4>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedAppeal(appeal)}
                className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAppeal} onOpenChange={() => setSelectedAppeal(null)}>
        {selectedAppeal && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <DialogTitle>Detalle de Solicitud</DialogTitle>
              <p className="text-sm text-slate-500 text-center mt-1">
                Enviada el {new Date(selectedAppeal.date).toLocaleDateString()}
              </p>
            </DialogHeader>

            <div className="space-y-6 py-2">
              <div className="flex justify-center py-2">
                <StatusBadge status={selectedAppeal.state} />
              </div>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-5">
                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Área de Especialización</h5>
                  <p className="text-slate-900 font-medium text-base">{selectedAppeal.expertise}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wide">Experiencia y Motivación</h5>
                  <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {selectedAppeal.experienceMotivation}
                  </div>
                </div>

                {selectedAppeal.documentUrl && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowDoc(selectedAppeal.documentUrl!)} 
                      className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver Documento Adjunto
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedAppeal(null)} className="w-full sm:w-auto">
                Cerrar
              </Button>
            </div>
          </>
        )}
      </Dialog>

      {showDoc && (
        <DocumentViewer url={showDoc} onClose={() => setShowDoc(null)} />
      )}
    </>
  );
}