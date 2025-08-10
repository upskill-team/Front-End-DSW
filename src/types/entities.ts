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
  courseType: CourseType;
  professor: Professor;
  students: Student[];
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
  date: Date;
  text: string;
  state: string;
  professor: Professor;
  user: User;
}