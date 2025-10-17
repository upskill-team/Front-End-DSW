import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import type { Professor } from '../types/entities';
import type { AxiosError } from 'axios';

export interface MonthlyEarning {
  month: string; // Formato: "2025-10"
  earningsInCents: number;
  salesCount: number;
}

export interface ProfessorAnalyticsData {
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
