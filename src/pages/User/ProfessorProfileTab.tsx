import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Building2, GraduationCap, Plus, LogOut, AlertCircle, Crown, Hourglass, XCircle, Edit } from 'lucide-react';
import { useProfessorProfile } from '../../hooks/useProfessor';
import { useInstitutions, useManagedInstitution, useLeaveInstitution } from '../../hooks/useInstitutionMutations';
import { useGetMyPendingRequest, useCancelJoinRequest } from '../../hooks/useJoinRequests';
import CreateInstitutionModal from '../../components/professor/institutionManagement/modals/CreateInstitutionModal';
import JoinInstitutionModal from '../../components/professor/institutionManagement/modals/JoinInstitutionModal';
import ManageInstitutionSection from '../../components/professor/institutionManagement/ManageInstitutionSection';
import EditInstitutionModal from '../../components/professor/institutionManagement/modals/EditInstitutionModal';

export default function InstructorProfileTab() {
  const { data: professor, isLoading: isProfessorLoading } = useProfessorProfile();
  const { data: managedInstitution, isLoading: isManagedLoading } = useManagedInstitution();
  const { data: institutions, isLoading: isInstitutionsLoading } = useInstitutions();
  const { data: pendingRequest, isLoading: isLoadingPendingRequest } = useGetMyPendingRequest();
  
  const { mutate: leaveInstitution, isPending: isLeaving } = useLeaveInstitution();
  const { mutate: cancelRequest, isPending: isCancelling } = useCancelJoinRequest();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const isLoading = isProfessorLoading || isManagedLoading || isInstitutionsLoading || isLoadingPendingRequest;

  const hasInstitution = !!professor?.institution;
  const isManager = !!managedInstitution;
  const hasPendingRequest = !!pendingRequest;

  const handleLeaveInstitution = () => {
    if (professor?.institution && confirm('¿Estás seguro de que quieres abandonar esta institución?')) {
      leaveInstitution(professor.institution.id, {
        onError: (error) => alert(`Error al abandonar la institución: ${error.message}`),
      });
    }
  };

  const handleCancelRequest = () => {
    if (pendingRequest && confirm('¿Estás seguro de que quieres cancelar tu solicitud para unirte a esta institución?')) {
      cancelRequest(pendingRequest.id, {
        onError: (error) => alert(`Error al cancelar la solicitud: ${error.message}`),
      });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-slate-600 p-8">Cargando información del instructor...</p>;
    }

    if (!professor) {
      return (
        <div className="text-center p-8">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-slate-600">No se pudo cargar el perfil de instructor.</p>
        </div>
      );
    }
    
    if (hasPendingRequest && pendingRequest?.institution) {
      const institutionName = typeof pendingRequest.institution === 'object' ? pendingRequest.institution.name : 'una institución';
      return (
        <div className="p-6 rounded-lg bg-yellow-50 border border-yellow-200 text-center space-y-4">
          <Hourglass className="w-12 h-12 text-yellow-500 mx-auto" />
          <h3 className="text-xl font-semibold text-yellow-800">Solicitud Pendiente</h3>
          <p className="text-yellow-700 max-w-md mx-auto">Tu solicitud para unirte a <span className="font-bold">"{institutionName}"</span> está siendo revisada.</p>
          <Button variant="outline" size="sm" onClick={handleCancelRequest} isLoading={isCancelling} className="border-yellow-300 text-yellow-800 hover:bg-yellow-100">
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar Solicitud
          </Button>
        </div>
      );
    }
    
    if (isManager && managedInstitution) {
      return (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-800">Tu Institución</h3>
                  <p className="text-slate-800 font-bold text-xl">{managedInstitution.name}</p>
                  <p className="text-slate-600 text-sm max-w-prose">{managedInstitution.description}</p>
                  <div className="pt-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      <Crown className="w-3 h-3 mr-1.5" /> Eres el encargado
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
            </div>
          </div>
          <ManageInstitutionSection institution={managedInstitution} />
        </>
      );
    } 
    else if (hasInstitution && professor.institution) {
      return (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">Tu Institución</h3>
              <p className="text-slate-800 font-bold text-xl">{professor.institution.name}</p>
              <p className="text-slate-600 text-sm max-w-prose">{professor.institution.description}</p>
            </div>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 flex-shrink-0" onClick={handleLeaveInstitution} disabled={isLeaving}>
              <LogOut className="w-4 h-4 mr-2" />
              {isLeaving ? 'Abandonando...' : 'Abandonar'}
            </Button>
          </div>
        </div>
      );
    } 
    else {
      return (
        <>
          <div className="p-6 rounded-lg bg-slate-50 border">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-slate-500" /> Afiliación Institucional
            </h3>
            <p className="text-slate-600">No estás afiliado a ninguna institución actualmente.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:border-purple-200 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto"><Plus className="w-6 h-6 text-purple-600" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Crear Nueva Institución</h4>
                  <p className="text-sm text-slate-600 mb-4">Crea y administra tu propia institución.</p>
                </div>
                <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={() => setShowCreateModal(true)}>Crear Institución</Button>
              </CardContent>
            </Card>
            <Card className="hover:border-blue-200 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto"><Building2 className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Unirse a Institución</h4>
                  <p className="text-sm text-slate-600 mb-4">Busca y únete a una institución existente.</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setShowJoinModal(true)}>Ver Instituciones</Button>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <span>Perfil de Instructor</span>
          </CardTitle>
          <CardDescription>Gestiona tu afiliación institucional.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContent()}
        </CardContent>
      </Card>

      <CreateInstitutionModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} institutions={institutions || []} />
      <JoinInstitutionModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} institutions={institutions || []} />
      
      {managedInstitution && (
        <EditInstitutionModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          institution={managedInstitution} 
        />
      )}
    </>
  );
}