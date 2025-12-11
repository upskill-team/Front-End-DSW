import { useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '../api/services/material.service';
import type { Material } from '../types/entities';
import type { AxiosError } from 'axios';

/**
 * Hook para subir material a una unidad específica usando endpoints granulares.
 * Devuelve la mutación que se puede usar para subir un archivo a una unidad.
 * Maneja el estado de carga y los errores automáticamente.
 */
export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Material,
    AxiosError,
    { courseId: string; unitNumber: number; file: File; title?: string }
  >({
    mutationFn: ({ courseId, unitNumber, file, title }) =>
      materialService.upload(courseId, unitNumber, file, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};

/**
 * Hook para eliminar material de una unidad específica.
 * Elimina el material por su índice en la unidad.
 */
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { courseId: string; unitNumber: number; materialIndex: number }
  >({
    mutationFn: ({ courseId, unitNumber, materialIndex }) =>
      materialService.delete(courseId, unitNumber, materialIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professorCourses'] });
    },
  });
};


