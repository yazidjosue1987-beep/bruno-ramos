
import { User, UserRole, Course, Grade, Announcement, SchoolStats, ReportCardEntry, CourseSyllabus, SyllabusTopic } from '../types';

// --- CONFIGURATION ---
const DEPARTMENTS = [
  'Matemáticas', 'Comunicación', 'Ciencia y Tecnología', 'Historia', 
  'Inglés', 'Arte', 'Educación Física', 'Religión', 'Computación', 
  'Tutoría', 'Física', 'Química', 'Biología', 'Música'
];

const GRADES_CONFIG = [
  { id: 'init_3', name: 'Inicial 3 Años', level: 'Inicial' },
  { id: 'init_4', name: 'Inicial 4 Años', level: 'Inicial' },
  { id: 'init_5', name: 'Inicial 5 Años', level: 'Inicial' },
  { id: 'prim_1', name: '1ro Primaria', level: 'Primaria' },
  { id: 'prim_2', name: '2do Primaria', level: 'Primaria' },
  { id: 'prim_3', name: '3er Primaria', level: 'Primaria' },
  { id: 'prim_4', name: '4to Primaria', level: 'Primaria' },
  { id: 'prim_5', name: '5to Primaria', level: 'Primaria' },
  { id: 'prim_6', name: '6to Primaria', level: 'Primaria' },
  { id: 'sec_1', name: '1ro Secundaria', level: 'Secundaria' },
  { id: 'sec_2', name: '2do Secundaria', level: 'Secundaria' },
  { id: 'sec_3', name: '3er Secundaria', level: 'Secundaria' },
  { id: 'sec_4', name: '4to Secundaria', level: 'Secundaria' },
  { id: 'sec_5', name: '5to Secundaria', level: 'Secundaria' },
];

// --- GENERATORS ---

// 1. Generate Admin
const adminUser: User = {
  id: 'admin1',
  name: 'Director General',
  email: 'director@colegio.edu',
  role: UserRole.ADMIN,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
};

// 2. Generate 14 Teachers (one per department/specialty)
const teachers: User[] = DEPARTMENTS.map((dept, index) => ({
  id: `teach_${index + 1}`,
  name: `Prof. ${['García', 'López', 'Rodríguez', 'Martínez', 'Hernández', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz'][index]} (${dept})`,
  email: `profesor${index + 1}@colegio.edu`,
  role: UserRole.TEACHER,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher${index}`,
}));

// 3. Generate 14 Students (1 per grade) with Realistic Full Names
const studentProfiles = [
  { firstName: 'Mateo', lastName: 'Silva', gender: 'male' },
  { firstName: 'Sofia', lastName: 'Rojas', gender: 'female' },
  { firstName: 'Santiago', lastName: 'Vargas', gender: 'male' },
  { firstName: 'Valentina', lastName: 'Castillo', gender: 'female' },
  { firstName: 'Sebastian', lastName: 'Mendoza', gender: 'male' },
  { firstName: 'Camila', lastName: 'Chavez', gender: 'female' },
  { firstName: 'Alejandro', lastName: 'Ramos', gender: 'male' },
  { firstName: 'Lucia', lastName: 'Romero', gender: 'female' },
  { firstName: 'Diego', lastName: 'Fernandez', gender: 'male' },
  { firstName: 'Maria', lastName: 'Ruiz', gender: 'female' },
  { firstName: 'Samuel', lastName: 'Alvarez', gender: 'male' },
  { firstName: 'Isabella', lastName: 'Vasquez', gender: 'female' },
  { firstName: 'Daniel', lastName: 'Jimenez', gender: 'male' },
  { firstName: 'Gabriela', lastName: 'Moreno', gender: 'female' }
];

const students: User[] = GRADES_CONFIG.map((grade, index) => {
  const profile = studentProfiles[index];
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return {
    id: `stud_${grade.id}`,
    name: fullName,
    email: `alumno.${grade.id}@colegio.edu`,
    role: UserRole.STUDENT,
    grade: grade.name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}${profile.lastName}`,
    parentDetails: {
      fatherName: `Sr. Juan ${profile.lastName}`,
      motherName: `Sra. Ana ${profile.lastName}`,
      fatherPhone: `9${Math.floor(Math.random() * 90000000 + 10000000)}`,
      motherPhone: `9${Math.floor(Math.random() * 90000000 + 10000000)}`,
      fatherEmail: `juan.${profile.lastName.toLowerCase()}@gmail.com`,
      motherEmail: `ana.${profile.lastName.toLowerCase()}@hotmail.com`,
      address: `Av. Principal ${Math.floor(Math.random() * 500) + 100}, Sector ${index + 1}`,
      reference: `Cerca al parque del Sector ${index + 1}, casa de 2 pisos`
    }
  };
});

export const MOCK_USERS: User[] = [adminUser, ...teachers, ...students];

