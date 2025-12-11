import { useQuery } from '@tanstack/react-query';
import {
  adminService,
  type AdminAnalytics,
} from '../api/services/admin.service';
import type { AxiosError } from 'axios';

/**
 * Hook para obtener las analíticas del administrador
 * @param months - Número de meses de histórico (1-24, default: 6)
 */
export const useAdminAnalytics = (months: number = 6) => {
  return useQuery<AdminAnalytics, AxiosError>({
    queryKey: ['admin', 'analytics', months],
    queryFn: () => adminService.getAnalytics(months),
    staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    retry: 2,
  });
};
