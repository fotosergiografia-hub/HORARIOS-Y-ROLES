
import { User, UserRole, AttendanceRecord, WeeklyRoster, ShiftType } from '../types';

const KEYS = {
  USERS: 'asistencia_18_users',
  ATTENDANCE: 'asistencia_18_attendance',
  ROSTER: 'asistencia_18_roster',
  AUDIT: 'asistencia_18_audit',
  CURRENT_USER: 'asistencia_18_session'
};

// Initial Root Admin
const INITIAL_ADMIN: User = {
  id: 'root-admin',
  username: 'admin18',
  fullName: 'Administrador Principal',
  role: UserRole.ADMIN,
  password: 'PE18_admin_2024',
  shiftType: ShiftType.OFF,
  areas: ['Administración'],
  daysOff: [],
  isActive: true,
  createdAt: new Date().toISOString()
};

export const StorageService = {
  init() {
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([INITIAL_ADMIN]));
    }
    if (!localStorage.getItem(KEYS.ATTENDANCE)) localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.ROSTER)) localStorage.setItem(KEYS.ROSTER, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.AUDIT)) localStorage.setItem(KEYS.AUDIT, JSON.stringify([]));
  },

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUser(user: User) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  deleteUser(userId: string) {
    if (userId === 'root-admin') return; // Cannot delete root
    const users = this.getUsers().filter(u => u.id !== userId);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getAttendance(): AttendanceRecord[] {
    return JSON.parse(localStorage.getItem(KEYS.ATTENDANCE) || '[]');
  },

  saveAttendance(record: AttendanceRecord) {
    const records = this.getAttendance();
    const index = records.findIndex(r => r.id === record.id);
    if (index >= 0) {
      records[index] = record;
    } else {
      records.push(record);
    }
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(records));
  },

  getRosters(): WeeklyRoster[] {
    return JSON.parse(localStorage.getItem(KEYS.ROSTER) || '[]');
  },

  saveRoster(roster: WeeklyRoster) {
    const rosters = this.getRosters();
    const index = rosters.findIndex(r => r.userId === roster.userId && r.weekStarting === roster.weekStarting);
    if (index >= 0) {
      rosters[index] = roster;
    } else {
      rosters.push(roster);
    }
    localStorage.setItem(KEYS.ROSTER, JSON.stringify(rosters));
  },

  getCurrentSession(): User | null {
    const session = localStorage.getItem(KEYS.CURRENT_USER);
    return session ? JSON.parse(session) : null;
  },

  setSession(user: User | null) {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  }
};
