import apiClient from '../apiClient'
import type { Course } from '../../types/entities'

type StagedMaterial = {
  id: number;
  name: string;
  file: File;
};

type Activity = {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
};

type Unit = {
  unitNumber: number;
  name: string;
  detail: string;
  activities: Activity[];
  materials: StagedMaterial[];
}

type CreateCoursePayload = {
  name: string
  description: string
  courseTypeId: string
  price: number
  isFree: boolean,
  image: File | null,
  units?: Unit[]
  
}

type UpdateCoursePayload = Partial<CreateCoursePayload>

interface ApiResponse<T> {
  status: number
  message: string
  data: T
}

// Funcion helper para construir el FormData para la actualización
const buildUpdateFormData = (payload: UpdateCoursePayload): FormData => {
  const formData = new FormData();

  // --- Añadir campos simples si existens ---
  if (payload.name) {
    formData.append('name', payload.name);
  }
  if (payload.description) {
    formData.append('description', payload.description);
  }

  // ---Procesar unidades si exiten ---
  if (payload.units) {
    // Serializar el array de unidades (sin los archivos)
    const unitsDataForJson = payload.units.map(unit => ({
      unitNumber: unit.unitNumber,
      name: unit.name,
      detail: unit.detail,
      activities: unit.activities,
      materials: unit.materials.map(material => ({
        id: material.id,
        name: material.name,
      })),
    }));
    formData.append('units', JSON.stringify(unitsDataForJson));

    // Añadir solo los archivos de los materiales por separado
    payload.units.forEach((unit, unitIndex) => {
      unit.materials.forEach((material, materialIndex) => {
        if (material.file instanceof File) {
          const fileKey = `unit_${unitIndex}_material_${materialIndex}_file`;
          formData.append(fileKey, material.file);
        }
      });
    });
  }

  return formData;
};



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