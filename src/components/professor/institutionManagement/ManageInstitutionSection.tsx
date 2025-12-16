import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card/Card';
import Button from '../../ui/Button/Button';
import {
  Users,
  UserMinus,
  AlertCircle,
  Crown,
  Inbox,
  Check,
  X,
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/Avatar/Avatar';
import type { Institution } from '../../../types/entities';
import { useRemoveProfessor } from '../../../hooks/useInstitutionMutations';
import {
  useGetPendingRequests,
  useProcessJoinRequest,
} from '../../../hooks/useJoinRequests';
import {
  getProfessorName,
  getProfessorEmail,
  getProfessorProfilePicture,
  getProfessorInitials,
} from '../../../lib/professor';

interface ManageInstitutionSectionProps {
  institution: Institution;
}

export default function ManageInstitutionSection({
  institution,
}: ManageInstitutionSectionProps) {
  const { mutate: removeProfessor, isPending: isRemoving } =
    useRemoveProfessor();
  const { data: pendingRequests = [], isLoading: isLoadingRequests } =
    useGetPendingRequests(institution.institutionId || institution.id || '');
  const { mutate: processRequest, isPending: isProcessingRequest } =
    useProcessJoinRequest();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessRequest = (
    requestId: string,
    action: 'accept' | 'reject'
  ) => {
    setProcessingId(requestId);
    processRequest(
      { requestId, action },
      {
        onSuccess: () => {
          // Silencioso en caso de éxito
        },
        onError: (error) => {
          alert(`Error al procesar la solicitud: ${error.message}`);
        },
        onSettled: () => {
          setProcessingId(null);
        },
      }
    );
  };

  const handleRemoveProfessor = (
    professorId: string,
    professorName: string
  ) => {
    if (
      confirm(
        `¿Estás seguro de que quieres remover a ${professorName} de la institución?`
      )
    ) {
      removeProfessor(
        { institutionId: institution.institutionId || institution.id || '', professorId },
        {
          onSuccess: () => {
            // Silencioso en caso de éxito
          },
          onError: (error) => {
            alert(`Error al remover profesor: ${error.message}`);
          },
        }
      );
    }
  };

  const allProfessors = institution.professors || [];
  const otherProfessors = allProfessors.filter(
    (prof) => prof && prof.id !== institution.manager?.id
  );

  return (
    <Card className="border-t-4 border-purple-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Users className="w-5 h-5 text-purple-600" />
          Panel de Gestión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-800">
              <p className="font-medium mb-1">Como encargado puedes:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-700">
                <li>Gestionar las solicitudes para unirse a tu institución.</li>
                <li>Remover miembros existentes (excepto a ti mismo).</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100 max-w-xs mx-auto">
          <p className="text-3xl font-bold text-green-600">
            {allProfessors.length}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Miembros en la Institución
          </p>
        </div>

        <div className="space-y-3 pt-6 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-slate-500" />
              Solicitudes Pendientes
            </h4>
            <span className="text-sm font-medium bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {isLoadingRequests ? (
              <p className="text-sm text-slate-500 text-center py-4">
                Cargando solicitudes...
              </p>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  No hay solicitudes pendientes.
                </p>
              </div>
            ) : (
              pendingRequests.map((req) => (
                <div key={req.id} className="p-3 border rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={getProfessorProfilePicture(req.professor)}
                          alt={getProfessorName(req.professor)}
                        />
                        <AvatarFallback className="bg-slate-400 text-white font-semibold">
                          {getProfessorInitials(req.professor)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {getProfessorName(req.professor)}
                        </p>
                        <p className="text-sm text-slate-600 truncate">
                          {getProfessorEmail(req.professor) ||
                            'Email no disponible'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleProcessRequest(req.id, 'reject')}
                        isLoading={
                          isProcessingRequest && processingId === req.id
                        }
                        disabled={isProcessingRequest}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => handleProcessRequest(req.id, 'accept')}
                        isLoading={
                          isProcessingRequest && processingId === req.id
                        }
                        disabled={isProcessingRequest}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3 pt-6 border-t">
          <h4 className="font-semibold text-slate-800">
            Miembros de la Institución
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {institution.manager?.user && (
              <div className="border-2 border-purple-200 rounded-lg p-3 bg-purple-50/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0 hidden sm:flex">
                    <AvatarImage
                      src={institution.manager.user.profile_picture}
                      alt={institution.manager.user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
                      {institution.manager.user.name?.charAt(0)}
                      {institution.manager.user.surname?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-2 flex-wrap">
                      {institution.manager.user.name}{' '}
                      {institution.manager.user.surname}
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        <Crown className="w-3 h-3 mr-1" /> Encargado
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 truncate">
                      {institution.manager.user.mail}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {otherProfessors.length > 0 ? (
              otherProfessors.map((professor) => (
                <div
                  key={professor.id}
                  className="border rounded-lg p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 flex-shrink-0 hidden sm:flex">
                        <AvatarImage
                          src={getProfessorProfilePicture(professor)}
                          alt={getProfessorName(professor)}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-green-400 text-white font-semibold">
                          {getProfessorInitials(professor)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {getProfessorName(professor)}
                        </p>
                        <p className="text-sm text-slate-600 truncate">
                          {getProfessorEmail(professor) ||
                            'Email no disponible'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() =>
                        handleRemoveProfessor(
                          professor.id,
                          getProfessorName(professor)
                        )
                      }
                      disabled={isRemoving}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  Aún no hay otros miembros.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
