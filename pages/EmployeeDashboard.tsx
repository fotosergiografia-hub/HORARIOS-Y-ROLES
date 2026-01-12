
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../types';
import { AttendanceService } from '../services/attendance';
import { APP_BLUE, SHIFT_HOURS } from '../constants';

interface Props {
  user: User;
  onLogout: () => void;
}

const EmployeeDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const [record, setRecord] = useState<AttendanceRecord | undefined>(undefined);
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.OUT);
  const [stats, setStats] = useState({ hours: '0.0', days: 0, lates: 0 });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const todayRecord = AttendanceService.getTodayRecord(user.id);
    setRecord(todayRecord);
    setStatus(AttendanceService.getStatus(todayRecord));
    setStats(AttendanceService.getWeeklyStats(user.id));
  }, [user.id]);

  const refresh = (msg?: string) => {
    const todayRecord = AttendanceService.getTodayRecord(user.id);
    setRecord(todayRecord);
    setStatus(AttendanceService.getStatus(todayRecord));
    setStats(AttendanceService.getWeeklyStats(user.id));
    if (msg) {
      setMessage(msg);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleAction = (action: 'in' | 'meal_start' | 'meal_end' | 'out') => {
    switch (action) {
      case 'in':
        const msg = AttendanceService.clockIn(user);
        refresh(msg);
        break;
      case 'meal_start':
        if (record) AttendanceService.mealStart(record.id);
        refresh("Salida a comida registrada.");
        break;
      case 'meal_end':
        if (record) AttendanceService.mealEnd(record.id);
        refresh("Regreso de comida registrado.");
        break;
      case 'out':
        if (record) AttendanceService.clockOut(record.id);
        refresh("Salida de turno registrada.");
        break;
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case AttendanceStatus.OUT: return <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">Fuera</span>;
      case AttendanceStatus.WORKING: return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Trabajando</span>;
      case AttendanceStatus.MEAL_BREAK: return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">En Comida</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hola, {user.fullName}</h1>
          <p className="text-slate-500">Panel de Asistencia</p>
        </div>
        <button onClick={onLogout} className="text-slate-400 hover:text-red-500 transition-colors">
          Cerrar Sesión
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-6 text-center">
        <div className="mb-4">{renderStatusBadge()}</div>
        <div className="text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Turno Asignado</div>
        <div className="text-2xl font-bold text-slate-800 mb-6">
          {user.shiftType === 'OFF' ? 'Descanso' : `${SHIFT_HOURS[user.shiftType].start} - ${SHIFT_HOURS[user.shiftType].end}`}
        </div>

        {message && (
          <div className="mb-6 bg-blue-50 text-blue-700 p-4 rounded-2xl border border-blue-100 animate-pulse">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {status === AttendanceStatus.OUT && !record?.clockOut && (
            <button
              onClick={() => handleAction('in')}
              style={{ backgroundColor: APP_BLUE }}
              className="py-6 rounded-2xl text-white text-xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Marcar Entrada
            </button>
          )}

          {status === AttendanceStatus.WORKING && (
            <>
              <button
                onClick={() => handleAction('meal_start')}
                className="py-6 bg-amber-500 rounded-2xl text-white text-xl font-bold shadow-lg active:scale-95 transition-all"
              >
                Salida a Comida
              </button>
              <button
                onClick={() => handleAction('out')}
                className="py-6 bg-slate-800 rounded-2xl text-white text-xl font-bold shadow-lg active:scale-95 transition-all"
              >
                Marcar Salida
              </button>
            </>
          )}

          {status === AttendanceStatus.MEAL_BREAK && (
            <button
              onClick={() => handleAction('meal_end')}
              style={{ backgroundColor: APP_BLUE }}
              className="py-6 rounded-2xl text-white text-xl font-bold shadow-lg active:scale-95 transition-all"
            >
              Regreso de Comida
            </button>
          )}

          {record?.clockOut && (
            <div className="p-6 bg-slate-50 rounded-2xl text-slate-500 font-medium">
              Jornada completada por hoy.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-bold text-slate-800">{stats.hours}h</div>
          <div className="text-xs text-slate-400 uppercase">Horas Semanal</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-bold text-slate-800">{stats.days}</div>
          <div className="text-xs text-slate-400 uppercase">Días Laborados</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
          <div className="text-2xl font-bold text-red-500">{stats.lates}</div>
          <div className="text-xs text-slate-400 uppercase">Retardos</div>
        </div>
      </div>

      <div className="mt-auto text-center text-slate-300 text-sm">
        Asistencia 18 v1.0 • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
