import { useQuery } from '@tanstack/react-query';
import { studentService } from '../api/services/student.service';
import type { AxiosError } from 'axios';

/**
 * Hook to fetch the total count of students.
 * The data is cached for 1 hour as it doesn't change frequently.
 */
export const useStudentCount = () => {
  return useQuery<number, AxiosError>({
    queryKey: ['students', 'count'],
    queryFn: studentService.getTotalCount,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};