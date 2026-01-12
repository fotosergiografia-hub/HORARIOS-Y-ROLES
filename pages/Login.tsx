
import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User, UserRole } from '../types';
import { APP_BLUE } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      if (!user.isActive) {
        setError('Este usuario ha sido desactivado.');
        return;
      }
      onLogin(user);
    } else {
      setError('Credenciales incorrectas.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center" style={{ backgroundColor: APP_BLUE }}>
          <h1 className="text-3xl font-bold text-white mb-2">Asistencia 18</h1>
          <p className="text-blue-100 opacity-80">Control de personal y horarios</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Ej: admin18 o 18-Nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{ backgroundColor: APP_BLUE }}
            className="w-full py-4 rounded-xl text-white font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Uso restringido para personal autorizado.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
