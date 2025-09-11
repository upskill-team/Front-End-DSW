import { useMutation } from '@tanstack/react-query';
import { materialService } from '../api/services/material.service';

/**
 * Hook para la subida de un nuevo material.
 * Devuelve la mutación que se puede usar para subir un archivo.
 * Maneja el estado de carga y los errores automáticamente.
 */
export const useUploadMaterial = () => {
  return useMutation({
    mutationFn: (file: File) => materialService.upload(file),
  });
};