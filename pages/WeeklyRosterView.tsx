
import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, UserRole, ShiftType, WeeklyRoster } from '../types';
import { StorageService } from '../services/storage';
import { DAYS_SPANISH, AREAS, SHIFT_COLORS } from '../constants';

interface Props {
  user: User;
  onLogout: () => void;
}

const WeeklyRosterView: React.FC<Props> = ({ user, onLogout }) => {
  const employees = StorageService.getUsers().filter(u => u.role === UserRole.EMPLOYEE);
  const [rosters, setRosters] = useState<WeeklyRoster[]>(StorageService.getRosters());
  
  // Calculate current week (starting Sunday)
  const currentWeekStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().split('T')[0];
  }, []);

  const [selectedWeek, setSelectedWeek] = useState(currentWeekStart);

  const getRosterForUser = (userId: string) => {
    return rosters.find(r => r.userId === userId && r.weekStarting === selectedWeek) || {
      userId,
      weekStarting: selectedWeek,
      assignments: {}
    };
  };

  const updateRoster = (userId: string, day: number, shift: ShiftType, area: string) => {
    const existing = getRosterForUser(userId);
    const updated: WeeklyRoster = {
      ...existing,
      assignments: {
        ...existing.assignments,
        [day]: { shift, area }
      }
    };
    StorageService.saveRoster(updated);
    setRosters(StorageService.getRosters());
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Rol Semanal</h2>
          <p className="text-slate-500">Programación de turnos y áreas</p>
        </div>
        <div className="flex items-center gap-4">
           <span className="text-sm font-medium text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100">Semana del: {selectedWeek}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="roster-scroll overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 bg-slate-50 sticky left-0 z-10 w-56 text-left text-xs uppercase text-slate-400 font-bold border-r border-slate-100">Empleado / Rol</th>
                {DAYS_SPANISH.map((day, i) => (
                  <th key={day} className="p-4 min-w-[140px] text-xs uppercase text-slate-500 font-bold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map(emp => {
                const roster = getRosterForUser(emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sticky left-0 bg-white z-10 border-r border-slate-100 text-left">
                      <div className="font-bold text-slate-800 text-sm truncate">{emp.fullName}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        <div className="text-[9px] text-blue-600 font-bold uppercase tracking-tighter">P: {emp.primaryRole || 'N/A'}</div>
                        {emp.secondaryRole && (
                          <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">S: {emp.secondaryRole}</div>
                        )}
                      </div>
                    </td>
                    {DAYS_SPANISH.map((_, i) => {
                      const assign = roster.assignments[i] || { shift: ShiftType.OFF, area: AREAS[0] };
                      return (
                        <td key={i} className="p-2 align-top">
                          <div className="flex flex-col gap-1">
                            <select
                              className={`text-[11px] font-bold py-1 px-2 rounded-lg border-2 appearance-none text-center cursor-pointer focus:ring-2 focus:ring-blue-200 outline-none transition-all ${SHIFT_COLORS[assign.shift]}`}
                              value={assign.shift}
                              onChange={(e) => updateRoster(emp.id, i, e.target.value as ShiftType, assign.area)}
                            >
                              {Object.values(ShiftType).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            
                            {assign.shift !== ShiftType.OFF && assign.shift !== ShiftType.VACATION && (
                              <select
                                className="text-[10px] py-1 px-2 rounded border border-slate-200 bg-white text-slate-600 outline-none focus:border-blue-400"
                                value={assign.area}
                                onChange={(e) => updateRoster(emp.id, i, assign.shift, e.target.value)}
                              >
                                {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                              </select>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(SHIFT_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${color.split(' ')[0]}`}></div>
            <span className="text-xs font-medium text-slate-500 uppercase">{key}</span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default WeeklyRosterView;
