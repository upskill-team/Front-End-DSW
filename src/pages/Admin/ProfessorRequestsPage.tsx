import { useState, useEffect, useMemo } from 'react';
import Button from '../../components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Dialog, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  Check,
  X,
  Mail,
  GraduationCap,
  FileText,
  Search,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { appealService } from '../../api/services/appeal.service';
import type { Appeal } from '../../types/entities';

const DocumentViewer = ({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
    onClick={onClose} 
  >
    <div
      className="relative w-11/12 h-5/6 max-w-5xl bg-white rounded-lg shadow-xl flex flex-col"
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="flex justify-between items-center p-3 border-b bg-slate-50 rounded-t-lg">
        <h3 className="font-semibold text-slate-700">Visor de Documento</h3>
        <button
          onClick={onClose} 
          className="p-1 rounded-full text-slate-500 hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <iframe
        src={url}
        title="Visor de Documento"
        className="w-full h-full border-0"
      />
    </div>
  </div>
);

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

export default function ProfessorRequestsPage() {
  const [requests, setRequests] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Appeal | null>(null);
  const [documentUrlToShow, setDocumentUrlToShow] = useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const data = await appealService.findAllAppeals();
        setRequests(data);
      } catch (err: unknown) {
        setError('No se pudieron cargar las solicitudes.');
        if (err instanceof Error) {
          console.error(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredAndSortedRequests = useMemo(() => {
    return requests
      .filter((req) => {
        const matchesSearch = `${req.user.name} ${req.user.surname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === 'all' || req.state === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [requests, searchTerm, sortOrder, statusFilter]);

  const handleStatusChange = async (
    requestId: string,
    newStatus: 'accepted' | 'rejected'
  ) => {
    const originalRequests = [...requests];
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, state: newStatus } : req
      )
    );
    try {
      await appealService.updateAppealState(requestId, { state: newStatus });
    } catch {
      setError('No se pudo actualizar la solicitud. Inténtalo de nuevo.');
      setRequests(originalRequests);
    }
  };

  if (isLoading)
    return <div className="text-center p-8">Cargando solicitudes...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Solicitudes de Profesores
        </h1>
        <p className="text-slate-600">
          Gestiona las solicitudes para convertirse en profesor
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <CardTitle>Solicitudes ({filteredAndSortedRequests.length})</CardTitle>
              <CardDescription>Lista de todas las solicitudes de profesores</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-2 w-full">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="flex-1 w-full px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">Todas</option>
                  <option value="pending">Pendientes</option>
                  <option value="accepted">Aceptadas</option>
                  <option value="rejected">Rechazadas</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="flex-1 w-full px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="newest">Más nuevas</option>
                  <option value="oldest">Más antiguas</option>
                </select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedRequests.map((request) => {
              const date = new Date(request.date);
              const formattedDate = !isNaN(date.getTime())
                ? date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Fecha inválida';

              return (
                <div key={request.id} className="p-4 rounded-lg border border-slate-200 space-y-4">
                  <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                        <h3 className="font-semibold text-lg text-slate-800">{request.user.name} {request.user.surname}</h3>
                        <StatusBadge status={request.state} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap text-sm text-slate-600 gap-x-4 gap-y-1 pl-1">
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4 flex-shrink-0" />{request.user.mail}</span>
                        <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 flex-shrink-0" />{request.expertise}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 flex-shrink-0" />{formattedDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-2 w-full lg:w-auto">
                      <Button variant="outline" className="w-full lg:w-auto" onClick={() => setSelectedRequest(request)}>
                        <FileText className="w-4 h-4 mr-2" />Detalles
                      </Button>
                      {request.state === 'pending' && (
                        <div className="flex gap-2 w-full">
                          <Button className="flex-1" onClick={() => handleStatusChange(request.id, 'accepted')}><Check className="w-4 h-4 mr-2" />Aprobar</Button>
                          <Button variant="destructive" className="flex-1" onClick={() => handleStatusChange(request.id, 'rejected')}><X className="w-4 h-4 mr-2" />Rechazar</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredAndSortedRequests.length === 0 && (
            <p className="text-center text-slate-500 py-8">No se encontraron solicitudes.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle>Detalles de la Solicitud</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedRequest.user.name} {selectedRequest.user.surname}</h3>
                <p className="text-slate-600">{selectedRequest.user.mail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Área de Especialización</p>
                <p>{selectedRequest.expertise}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Experiencia y Motivación</p>
                <p className="text-sm leading-relaxed bg-slate-50 p-3 rounded-md">{selectedRequest.experienceMotivation}</p>
              </div>
              {selectedRequest.documentUrl && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Documento Adjunto</p>
                  <button onClick={() => setDocumentUrlToShow(selectedRequest.documentUrl!)} className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium">
                    Ver documento en pantalla <ExternalLink className="w-3 h-3 ml-1" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>

      {documentUrlToShow && (
        <DocumentViewer url={documentUrlToShow} onClose={() => setDocumentUrlToShow(null)} />
      )}
    </div>
  );
}