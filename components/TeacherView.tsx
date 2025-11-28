
import React, { useState, useEffect } from 'react';
import { User, Course, UserRole } from '../types';
import { getTeacherCourses, MOCK_USERS, MOCK_GRADES } from '../services/dataService';
import { BookCheck, Send, UserCheck, CheckCircle } from 'lucide-react';

interface TeacherViewProps {
  user: User;
}

const TeacherView: React.FC<TeacherViewProps> = ({ user }) => {
  const myCourses = getTeacherCourses(user.id);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades'>('attendance');
  const [tempGrades, setTempGrades] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Set default course on load
  useEffect(() => {
    if (myCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(myCourses[0]);
    }
  }, [myCourses, selectedCourse]);
  
  // Filter students based on the selected course's section (Grade)
  const students = selectedCourse 
    ? MOCK_USERS.filter(u => u.role === UserRole.STUDENT && u.grade === selectedCourse.section)
    : [];

  const handleGradeChange = (studentId: string, value: string) => {
    setTempGrades(prev => ({
      ...prev,
      [studentId]: parseInt(value) || 0
    }));
    setSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Here you would normally update MOCK_GRADES, but for now we just show visual feedback
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel Docente</h2>
          <p className="text-slate-500">Gestión académica y control de aula.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
           <select 
            className="w-full md:w-64 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => {
              setSelectedCourse(myCourses.find(c => c.id === e.target.value) || null);
              setSaveSuccess(false);
              setTempGrades({});
            }}
            value={selectedCourse?.id || ''}
           >
             <option value="" disabled>Seleccionar Curso...</option>
             {myCourses.map(c => (
               <option key={c.id} value={c.id}>
                 {c.name} - {c.section}
               </option>
             ))}
           </select>
        </div>
      </div>

      {!selectedCourse && (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
           <p className="text-slate-500">Seleccione un curso para comenzar a gestionar.</p>
        </div>
      )}

      {selectedCourse && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'attendance' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserCheck size={20} />
              <span className="font-medium">Asistencia</span>
            </button>
            <button 
              onClick={() => setActiveTab('grades')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'grades' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookCheck size={20} />
              <span className="font-medium">Notas</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex justify-between items-center">
              <span>{activeTab === 'attendance' ? 'Registro de Asistencia' : 'Registro de Calificaciones'}</span>
              <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{selectedCourse.section}</span>
            </h3>

            {students.length === 0 && (
              <p className="text-slate-500 text-center py-10">No hay estudiantes registrados en {selectedCourse.section}.</p>
            )}

            {students.length > 0 && activeTab === 'attendance' && (
              <div className="space-y-4">
                {students.map(student => (
                  <div key={student.id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-50 rounded-lg gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-white" />
                      <div>
                        <p className="font-medium text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition">Presente</button>
                      <button className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition">Ausente</button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex justify-end">
                   <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                     <Send size={16} /> Guardar Asistencia
                   </button>
                </div>
              </div>
            )}

            {students.length > 0 && activeTab === 'grades' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                     <tr className="text-left text-sm text-slate-500 border-b">
                       <th className="pb-3 pl-2">Estudiante</th>
                       <th className="pb-3">Nota Actual</th>
                       <th className="pb-3">Nueva Nota (0-20)</th>
                       <th className="pb-3 text-right">Estado</th>
                     </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const grade = MOCK_GRADES.find(g => g.studentId === student.id && g.courseId === selectedCourse.id);
                      const currentScore = grade ? grade.score : 0;
                      return (
                        <tr key={student.id} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="py-3 pl-2 font-medium text-slate-800">{student.name}</td>
                          <td className="py-3">
                             <span className={`px-2 py-0.5 rounded text-xs ${currentScore >= 11 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                               {currentScore} / 20
                             </span>
                          </td>
                          <td className="py-3">
                            <input 
                              type="number" 
                              min="0" 
                              max="20" 
                              value={tempGrades[student.id] !== undefined ? tempGrades[student.id] : ''}
                              onChange={(e) => handleGradeChange(student.id, e.target.value)}
                              className="w-20 p-2 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="-" 
                            />
                          </td>
                          <td className="py-3 text-right">
                             {tempGrades[student.id] !== undefined ? (
                               <span className="text-xs text-amber-600 font-medium">Pendiente</span>
                             ) : (
                               <span className="text-xs text-slate-400">Sin cambios</span>
                             )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-end items-center gap-4">
                  {saveSuccess && (
                     <span className="text-green-600 text-sm flex items-center gap-1 animate-in fade-in">
                       <CheckCircle size={16} /> Cambios guardados
                     </span>
                  )}
                  <button 
                    onClick={handleSave}
                    disabled={isSaving || Object.keys(tempGrades).length === 0}
                    className="bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    {isSaving ? 'Guardando...' : 'Actualizar Notas'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherView;
