
import React, { useMemo, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, UserRole, AttendanceRecord } from '../types';
import { StorageService } from '../services/storage';

interface Props {
  user: User;
  onLogout: () => void;
}

const Reports: React.FC<Props> = ({ user, onLogout }) => {
  const users = StorageService.getUsers().filter(u => u.role === UserRole.EMPLOYEE);
  const attendance = StorageService.getAttendance();
  const [timeFilter, setTimeFilter] = useState('all'); // simplified for demo

  const reportData = useMemo(() => {
    return users.map(u => {
      const userRecords = attendance.filter(r => r.userId === u.id);
      const totalMinutes = userRecords.reduce((acc, r) => acc + (r.totalMinutes || 0), 0);
      const totalLates = userRecords.filter(r => r.isLate).length;
      const totalDays = userRecords.length;
      
      return {
        ...u,
        totalHours: (totalMinutes / 60).toFixed(1),
        totalLates,
        totalDays,
        punctualityRate: totalDays > 0 ? Math.round(((totalDays - totalLates) / totalDays) * 100) : 100
      };
    });
  }, [users, attendance]);

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reportes de Personal</h2>
          <p className="text-slate-500">Métricas de desempeño y puntualidad</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-400">
                <th className="px-6 py-4">Empleado</th>
                <th className="px-6 py-4">Horas Totales</th>
                <th className="px-6 py-4">Días Laborados</th>
                <th className="px-6 py-4">Retardos</th>
                <th className="px-6 py-4">Puntualidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map(data => (
                <tr key={data.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{data.fullName}</div>
                    <div className="text-xs text-slate-400">{data.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-slate-700">{data.totalHours}h</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {data.totalDays}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${data.totalLates > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                      {data.totalLates}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${data.punctualityRate > 90 ? 'bg-emerald-500' : data.punctualityRate > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${data.punctualityRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{data.punctualityRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-blue-900">Analítica Avanzada</h4>
          <p className="text-blue-700/70 text-sm">Pronto podrás ver comparativas semanales y tendencias de asistencia.</p>
        </div>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200">
          Activar Premium
        </button>
      </div>
    </AdminLayout>
  );
};

export default Reports;