// 4. Generate Courses & Schedules
let generatedCourses: Course[] = [];

GRADES_CONFIG.forEach((gradeCfg) => {
  // Always add Recess for Mon-Fri
  generatedCourses.push({
    id: `rec_${gradeCfg.id}`,
    name: 'RECREO / LONCHERA',
    schedule: 'Lun-Vie 10:00 - 10:30',
    teacherId: 'system', // No teacher
    section: gradeCfg.name
  });

  // Assign PE (Educación Física)
  const peTeacher = teachers[6]; 
  generatedCourses.push({
    id: `pe_${gradeCfg.id}`,
    name: 'Educación Física',
    schedule: 'Vie 08:00 - 10:00', 
    teacherId: peTeacher.id,
    section: gradeCfg.name
  });

  // Assign other academic courses
  let subjectsForLevel: { name: string, teacherIdx: number, slot: string }[] = [];
  
  if (gradeCfg.level === 'Inicial') {
    subjectsForLevel = [
      { name: 'Psicomotricidad', teacherIdx: 0, slot: 'Lun 08:00 - 10:00' },
      { name: 'Juegos Lúdicos', teacherIdx: 5, slot: 'Lun 10:30 - 12:30' },
      { name: 'Comunicación', teacherIdx: 1, slot: 'Mar 08:00 - 10:00' },
      { name: 'Descubrimiento', teacherIdx: 2, slot: 'Mar 10:30 - 12:30' },
      { name: 'Matemática', teacherIdx: 0, slot: 'Mie 08:00 - 10:00' },
      { name: 'Taller de Cuentos', teacherIdx: 1, slot: 'Mie 10:30 - 12:30' },
      { name: 'Inglés', teacherIdx: 4, slot: 'Jue 08:00 - 10:00' },
      { name: 'Minichef / Arte', teacherIdx: 5, slot: 'Jue 10:30 - 12:30' },
      { name: 'Tutoría', teacherIdx: 9, slot: 'Vie 10:30 - 12:30' },
    ];
  } else if (gradeCfg.level === 'Primaria') {
    subjectsForLevel = [
      { name: 'Matemáticas', teacherIdx: 0, slot: 'Lun 08:00 - 10:00' },
      { name: 'Comunicación', teacherIdx: 1, slot: 'Lun 10:30 - 12:30' },
      { name: 'Ciencia y Ambiente', teacherIdx: 2, slot: 'Mar 08:00 - 10:00' },
      { name: 'Personal Social', teacherIdx: 3, slot: 'Mar 10:30 - 12:30' },
      { name: 'Inglés', teacherIdx: 4, slot: 'Mie 08:00 - 10:00' },
      { name: 'Arte y Cultura', teacherIdx: 5, slot: 'Mie 10:30 - 12:30' },
      { name: 'Religión', teacherIdx: 7, slot: 'Jue 08:00 - 10:00' },
      { name: 'Computación', teacherIdx: 8, slot: 'Jue 10:30 - 12:30' },
      { name: 'Tutoría / Plan Lector', teacherIdx: 9, slot: 'Vie 10:30 - 12:30' },
    ];
  } else { // Secundaria
    subjectsForLevel = [
      { name: 'Matemáticas', teacherIdx: 0, slot: 'Lun 08:00 - 10:00' },
      { name: 'Comunicación', teacherIdx: 1, slot: 'Lun 10:30 - 12:30' },
      { name: 'C.T.A. (Ciencias)', teacherIdx: 10, slot: 'Mar 08:00 - 10:00' },
      { name: 'Historia y Geografía', teacherIdx: 3, slot: 'Mar 10:30 - 12:30' },
      { name: 'Inglés Avanzado', teacherIdx: 4, slot: 'Mie 08:00 - 10:00' },
      { name: 'D.P.C.C. (Cívica)', teacherIdx: 7, slot: 'Mie 10:30 - 12:30' },
      { name: 'Física Elemental', teacherIdx: 10, slot: 'Jue 08:00 - 10:00' },
      { name: 'Computación', teacherIdx: 8, slot: 'Jue 10:30 - 12:30' },
      { name: 'Arte / Música', teacherIdx: 13, slot: 'Vie 10:30 - 12:30' },
    ];
  }

  subjectsForLevel.forEach((subj, i) => {
    generatedCourses.push({
      id: `crs_${gradeCfg.id}_${i}`,
      name: subj.name,
      schedule: subj.slot,
      teacherId: teachers[subj.teacherIdx].id,
      section: gradeCfg.name
    });
  });
});

export const MOCK_COURSES: Course[] = generatedCourses;

// 5. Generate Grades & Report Cards & Syllabus
const generatedGrades: Grade[] = [];
const generatedReportCards: ReportCardEntry[] = [];
const generatedSyllabus: CourseSyllabus[] = [];

