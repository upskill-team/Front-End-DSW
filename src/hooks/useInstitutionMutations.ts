import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { institutionService, type CreateInstitutionData, type AddProfessorRequest } from '../api/services/institution.service';

/**
 * Hook to fetch all active institutions
 */
export const useInstitutions = () => {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: () => institutionService.getAll(),
  });
};

/**
 * Hook to fetch a single institution
 */
export const useInstitution = (id: string) => {
  return useQuery({
    queryKey: ['institutions', id],
    queryFn: () => institutionService.getOne(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch the managed institution of the current professor
 */
export const useManagedInstitution = () => {
  return useQuery({
    queryKey: ['institutions', 'managed'],
    queryFn: () => institutionService.getManagedInstitution(),
  });
};

/**
 * Hook to create a new institution
 */
export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInstitutionData) => institutionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['institutions', 'managed'] });
      queryClient.invalidateQueries({ queryKey: ['professors', 'me'] });
    },
  });
};

/**
 * Hook to leave an institution
 */
export const useLeaveInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (institutionId: string) => institutionService.leaveInstitution(institutionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      queryClient.invalidateQueries({ queryKey: ['professors', 'me'] });
    },
  });
};

/**
 * Hook to add a professor to an institution (manager only)
 */
export const useAddProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ institutionId, data }: { institutionId: string; data: AddProfessorRequest }) =>
      institutionService.addProfessor(institutionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['institutions', variables.institutionId] });
      queryClient.invalidateQueries({ queryKey: ['institutions', 'managed'] });
    },
  });
};

/**
 * Hook to remove a professor from an institution
 */
export const useRemoveProfessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ institutionId, professorId }: { institutionId: string; professorId: string }) =>
      institutionService.removeProfessor(institutionId, professorId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['institutions', variables.institutionId] });
      queryClient.invalidateQueries({ queryKey: ['institutions', 'managed'] });
      queryClient.invalidateQueries({ queryKey: ['professors', 'me'] });
    },
  });
};

/**
 * Hook to update the managed institution (manager only)
 */
export const useUpdateManagedInstitution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CreateInstitutionData>) => institutionService.updateManaged(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions', 'managed'] });
      queryClient.invalidateQueries({ queryKey: ['professors', 'me'] });
    },
  });
};