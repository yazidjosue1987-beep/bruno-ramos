import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { User, UserRole } from './types';
import Login from './components/Login';
import LayoutWrapper from './components/Layout';
import StudentView from './components/StudentView';
import TeacherView from './components/TeacherView';
import AdminView from './components/AdminView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return <AdminView user={user} />;
      case UserRole.TEACHER:
        return <TeacherView user={user} />;
      case UserRole.STUDENT:
        return <StudentView user={user} />;
      default:
        return <div className="p-10 text-center text-slate-500">Rol desconocido</div>;
    }
  };

  return (
    <HashRouter>
      <LayoutWrapper user={user} onLogout={handleLogout}>
        {renderDashboard()}
      </LayoutWrapper>
    </HashRouter>
  );
};

export default App;
