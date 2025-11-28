
import React, { useState } from 'react';
import { User, Course, CourseSyllabus } from '../types';
import { getStudentCourses, getStudentReportCard, getStudentSyllabus, MOCK_ANNOUNCEMENTS, MOCK_USERS } from '../services/dataService';
import { Calendar, TrendingUp, Bell, Coffee, BookOpen, CheckCircle, Circle, FileText, ChevronDown, ChevronUp, Layout, GraduationCap, Clock, User as UserIcon } from 'lucide-react';

interface StudentViewProps {
  user: User;
}

const StudentView: React.FC<StudentViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'courses' | 'grades'>('schedule');
  const myCourses = getStudentCourses(user.id);
  const myReportCard = getStudentReportCard(user.id);
  const mySyllabus = getStudentSyllabus(user.id);

  // Helper to get Teacher Name
  const getTeacherName = (teacherId: string) => {
    if (teacherId === 'system') return '';
    const teacher = MOCK_USERS.find(u => u.id === teacherId);
    return teacher ? teacher.name : 'Docente';
  };

  // Helper to organize courses by day
  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const dayMap: Record<string, number> = {
    'Lun': 0, 'Mar': 1, 'Mie': 2, 'Jue': 3, 'Vie': 4
  };

  const weeklySchedule = Array(5).fill(null).map(() => [] as Course[]);

  myCourses.forEach(course => {
    const scheduleStr = course.schedule;
    if (scheduleStr.startsWith('Lun-Vie')) {
      for (let i = 0; i < 5; i++) weeklySchedule[i].push(course);
    } else {
      const dayKey = Object.keys(dayMap).find(d => scheduleStr.startsWith(d));
      if (dayKey) {
        weeklySchedule[dayMap[dayKey]].push(course);
      }
    }
  });

  weeklySchedule.forEach(dayCourses => {
    dayCourses.sort((a, b) => {
      const timeA = a.schedule.match(/\d{2}:\d{2}/)?.[0] || '00:00';
      const timeB = b.schedule.match(/\d{2}:\d{2}/)?.[0] || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  // Helper for Grade Styling (0-20 scale)
  const getGradeStyle = (score: number | null) => {
    if (score === null) return 'text-slate-300 bg-slate-50';
    if (score < 11) return 'text-red-600 bg-red-50 font-bold';
    return 'text-blue-600 bg-blue-50 font-bold';
  };

  // Sub-component for a Course Syllabus Card
  const SyllabusCard = ({ syllabus }: { syllabus: CourseSyllabus }) => {
    const [expanded, setExpanded] = useState(false);
    // Find course to get teacher name
    const course = myCourses.find(c => c.id === syllabus.courseId);
    const teacherName = course ? getTeacherName(course.teacherId) : '';

    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
        <div 
          className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex-1">
            <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              {syllabus.courseName}
            </h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
               <UserIcon size={12}/> {teacherName}
            </p>
            <div className="mt-3 w-full max-w-md">
               <div className="flex justify-between text-xs text-slate-500 mb-1">
                 <span>Avance del Silabo</span>
                 <span className="font-bold">{syllabus.totalProgress}%</span>
               </div>
               <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${syllabus.totalProgress}%` }}
                  ></div>
               </div>
            </div>
          </div>
          <div className="text-slate-400">
            {expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>

        {expanded && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50">
            <h5 className="font-semibold text-sm text-slate-700 uppercase tracking-wide mb-3">Temario & Prácticas</h5>
            <div className="space-y-3">
              {syllabus.topics.map((topic, idx) => (
                <div key={topic.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                  <div className={`mt-0.5 ${topic.completed ? 'text-green-500' : 'text-slate-300'}`}>
                    {topic.completed ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${topic.completed ? 'text-slate-700' : 'text-slate-500'}`}>
                      {topic.title}
                    </p>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ml-auto mt-1 inline-block ${
                      topic.type === 'practice' ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {topic.type === 'practice' ? 'Práctica' : 'Teoría'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Bienvenido, {user.name} 👋</h2>
          <p className="text-slate-500">Grado Actual: <span className="font-bold text-blue-600">{user.grade}</span></p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'schedule' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar size={16} /> Horario
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'courses' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen size={16} /> Mis Cursos
          </button>
          <button 
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'grades' ? 'bg-white text-slate-900 shadow' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText size={16} /> Notas
          </button>
        </div>
      </div>

      {/* --- TAB: SCHEDULE --- */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-3">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
              <Calendar className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="font-bold text-xl text-slate-800">Mi Horario Semanal</h3>
                <p className="text-sm text-slate-500">Organización de clases de Lunes a Viernes</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {daysOfWeek.map((dayName, index) => (
                <div key={dayName} className="flex flex-col bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <div className="bg-slate-200 py-3 text-center">
                    <h4 className="font-bold text-slate-700">{dayName}</h4>
                  </div>
                  <div className="p-3 space-y-3 flex-1">
                    {weeklySchedule[index].map((course, i) => {
                      const isRecess = course.name.includes('RECREO');
                      const timeOnly = course.schedule.match(/\d{2}:\d{2} - \d{2}:\d{2}/)?.[0] || course.schedule;
                      const teacherName = getTeacherName(course.teacherId);
                      
                      return (
                        <div 
                          key={`${course.id}-${index}-${i}`}
                          className={`p-3 rounded-lg border shadow-sm transition-transform hover:scale-[1.02] cursor-default ${
                            isRecess 
                              ? 'bg-amber-100 border-amber-200' 
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${isRecess ? 'text-amber-600' : 'text-indigo-500'}`}>
                               {timeOnly}
                            </span>
                            <h5 className={`font-bold leading-tight ${isRecess ? 'text-amber-900' : 'text-slate-800'}`}>
                              {isRecess ? <span className="flex items-center gap-1"><Coffee size={14}/> Recreo</span> : course.name}
                            </h5>
                            {!isRecess && (
                              <p className="text-[10px] text-slate-500 truncate mt-1">
                                {teacherName}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Announcements Widget */}
          <div className="lg:col-span-3 bg-amber-50 p-6 rounded-xl border border-amber-100">
             <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg text-amber-900">Comunicados Recientes</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {MOCK_ANNOUNCEMENTS.map((ann) => (
                 <div key={ann.id} className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                    <h4 className="font-bold text-slate-800">{ann.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{ann.content}</p>
                    <div className="mt-2 text-xs text-slate-400 text-right">{ann.date}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* --- TAB: COURSES (SYLLABUS) --- */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm flex items-center gap-2">
            <Layout size={18} />
            <span>Aquí puedes ver el avance del temario, las prácticas realizadas y los temas pendientes por curso.</span>
          </div>
          
          <div className="space-y-4">
            {mySyllabus.length > 0 ? (
              mySyllabus.map((syllabus) => (
                <SyllabusCard key={syllabus.courseId} syllabus={syllabus} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <p className="text-slate-500">Cargando información de los cursos...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: GRADES (LIBRETA) --- */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-blue-800 text-sm flex items-center gap-2">
            <TrendingUp size={18} />
            <span>Visualiza tu progreso diario, semanal y mensual, además de tu Libreta de Notas oficial (0-20).</span>
          </div>

          {/* Official Report Card Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <h3 className="font-bold text-xl text-slate-800 mb-6 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              Libreta de Notas Anual
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-semibold text-slate-600 text-sm">Curso / Asignatura</th>
                    <th className="p-4 font-semibold text-center text-slate-600 text-sm w-24">Bimestre 1</th>
                    <th className="p-4 font-semibold text-center text-slate-600 text-sm w-24">Bimestre 2</th>
                    <th className="p-4 font-semibold text-center text-slate-600 text-sm w-24">Bimestre 3</th>
                    <th className="p-4 font-semibold text-center text-slate-600 text-sm w-24">Bimestre 4</th>
                    <th className="p-4 font-semibold text-center text-slate-800 text-sm w-24 bg-slate-100">Promedio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myReportCard.map((rc) => {
                    return (
                      <tr key={rc.courseId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-800">{rc.courseName}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded text-sm ${getGradeStyle(rc.period1)}`}>
                            {rc.period1 !== null ? rc.period1 : '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded text-sm ${getGradeStyle(rc.period2)}`}>
                            {rc.period2 !== null ? rc.period2 : '-'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-300 font-medium">-</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-slate-300 font-medium">-</span>
                        </td>
                        <td className="p-4 text-center bg-slate-50">
                          <span className={`font-bold ${getGradeStyle(rc.finalAverage)}`}>
                             {rc.finalAverage !== null ? rc.finalAverage : '-'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Daily/Weekly Progress Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {myReportCard.slice(0, 4).map((rc) => (
               <div key={`prog_${rc.courseId}`} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4 flex justify-between items-center">
                    {rc.courseName}
                    <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded text-slate-500">Evaluación Permanente</span>
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Avance Diario */}
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                         <span className="text-slate-500">Nota Diaria (Participación)</span>
                         <span className={`font-bold ${rc.dailyProgress < 11 ? 'text-red-600' : 'text-slate-700'}`}>
                           {rc.dailyProgress}/20
                         </span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${rc.dailyProgress < 11 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${(rc.dailyProgress / 20) * 100}%`}}
                          ></div>
                       </div>
                    </div>

                    {/* Avance Semanal */}
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                         <span className="text-slate-500">Nota Semanal (Tareas)</span>
                         <span className={`font-bold ${rc.weeklyProgress < 11 ? 'text-red-600' : 'text-slate-700'}`}>
                           {rc.weeklyProgress}/20
                         </span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${rc.weeklyProgress < 11 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                            style={{ width: `${(rc.weeklyProgress / 20) * 100}%`}}
                          ></div>
                       </div>
                    </div>

                    {/* Avance Mensual */}
                    <div>
                       <div className="flex justify-between text-xs mb-1">
                         <span className="text-slate-500">Nota Mensual (Exámenes)</span>
                         <span className={`font-bold ${rc.monthlyProgress < 11 ? 'text-red-600' : 'text-slate-700'}`}>
                           {rc.monthlyProgress}/20
                         </span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${rc.monthlyProgress < 11 ? 'bg-red-500' : 'bg-purple-500'}`} 
                            style={{ width: `${(rc.monthlyProgress / 20) * 100}%`}}
                          ></div>
                       </div>
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentView;
