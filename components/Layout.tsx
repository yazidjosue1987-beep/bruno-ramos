
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  LogOut, 
  Menu, 
  X, 
  Layout, 
  BookOpen, 
  Users, 
  Settings, 
  Bell,
  GraduationCap
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const LayoutWrapper: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getMenuItems = () => {
    switch(user.role) {
      case UserRole.ADMIN:
        return [
          { icon: Layout, label: 'Dashboard' },
          { icon: Users, label: 'Usuarios' },
          { icon: BookOpen, label: 'Cursos' },
          { icon: Settings, label: 'Configuración' },
        ];
      case UserRole.TEACHER:
        return [
          { icon: Layout, label: 'Clases' },
          { icon: Users, label: 'Estudiantes' },
          { icon: BookOpen, label: 'Recursos' },
        ];
      case UserRole.STUDENT:
        // Student navigation is handled within the StudentView tabs
        return [];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap size={24} className="text-white" />
             </div>
             <div>
               <h1 className="font-bold text-lg leading-tight">Científico<br/>Del Norte</h1>
             </div>
             <button 
               className="ml-auto lg:hidden text-slate-400"
               onClick={() => setSidebarOpen(false)}
             >
               <X size={20} />
             </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Menu Principal
              </div>
            )}
            {menuItems.map((item, idx) => (
              <button 
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
             <button 
               onClick={onLogout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors"
             >
               <LogOut size={18} />
               Cerrar Sesión
             </button>
             
             <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500">Desarrollado por</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Bruno Contty Ramos La Jara</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex-1 px-4 lg:px-0">
             <h2 className="text-sm font-medium text-slate-500">
               {user.role === UserRole.ADMIN ? 'Administración' : user.role === UserRole.TEACHER ? 'Sala de Profesores' : 'Portal Estudiantil'}
             </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                 <p className="text-xs text-slate-500 mt-1">{user.email}</p>
               </div>
               <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
           {children}
        </div>
      </main>
    </div>
  );
};

export default LayoutWrapper;