// Helper to generate weighted 0-20 grades
const getWeightedGrade = () => {
  const rand = Math.random();
  // 70% chance of High Grade (16-20)
  if (rand < 0.70) return Math.floor(Math.random() * (21 - 16) + 16);
  // 25% chance of Regular Grade (11-15)
  if (rand < 0.95) return Math.floor(Math.random() * (16 - 11) + 11);
  // 5% chance of Low Grade (0-10)
  return Math.floor(Math.random() * 11);
};

// Generic Topics generator
const getTopicsForCourse = (courseName: string): SyllabusTopic[] => {
  const topics: SyllabusTopic[] = [];
  const baseTopics = [
    { title: 'Introducción al curso', type: 'theory' },
    { title: 'Fundamentos básicos I', type: 'theory' },
    { title: 'Práctica Calificada 1', type: 'practice' },
    { title: 'Fundamentos básicos II', type: 'theory' },
    { title: 'Desarrollo de competencias', type: 'theory' },
    { title: 'Práctica Calificada 2', type: 'practice' },
    { title: 'Evaluación Parcial', type: 'practice' },
    { title: 'Temas Avanzados I', type: 'theory' },
    { title: 'Proyecto de investigación', type: 'practice' },
    { title: 'Examen Final', type: 'practice' },
  ];

  baseTopics.forEach((t, i) => {
    // Random completion based on index to simulate progress
    // Assume we are in middle of year, so maybe first 5-6 are done
    topics.push({
      id: `topic_${i}`,
      title: `${t.title} - ${courseName}`,
      type: t.type as 'theory' | 'practice',
      completed: i < 6 // First 6 done
    });
  });
  return topics;
};

MOCK_COURSES.forEach(course => {
  if (course.teacherId === 'system') return; // Skip Recess

  const student = students.find(s => s.grade === course.section);
  
  if (student) {
    // 5a. Single Grade for the "Recent Grades" widget (0-20 scale)
    generatedGrades.push({
      courseId: course.id,
      studentId: student.id,
      score: getWeightedGrade(), 
      feedback: 'Buen desempeño, sigue así.',
      courseName: course.name
    });

    // 5b. Generate Report Card (4 Periods) - 0-20 scale
    const p1 = getWeightedGrade();
    const p2 = getWeightedGrade();
    const p3 = null; // Current Period
    const p4 = null; // Future

    // Calculate interim average
    // Only average existing periods
    const scores = [p1, p2].filter(p => p !== null) as number[];
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    generatedReportCards.push({
      courseId: course.id,
      courseName: course.name,
      period1: p1,
      period2: p2,
      period3: p3,
      period4: p4,
      finalAverage: avg, 
      dailyProgress: getWeightedGrade(), // Now a grade 0-20
      weeklyProgress: getWeightedGrade(), // Now a grade 0-20
      monthlyProgress: getWeightedGrade() // Now a grade 0-20
    });

    // 5c. Generate Syllabus
    generatedSyllabus.push({
      courseId: course.id,
      courseName: course.name,
      totalProgress: 60, // Mock fixed progress
      topics: getTopicsForCourse(course.name)
    });
  }
});


export const MOCK_GRADES: Grade[] = generatedGrades;
export const MOCK_REPORT_CARDS = generatedReportCards;
export const MOCK_SYLLABUS = generatedSyllabus;

// Mock Announcements
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Campeonato Deportivo', content: 'Inician los juegos deportivos interescolares la próxima semana.', date: '2024-03-15', author: 'Director General' },
  { id: 'a2', title: 'Entrega de Libretas', content: 'Reunión de padres de familia para entrega de notas del primer bimestre.', date: '2024-03-20', author: 'Director General' },
];

export const getStats = (): SchoolStats => {
  return {
    totalStudents: students.length, 
    totalTeachers: teachers.length, 
    averageGrade: Math.round(generatedGrades.reduce((acc, curr) => acc + curr.score, 0) / generatedGrades.length),
    attendanceRate: 98.2 
  };
};

export const getStudentGrades = (studentId: string) => {
  return MOCK_GRADES.filter(g => g.studentId === studentId);
};

export const getStudentCourses = (studentId: string) => {
  const student = MOCK_USERS.find(u => u.id === studentId);
  if (!student || !student.grade) return [];
  return MOCK_COURSES.filter(c => c.section === student.grade);
};

export const getStudentReportCard = (studentId: string) => {
  // Report cards are generated linked to courseId. We need to filter based on courses the student has.
  const myCourses = getStudentCourses(studentId);
  return MOCK_REPORT_CARDS.filter(rc => myCourses.some(c => c.id === rc.courseId));
};

export const getStudentSyllabus = (studentId: string) => {
  const myCourses = getStudentCourses(studentId);
  return MOCK_SYLLABUS.filter(s => myCourses.some(c => c.id === s.courseId));
};

export const getTeacherCourses = (teacherId: string) => {
  return MOCK_COURSES.filter(c => c.teacherId === teacherId);
};
