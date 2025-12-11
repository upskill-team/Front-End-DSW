import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { Professor } from '../types/entities';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../types/shared.ts';

interface MonthlyEarning {
  month: string; // Formato: "2025-10"
  earningsInCents: number;
  salesCount: number;
}

interface ProfessorAnalyticsData {
  totalStudents: number;
  publishedCourses: number;
  totalEarningsInCents: number;
  monthlyEarnings: MonthlyEarning[];
  totalSales: number;
  lastSaleDate: string | null; // ISO date string
}

/**
 * Hook to get the current professor profile
 */
export const useProfessorProfile = () => {
  return useQuery({
    queryKey: ['professors', 'me'],
    queryFn: async () => {
      const response = await apiClient.get<{
        status: number;
        message: string;
        data: Professor;
      }>('/professors/me');
      return response.data.data;
    },
    // Only run this query if user is authenticated and is a professor
    enabled: true,
    retry: false,
  });
};

/**
 * Hook para obtener una lista de todos los perfiles de profesor.
 * Útil para directorios de instructores o vistas de administrador.
 */
export const useProfessors = () => {
  return useQuery<Professor[], AxiosError>({
    queryKey: ['professors', 'all'],

    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Professor[]>>('/professors');
      return response.data.data;
    },

  });
};

/**
 * Hook to get the analytics data for the current professor's dashboard
 */
export const useProfessorAnalytics = () => {
  return useQuery<ProfessorAnalyticsData, AxiosError>({
    queryKey: ['professor', 'analytics'],
    queryFn: async () => {
      const response = await apiClient.get('/professors/me/analytics');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
