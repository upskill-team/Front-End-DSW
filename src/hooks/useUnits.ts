import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unitService } from '../api/services/unit.service.ts';
import type {
  CreateUnitRequest,
  UpdateUnitRequest,
  ReorderUnitsRequest,
  Unit,
} from '../types/entities';
import type { AxiosError } from 'axios';

// Hook para crear una nueva unidad
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Unit,
    AxiosError,
    { courseId: string; data: CreateUnitRequest }
  >({
    mutationFn: ({ courseId, data }) => unitService.create(courseId, data),
    onSuccess: () => {
      // Invalidar cache de cursos del profesor
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

// Hook para actualizar una unidad existente
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Unit,
    AxiosError,
    { courseId: string; unitNumber: number; data: UpdateUnitRequest }
  >({
    mutationFn: ({ courseId, unitNumber, data }) =>
      unitService.update(courseId, unitNumber, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

// Hook para eliminar una unidad
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { courseId: string; unitNumber: number }
  >({
    mutationFn: ({ courseId, unitNumber }) =>
      unitService.delete(courseId, unitNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

// Hook para reordenar unidades
export const useReorderUnits = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Unit[],
    AxiosError,
    { courseId: string; data: ReorderUnitsRequest }
  >({
    mutationFn: ({ courseId, data }) => unitService.reorder(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

// Hook para subir archivo a unidad (existente)
export const useUploadUnitFile = () => {
  return useMutation({
    mutationFn: (file: File) => unitService.uploadFile(file),
  });
};
