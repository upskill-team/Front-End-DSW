import apiClient from '../apiClient'
import type { Course } from '../../types/entities'

type CreateCoursePayload = {
  name: string
  description: string
  courseTypeId: string
}

type UpdateCoursePayload = Partial<CreateCoursePayload>

interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

const getProfessorCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get<ApiResponse<Course[]>>('/courses/my-courses')
  return response.data.data
}

const create = async (payload: CreateCoursePayload): Promise<Course> => {
  const response = await apiClient.post<ApiResponse<Course>>('/courses', payload)
  return response.data.data
}

const update = async (courseId: string, payload: UpdateCoursePayload): Promise<Course> => {
  const response = await apiClient.patch<ApiResponse<Course>>(`/courses/${courseId}`, payload)
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