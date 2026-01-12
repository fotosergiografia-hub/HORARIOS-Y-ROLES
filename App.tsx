
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { StorageService } from './services/storage';
import { User, UserRole } from './types';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import WeeklyRosterView from './pages/WeeklyRosterView';
import Reports from './pages/Reports';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StorageService.init();
    const session = StorageService.getCurrentSession();
    setUser(session);
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    StorageService.setSession(u);
  };

  const handleLogout = () => {
    setUser(null);
    StorageService.setSession(null);
  };

  if (loading) return null;

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
        />
        
        <Route 
          path="/" 
          element={
            user ? (
              user.role === UserRole.ADMIN ? 
              <AdminDashboard user={user} onLogout={handleLogout} /> : 
              <EmployeeDashboard user={user} onLogout={handleLogout} />
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/admin/users" 
          element={user?.role === UserRole.ADMIN ? <UserManagement user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        <Route 
          path="/admin/roster" 
          element={user?.role === UserRole.ADMIN ? <WeeklyRosterView user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        <Route 
          path="/admin/reports" 
          element={user?.role === UserRole.ADMIN ? <Reports user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
