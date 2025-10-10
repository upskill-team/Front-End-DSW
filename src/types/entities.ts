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
  managedInstitution?: Institution;
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
  status: string;
  rating?: number;
  studentsCount?: number;
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
  normalizedName: string;
  aliases?: string[];
  manager: Professor;
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

export interface JoinRequest {
  id: string;
  professor: Professor;
  institution: Institution | string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface QuestionPayload {
  options: string[];
  correctAnswer: number | string;
}

export const QuestionType = {
  MultipleChoiceOption: 'MultipleChoiceOption',
} as const;

export type QuestionTypeValue =
  (typeof QuestionType)[keyof typeof QuestionType];

export interface Question {
  id?: string;
  questionText: string;
  questionType: QuestionTypeValue;
  payload: QuestionPayload;
  unitNumber?: number;
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
  unitNumber: number;
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
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
}

export interface MaterialEditorData extends Material {
  id?: string | number; // ID temporal para el editor
  file?: File; // Archivo pendiente de subida
  isUploading?: boolean;
}

// Tipos para Assessments (Evaluaciones Formales)
export interface Assessment {
  id: string;
  title: string;
  description?: string;
  course: {
    id: string;
    name: string;
  };
  questions: Question[];
  durationMinutes?: number | null;
  passingScore: number;
  maxAttempts?: number | null;
  isActive: boolean;
  availableFrom?: string;
  availableUntil?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssessmentRequest {
  title: string;
  description?: string;
  courseId: string;
  questionIds: string[];
  durationMinutes?: number | null;
  passingScore?: number;
  maxAttempts?: number | null;
  isActive?: boolean;
  availableFrom?: string;
  availableUntil?: string;
}

export interface UpdateAssessmentRequest {
  title?: string;
  description?: string;
  questionIds?: string[];
  durationMinutes?: number | null;
  passingScore?: number;
  maxAttempts?: number | null;
  isActive?: boolean;
  availableFrom?: string;
  availableUntil?: string;
}

export type AssessmentAttemptStatus = 'in_progress' | 'submitted';

export interface AssessmentAttempt {
  id: string;
  student: {
    id: string;
    name: string;
    surname?: string;
  };
  assessment: {
    id: string;
    title: string;
    course?: {
      id: string;
      name: string;
    };
  };
  status: AssessmentAttemptStatus;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  passed?: boolean;
  attemptNumber: number;
  answers?: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  question: Question;
  answer: number | string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface StartAttemptRequest {
  assessmentId: string;
  studentId: string;
}

export interface AnswerQuestionRequest {
  attemptId: string;
  questionId: string;
  answer: number | string;
}

export interface SubmitAttemptRequest {
  attemptId: string;
  answers: {
    questionId: string;
    answer: number | string;
  }[];
}
