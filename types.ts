
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export interface ParentDetails {
  fatherName: string;
  motherName: string;
  fatherPhone: string;
  motherPhone: string;
  fatherEmail: string;
  motherEmail: string;
  address: string;
  reference: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  grade?: string; // e.g., "5to Secundaria", "Inicial 3 Años"
  parentDetails?: ParentDetails; // Contact info for students
}

export interface Course {
  id: string;
  name: string;
  schedule: string;
  teacherId: string; // "system" for Recess
  section: string; // Links to User.grade
}

export interface Grade {
  courseId: string;
  studentId: string;
  score: number; // 0-20 scale
  feedback?: string;
  courseName?: string;
}

// New Interface for Report Card (4 Periods)
export interface ReportCardEntry {
  courseId: string;
  courseName: string;
  period1: number | null; // Bimestre 1 (0-20)
  period2: number | null; // Bimestre 2 (0-20)
  period3: number | null; // Bimestre 3 (0-20)
  period4: number | null; // Bimestre 4 (0-20)
  finalAverage: number | null; // Promedio (0-20)
  dailyProgress: number; // 0-20 Mock for "Nota Diaria"
  weeklyProgress: number; // 0-20 Mock for "Nota Semanal"
  monthlyProgress: number; // 0-20 Mock for "Nota Mensual"
}

// New Interface for Syllabus
export interface SyllabusTopic {
  id: string;
  title: string;
  completed: boolean;
  type: 'theory' | 'practice'; // Teoria o Practica
}

export interface CourseSyllabus {
  courseId: string;
  courseName: string;
  totalProgress: number; // 0-100 (Percentage of completion)
  topics: SyllabusTopic[];
}

export interface AttendanceRecord {
  date: string;
  studentId: string;
  courseId: string;
  present: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  averageGrade: number; // 0-20 scale
  attendanceRate: number;
}
