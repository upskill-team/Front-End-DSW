export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  surname: string;
  mail: string;
  profile_picture: string;
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
  password: string;
  imageUrl: string;
  courseType: CourseType;
  professor: Professor;
  isFree: boolean;
  price: number
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

export interface MultipleChoiceOption {
  text: string;
  isCorrect: boolean;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  url: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  question: string;
  options: MultipleChoiceOption[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  name: string;
  detail: string;
  activities: Activity[];
  materials: Material[];
}