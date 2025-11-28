
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../services/dataService';
import { Lock, User as UserIcon, GraduationCap, School, Eye, EyeOff, Info } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  // Filter users based on selected role for the helper view
  const availableUsers = MOCK_USERS.filter(u => u.role === selectedRole);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor ingrese correo y contraseña.');
      return;
    }

    // 1. Find user by email
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setError('Usuario no encontrado en la base de datos.');
      return;
    }

    // 2. Check Role
    if (user.role !== selectedRole) {
      setError(`Este correo pertenece a un ${user.role}, por favor cambie la pestaña de rol.`);
      return;
    }

    // 3. Check Password (Password must be the User's Name)
    // We trim and lowercase to make it user-friendly
    if (password.trim().toLowerCase() !== user.name.toLowerCase()) {
      setError('Contraseña incorrecta. Su contraseña es su nombre completo (Ej: Mateo Silva).');
      return;
    }

    // Success
    onLogin(user);
  };

  const fillCredentials = (u: User) => {
    setEmail(u.email);
    setPassword(u.name);
    setShowCredentials(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-900 p-8 text-center relative">
          <div className="mx-auto bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <School className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Colegio Científico del Norte</h1>
          <p className="text-blue-200 text-sm mt-2">Plataforma de Gestión Académica</p>
        </div>

        <div className="p-8">
          {/* Role Selector */}
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
            {[
              { role: UserRole.STUDENT, icon: GraduationCap, label: 'Alumno' },
              { role: UserRole.TEACHER, icon: UserIcon, label: 'Docente' },
              { role: UserRole.ADMIN, icon: Lock, label: 'Admin' }
            ].map((tab) => (
              <button
                key={tab.role}
                onClick={() => { 
                  setSelectedRole(tab.role); 
                  setError(''); 
                  setEmail(''); 
                  setPassword(''); 
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                  selectedRole === tab.role 
                    ? 'bg-white text-blue-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={availableUsers[0]?.email || "correo@colegio.edu"}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase mb-1">
                Contraseña (Su Nombre Completo)
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={availableUsers[0]?.name || "Ej: Mateo Silva"}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Info size={10} /> La contraseña es el nombre completo del usuario.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Helper Section for Demo */}
          <div className="mt-6 border-t pt-4 text-center">
            <button 
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="text-xs text-blue-600 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              {showCredentials ? <EyeOff size={12}/> : <Eye size={12}/>}
              {showCredentials ? 'Ocultar Credenciales Demo' : 'Ver Credenciales Disponibles (Demo)'}
            </button>

            {showCredentials && (
              <div className="mt-3 text-left bg-slate-50 p-3 rounded-lg border border-slate-200 max-h-40 overflow-y-auto text-xs">
                <p className="font-bold text-slate-700 mb-2">Usuarios Registrados ({selectedRole}):</p>
                <div className="space-y-2">
                  {availableUsers.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => fillCredentials(u)}
                      className="p-2 bg-white border rounded cursor-pointer hover:bg-blue-50 transition flex flex-col group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-blue-700">{u.name}</span>
                      <span className="text-slate-500">{u.email}</span>
                      <span className="text-[10px] text-slate-400 italic mt-1">Click para usar</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center border-t border-slate-100 pt-4">
             <p className="text-[10px] text-slate-400">Desarrollado por</p>
             <p className="text-xs font-bold text-slate-600">Bruno Contty Ramos La Jara</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
