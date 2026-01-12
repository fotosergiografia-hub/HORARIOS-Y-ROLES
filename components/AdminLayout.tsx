
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { APP_BLUE } from '../constants';

interface Props {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ user, onLogout, children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Rol Semanal', path: '/admin/roster' },
    { label: 'Empleados', path: '/admin/users' },
    { label: 'Reportes', path: '/admin/reports' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100" style={{ backgroundColor: APP_BLUE }}>
          <h1 className="text-white font-bold text-xl">Admin 18</h1>
          <p className="text-blue-100 text-xs opacity-70">Control Operativo</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition-all font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
              <p className="text-xs text-slate-400">Administrador</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center">
          <h1 className="font-bold text-blue-900">Admin 18</h1>
          <button onClick={onLogout} className="text-red-500 text-sm">Salir</button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
