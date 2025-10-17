import apiClient from '../apiClient';

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// ==================== TYPES ====================

export interface AdminAnalytics {
  // Totales generales
  totalStudents: number;
  totalProfessors: number;
  totalCourses: number;
  totalEarningsInCents: number;
  platformEarningsInCents: number;
  professorsEarningsInCents: number;
  totalEnrollments: number;
  pendingAppeals: number;
  pendingJoinRequests: number;

  // Crecimiento de usuarios por mes
  userGrowth: Array<{
    month: string;
    newStudents: number;
    newProfessors: number;
    totalStudents: number;
    totalProfessors: number;
  }>;

  // Historial de ingresos por mes
  revenueHistory: Array<{
    month: string;
    totalEarningsInCents: number;
    platformEarningsInCents: number;
    professorsEarningsInCents: number;
    salesCount: number;
  }>;

  // Top 5 cursos más vendidos
  topCourses: Array<{
    courseId: string;
    courseName: string;
    professorName: string;
    salesCount: number;
    totalEarningsInCents: number;
    studentsCount: number;
  }>;

  // Top 5 profesores con más ganancias
  topProfessors: Array<{
    professorId: string;
    professorName: string;
    totalEarningsInCents: number;
    coursesCount: number;
    totalStudents: number;
    averageRating: number | null;
  }>;

  // Estadísticas de cursos
  courseStats: {
    byStatus: {
      'en-desarrollo': number;
      bloqueado: number;
      publicado: number;
      pausado: number;
    };
    freeCourses: number;
    paidCourses: number;
    averagePriceInCents: number | null;
  };

  // Actividad reciente
  recentActivity: {
    newStudentsToday: number;
    newProfessorsToday: number;
    salesToday: number;
    newCoursesThisWeek: number;
    newEnrollmentsToday: number;
  };

  // Porcentajes de crecimiento
  growth: {
    studentsGrowthPercentage: number;
    professorsGrowthPercentage: number;
    coursesGrowthPercentage: number;
    revenueGrowthPercentage: number;
  };
}

// ==================== SERVICES ====================

const getAnalytics = async (months: number = 6): Promise<AdminAnalytics> => {
  const response = await apiClient.get<ApiResponse<AdminAnalytics>>(
    `/admin/analytics?months=${months}`
  );
  return response.data.data;
};

export const adminService = {
  getAnalytics,
};
