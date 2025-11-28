import React, { useState } from 'react';
import { User, SchoolStats, UserRole } from '../types';
import { getStats, MOCK_ANNOUNCEMENTS, MOCK_USERS } from '../services/dataService';
import { generateSchoolReport } from '../services/geminiService';
import { LayoutDashboard, Users, School, FileText, Sparkles, Loader2, Plus, Phone, MapPin, Mail, UserPlus, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminViewProps {
  user: User;
}

const AdminView: React.FC<AdminViewProps> = ({ user }) => {
  const stats = getStats();
  const [report, setReport] = useState<string | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students'>('dashboard');
  const [showAddStudent, setShowAddStudent] = useState(false);

  // Filter students for the list
  const studentList = MOCK_USERS.filter(u => u.role === UserRole.STUDENT);

  // Mock data for chart
  const data = [
    { name: 'Matemáticas', avg: 85 },
    { name: 'Física', avg: 72 },
    { name: 'Literatura', avg: 91 },
    { name: 'Historia', avg: 88 },
    { name: 'Química', avg: 76 },
  ];

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    const result = await generateSchoolReport(stats, MOCK_ANNOUNCEMENTS[0].content);
    setReport(result);
    setLoadingReport(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Panel de Control General</h2>
          <p className="text-slate-300">Bienvenido, {user.name}.</p>
        </div>
        
        {/* Navigation Tabs inside Header */}
        <div className="relative z-10 flex gap-2 mt-4 md:mt-0 bg-slate-800/50 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'students' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white'}`}
          >
            Gestión de Alumnos
          </button>
        </div>

        <div className="absolute top-0 right-0 p-8 opacity-10">
           <School size={120} />
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Estudiantes</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalStudents}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                 <School size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Docentes</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalTeachers}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                 <FileText size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Promedio General</p>
                <p className="text-2xl font-bold text-slate-800">{stats.averageGrade}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                 <LayoutDashboard size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Asistencia</p>
                <p className="text-2xl font-bold text-slate-800">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-96">
              <h3 className="font-bold text-slate-800 mb-6">Rendimiento por Asignatura</h3>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                     {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.avg > 80 ? '#3b82f6' : entry.avg > 70 ? '#6366f1' : '#f43f5e'} />
                     ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Report Section */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-indigo-500" />
                   <h3 className="font-bold text-slate-800">Reporte IA Gemini</h3>
                 </div>
              </div>
              
              <div className="flex-grow bg-slate-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-[300px] border border-slate-100">
                {loadingReport ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <p className="text-sm">Analizando datos escolares...</p>
                  </div>
                ) : report ? (
                  <div className="prose prose-sm prose-slate">
                    <ReactMarkdown>{report}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 text-center mt-10">
                    Genera un análisis estratégico basado en los datos actuales del colegio.
                  </p>
                )}
              </div>

              <button 
                onClick={handleGenerateReport}
                disabled={loadingReport}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingReport ? 'Generando...' : 'Generar Reporte Ejecutivo'}
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Directorio de Alumnos</h3>
              <p className="text-sm text-slate-500">Gestión de matrícula y datos familiares</p>
            </div>
            <button 
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition"
            >
              {showAddStudent ? 'Cancelar' : <><UserPlus size={16} /> Registrar Alumno</>}
            </button>
          </div>

          {/* Registration Form */}
          {showAddStudent && (
            <div className="bg-blue-50/50 p-6 border-b border-blue-100 animate-in slide-in-from-top-4">
              <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Info size={18} /> Datos de Registro
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Datos del Alumno</h5>
                  <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="Nombres" className="p-2 border rounded text-sm w-full" />
                     <input type="text" placeholder="Apellidos" className="p-2 border rounded text-sm w-full" />
                  </div>
                  <input type="email" placeholder="Correo Electrónico (Institucional)" className="p-2 border rounded text-sm w-full" />
                  <select className="p-2 border rounded text-sm w-full">
                    <option>Seleccionar Grado...</option>
                    <option>Inicial 3 Años</option>
                    <option>1ro Primaria</option>
                    <option>1ro Secundaria</option>
                    {/* ... other options ... */}
                  </select>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Datos de los Padres</h5>
                  <div className="grid grid-cols-2 gap-4">
                     <input type="text" placeholder="Nombre del Padre" className="p-2 border rounded text-sm w-full" />
                     <input type="text" placeholder="Teléfono Padre" className="p-2 border rounded text-sm w-full" />
                  </div>
                  <input type="email" placeholder="Correo del Padre" className="p-2 border rounded text-sm w-full" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                     <input type="text" placeholder="Nombre de la Madre" className="p-2 border rounded text-sm w-full" />
                     <input type="text" placeholder="Teléfono Madre" className="p-2 border rounded text-sm w-full" />
                  </div>
                  <input type="email" placeholder="Correo de la Madre" className="p-2 border rounded text-sm w-full" />
                </div>

                <div className="md:col-span-2 space-y-4 mt-2">
                   <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b pb-1">Ubicación</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Dirección de Domicilio" className="p-2 border rounded text-sm w-full" />
                      <input type="text" placeholder="Referencia de Ubicación" className="p-2 border rounded text-sm w-full" />
                   </div>
                </div>

                <div className="md:col-span-2 flex justify-end mt-4">
                  <button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-blue-700">
                    Guardar Registro
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Student List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="p-4">Alumno</th>
                  <th className="p-4">Grado</th>
                  <th className="p-4">Padres / Apoderados</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Dirección</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentList.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={student.avatar} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                        <span className="font-medium text-slate-800">{student.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                        {student.grade}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {student.parentDetails ? (
                        <div className="space-y-1">
                          <p><span className="font-medium">P:</span> {student.parentDetails.fatherName}</p>
                          <p><span className="font-medium">M:</span> {student.parentDetails.motherName}</p>
                        </div>
                      ) : <span className="text-slate-400 italic">No registrado</span>}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {student.parentDetails ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1"><Phone size={12} className="text-slate-400"/> {student.parentDetails.fatherPhone} / {student.parentDetails.motherPhone}</div>
                          <div className="flex items-center gap-1"><Mail size={12} className="text-slate-400"/> {student.parentDetails.fatherEmail}</div>
                        </div>
                      ) : <span className="text-slate-400 italic">-</span>}
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs">
                       {student.parentDetails ? (
                        <div className="flex items-start gap-1">
                          <MapPin size={12} className="text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <p>{student.parentDetails.address}</p>
                            <p className="text-xs text-slate-400 mt-0.5">Ref: {student.parentDetails.reference}</p>
                          </div>
                        </div>
                       ) : <span className="text-slate-400 italic">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;