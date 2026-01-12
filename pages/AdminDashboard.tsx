
import React, { useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, AttendanceRecord, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface Props {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ user, onLogout }) => {
  const users = StorageService.getUsers().filter(u => u.role === UserRole.EMPLOYEE);
  const attendance = StorageService.getAttendance();
  const todayStr = new Date().toISOString().split('T')[0];
  
  const stats = useMemo(() => {
    const todayRecords = attendance.filter(r => r.date === todayStr);
    const activeNow = todayRecords.filter(r => r.clockIn && !r.clockOut).length;
    const lates = todayRecords.filter(r => r.isLate).length;
    const absents = users.length - todayRecords.length;

    return {
      activeNow,
      lates,
      absents,
      totalToday: todayRecords.length
    };
  }, [attendance, users.length]);

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Resumen Diario</h2>
        <p className="text-slate-500">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-blue-600 text-xs font-bold uppercase mb-2">Activos Ahora</div>
          <div className="text-4xl font-bold text-slate-800">{stats.activeNow}</div>
          <p className="text-xs text-slate-400 mt-2">Empleados en turno</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-emerald-600 text-xs font-bold uppercase mb-2">Asistencia Total</div>
          <div className="text-4xl font-bold text-slate-800">{stats.totalToday}</div>
          <p className="text-xs text-slate-400 mt-2">Registros de hoy</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-red-600 text-xs font-bold uppercase mb-2">Retardos</div>
          <div className="text-4xl font-bold text-slate-800">{stats.lates}</div>
          <p className="text-xs text-slate-400 mt-2">Incidencias hoy</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-slate-400 text-xs font-bold uppercase mb-2">Ausencias</div>
          <div className="text-4xl font-bold text-slate-800">{stats.absents}</div>
          <p className="text-xs text-slate-400 mt-2">Faltas probables</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Personal Activo Hoy</h3>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Última actualización: hace un momento</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Turno</th>
                <th className="px-6 py-4">Entrada</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Puntualidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => {
                const record = attendance.find(r => r.userId === u.id && r.date === todayStr);
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{u.fullName}</div>
                      <div className="text-xs text-slate-400">{u.username}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {u.shiftType}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {record?.clockIn ? new Date(record.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      {!record ? (
                        <span className="text-slate-400 text-xs italic">No ha llegado</span>
                      ) : record.clockOut ? (
                        <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs">Finalizado</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Trabajando</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record ? (
                        record.isLate ? (
                          <span className="text-red-500 text-xs font-bold">RETARDO</span>
                        ) : (
                          <span className="text-emerald-500 text-xs font-bold">PUNTUAL</span>
                        )
                      ) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
