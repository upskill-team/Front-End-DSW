import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import { Dialog, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import StatusBadge from '../../components/ui/StatusBadge/StatusBadge';
import DocumentViewer from '../../components/ui/DocumentViewer/DocumentViewer.tsx';
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
import type { Appeal } from '../../types/entities';
import { useAppeals, useUpdateAppealState } from '../../hooks/useAppeals.ts';
import type { SearchAppealsParams } from '../../types/shared.ts';
import { useDebounce } from '../../hooks/useDebounce.ts';
import { toast } from 'react-hot-toast';

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

const APPEALS_PER_PAGE = 5;

export default function ProfessorRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [processingAppealId, setProcessingAppealId] = useState<string | null>(
    null
  );

  const [selectedRequest, setSelectedRequest] = useState<Appeal | null>(null);
  const [documentUrlToShow, setDocumentUrlToShow] = useState<string | null>(
    null
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const filters: SearchAppealsParams = {
    q: debouncedSearchTerm || undefined,
    sortBy: 'date',
    sortOrder: sortOrder === 'newest' ? 'DESC' : 'ASC',
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: APPEALS_PER_PAGE,
    offset: (currentPage - 1) * APPEALS_PER_PAGE,
  };

  const { data, isLoading, error } = useAppeals(filters);
  const { mutate: updateAppeal } = useUpdateAppealState();

  const requests = data?.appeals || [];
  const totalRequests = data?.total || 0;
  const totalPages = Math.ceil(totalRequests / APPEALS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, sortOrder]);

  const handleStatusChange = (
    requestId: string,
    newStatus: 'accepted' | 'rejected'
  ) => {
    setProcessingAppealId(requestId);
    updateAppeal(
      { appealId: requestId, payload: { state: newStatus } },
      {
        onSuccess: () => {
          const message =
            newStatus === 'accepted'
              ? 'Solicitud aprobada correctamente.'
              : 'Solicitud rechazada correctamente.';
          toast.success(message);
          setProcessingAppealId(null);
        },
        onError: () => {
          toast.error(
            'Error al procesar la solicitud. Por favor, intenta nuevamente.'
          );
          setProcessingAppealId(null);
        },
      }
    );
  };

  if (isLoading && requests.length === 0)
    return <div className="text-center p-8">Cargando solicitudes...</div>;
  if (error)
    return <div className="text-center p-8 text-red-600">{error.message}</div>;

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
              <CardTitle>Solicitudes ({totalRequests})</CardTitle>
              <CardDescription>
                Lista de todas las solicitudes de profesores
              </CardDescription>
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
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
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
            {requests.map((request) => {
              const date = new Date(request.date);
              const formattedDate = !isNaN(date.getTime())
                ? date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Fecha inválida';
              const isProcessing = processingAppealId === request.id;

              return (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border border-slate-200 space-y-4"
                >
                  <div className="flex flex-col lg:flex-row justify-between lg:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-2">
                        <h3 className="font-semibold text-lg text-slate-800">
                          {request.user.name} {request.user.surname}
                        </h3>
                        <StatusBadge status={request.state} />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap text-sm text-slate-600 gap-x-4 gap-y-1 pl-1">
                        <span className="flex items-center gap-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          {request.user.mail}
                        </span>
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 flex-shrink-0" />
                          {request.expertise}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-2 w-full lg:w-auto">
                      <Button
                        variant="outline"
                        size="md"
                        onClick={() => setSelectedRequest(request)}
                        disabled={isProcessing}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Detalles
                      </Button>
                      {request.state === 'pending' &&
                        (isProcessing ? (
                          <div className="flex items-center justify-center gap-2 w-full lg:w-auto py-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm text-slate-600">
                              Procesando...
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-2 w-full">
                            <Button
                              size="md"
                              className="flex-1"
                              onClick={() =>
                                handleStatusChange(request.id, 'accepted')
                              }
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Aprobar
                            </Button>
                            <Button
                              variant="destructive"
                              size="md"
                              className="flex-1"
                              onClick={() =>
                                handleStatusChange(request.id, 'rejected')
                              }
                            >
                              <X className="w-4 h-4 mr-2" />
                              Rechazar
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {requests.length === 0 && !isLoading && (
            <p className="text-center text-slate-500 py-8">
              No se encontraron solicitudes con los filtros aplicados.
            </p>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isLoading}
              >
                Anterior
              </Button>
              <span className="text-sm text-slate-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || isLoading}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle>Detalles de la Solicitud</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {selectedRequest.user.name} {selectedRequest.user.surname}
                </h3>
                <p className="text-slate-600">{selectedRequest.user.mail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Área de Especialización
                </p>
                <p>{selectedRequest.expertise}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Experiencia y Motivación
                </p>
                <p className="text-sm leading-relaxed bg-slate-50 p-3 rounded-md">
                  {selectedRequest.experienceMotivation}
                </p>
              </div>
              {selectedRequest.documentUrl && (
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Documento Adjunto
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDocumentUrlToShow(selectedRequest.documentUrl!)
                    }
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium p-0"
                  >
                    Ver documento en pantalla{' '}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>

      {documentUrlToShow && (
        <DocumentViewer
          url={documentUrlToShow}
          onClose={() => setDocumentUrlToShow(null)}
        />
      )}
    </div>
  );
}
