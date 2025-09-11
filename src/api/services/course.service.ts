import apiClient from '../apiClient'
import type { Course } from '../../types/entities'

interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

const getProfessorCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<ApiResponse<Course[]>>('/courses/my-courses')
  return response.data.data
}

const create = async (payload: FormData): Promise<Course> => {
  const response = await apiClient.post<ApiResponse<Course>>('/courses', payload)
  return response.data.data
}

const update = async (courseId: string, data: FormData): Promise<Course> => {
  const response = await apiClient.put<ApiResponse<Course>>(`/courses/${courseId}`, data)
  return response.data.data
}

const remove = async (courseId: string): Promise<void> => {
  await apiClient.delete(`/courses/${courseId}`)
}

export const courseService = {
  getProfessorCourses,
  create,
  update,
  remove,
}