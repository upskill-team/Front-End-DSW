export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  surname: string;
  mail: string;
  profile_picture?: string;
  phone?: string;
  location?: string;
  birthdate?: string;
  role: UserRole;
  studentProfile?: Student;
  professorProfile?: Professor;
  password?: string;
}

export interface Professor {
  id: string;
  user: User;
  state: string;
  courses: Course[];
  institution?: Institution;
}

export interface Student {
  id: string;
  user: User;
  courses: Course[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  courseType: CourseType;
  professor: Professor;
  isFree: boolean;
  price: number;
  students: Student[];
  units: Unit[];
}

export interface CourseType {
  id: string;
  name: string;
  description: string;
  courses: Course[];
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  professors: Professor[];
}

export interface Appeal {
  id: string;
  expertise: string;
  experienceMotivation: string;
  documentUrl?: string;
  state: 'pending' | 'accepted' | 'rejected';
  user: User;
  date: Date;
}

export interface QuestionPayload {
  options: string[];
  correctAnswer: number | string;
}

export interface Question {
  questionText: string;
  questionType: string;
  payload: QuestionPayload;
}

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

export interface Material {
  // ⚠️ Material es embeddable - NO tiene id propio
  title: string;
  url: string;
}

// ❌ Activity no existe en backend - se reemplaza por Question
export interface Activity {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
}

export interface Unit {
  // ⚠️ Unit es embeddable - NO tiene id propio
  unitNumber: number; // Identificador único + orden
  name: string;
  detail: string; // Contenido principal (no description)
  questions: string[]; // Referencias a Question IDs (no objetos completos)
  materials: Material[]; // Materiales embebidos
}

// Tipos específicos para edición de cursos
export interface CreateUnitRequest {
  name: string;
  detail?: string;
}

export interface UpdateUnitRequest {
  name?: string;
  detail?: string;
}

export interface ReorderUnitsRequest {
  units: { unitNumber: number; newOrder: number }[];
}

export interface CreateMaterialRequest {
  title: string;
}

export interface QuickSaveRequest {
  type: 'course-config' | 'unit-content' | 'unit-materials' | 'unit-questions';
  data:
    | CourseConfigData
    | UnitContentData
    | UnitMaterialsData
    | UnitQuestionsData;
}

export interface CourseConfigData {
  name?: string;
  description?: string;
  status?: string;
  isFree?: boolean;
  price?: number;
}

export interface UnitContentData {
  unitNumber: number;
  detail: string;
}

export interface UnitMaterialsData {
  unitNumber: number;
  materials: Material[];
}

export interface UnitQuestionsData {
  unitNumber: number;
  questions: string[];
}

// Tipos extendidos para el editor (incluyen datos locales)
export interface UnitEditorData extends Unit {
  // Datos adicionales para el editor
  activities: Activity[]; // Mantenemos compatibilidad temporal
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export interface MaterialEditorData extends Material {
  id?: string | number; // ID temporal para el editor
  file?: File; // Archivo pendiente de subida
  isUploading?: boolean;
}
