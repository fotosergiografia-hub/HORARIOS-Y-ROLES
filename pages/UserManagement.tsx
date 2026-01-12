
import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { User, UserRole, ShiftType, OperationalRole } from '../types';
import { StorageService } from '../services/storage';
import { AREAS, OPERATIONAL_ROLES } from '../constants';

interface Props {
  user: User;
  onLogout: () => void;
}

const UserManagement: React.FC<Props> = ({ user, onLogout }) => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    shiftType: ShiftType.MORNING,
    isActive: true,
    primaryRole: undefined as OperationalRole | undefined,
    secondaryRole: undefined as OperationalRole | undefined
  });

  const handleOpenModal = (u?: User) => {
    if (u) {
      setEditingUser(u);
      setFormData({
        username: u.username,
        fullName: u.fullName,
        password: u.password || '',
        shiftType: u.shiftType,
        isActive: u.isActive,
        primaryRole: u.primaryRole,
        secondaryRole: u.secondaryRole
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '18-',
        fullName: '',
        password: '',
        shiftType: ShiftType.MORNING,
        isActive: true,
        primaryRole: undefined,
        secondaryRole: undefined
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: editingUser ? editingUser.id : crypto.randomUUID(),
      role: UserRole.EMPLOYEE,
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString(),
      areas: editingUser ? editingUser.areas : [], // Maintain existing areas or default to empty
      daysOff: editingUser ? editingUser.daysOff : [], // Maintain existing or default
      ...formData
    };

    StorageService.saveUser(newUser);
    setUsers(StorageService.getUsers());
    setIsModalOpen(false);
  };

  const toggleStatus = (u: User) => {
    if (u.id === 'root-admin') return;
    const updated = { ...u, isActive: !u.isActive };
    StorageService.saveUser(updated);
    setUsers(StorageService.getUsers());
  };

  return (
    <AdminLayout user={user} onLogout={onLogout}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestión de Personal</h2>
          <p className="text-slate-500">Administra empleados y sus roles operativos</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
        >
          Nuevo Empleado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.filter(u => u.role === UserRole.EMPLOYEE).map(u => (
          <div key={u.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${u.isActive ? 'border-slate-100' : 'border-red-100 opacity-75'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                {u.fullName.charAt(0)}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(u)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold"
                >
                  Editar
                </button>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-1">{u.fullName}</h3>
            <p className="text-slate-400 text-sm mb-4">{u.username}</p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rol Principal:</span>
                <span className="font-semibold text-blue-700">{u.primaryRole || 'No asignado'}</span>
              </div>
              {u.secondaryRole && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Rol Secundario:</span>
                  <span className="font-medium text-slate-600">{u.secondaryRole}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Turno:</span>
                <span className="font-medium text-slate-700">{u.shiftType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estado:</span>
                <span className={`font-bold ${u.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {u.isActive ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>
            </div>

            <button
              onClick={() => toggleStatus(u)}
              className={`w-full py-2 rounded-lg text-sm font-semibold border ${u.isActive ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-500 hover:bg-green-50'}`}
            >
              {u.isActive ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">
                {editingUser ? 'Editar Empleado' : 'Nuevo Empleado'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nombre Completo</label>
                  <input
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nombre y Apellido"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Usuario (18-)</label>
                  <input
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Contraseña</label>
                  <input
                    required
                    type="password"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rol Principal</label>
                  <select
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    value={formData.primaryRole || ''}
                    onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value as OperationalRole })}
                  >
                    <option value="" disabled>Seleccionar rol</option>
                    {OPERATIONAL_ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Rol Secundario (Opcional)</label>
                  <select
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    value={formData.secondaryRole || ''}
                    onChange={(e) => setFormData({ ...formData, secondaryRole: e.target.value ? (e.target.value as OperationalRole) : undefined })}
                  >
                    <option value="">Ninguno</option>
                    {OPERATIONAL_ROLES
                      .filter(role => role !== formData.primaryRole)
                      .map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Turno Predeterminado</label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value as ShiftType })}
                >
                  {Object.values(ShiftType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UserManagement;
