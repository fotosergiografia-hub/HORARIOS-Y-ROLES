
export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum ShiftType {
  MORNING = 'MORNING', // 7:00 - 15:00
  AFTERNOON = 'AFTERNOON', // 13:00 - 21:00
  CLOSING = 'CLOSING', // Custom
  OFF = 'OFF',
  VACATION = 'VACATION'
}

export enum AttendanceStatus {
  OUT = 'OUT',
  WORKING = 'WORKING',
  MEAL_BREAK = 'MEAL_BREAK'
}

export type OperationalRole = 
  | 'Mostrador' 
  | 'Caja' 
  | 'Papelería / Servicios' 
  | 'Bodega' 
  | 'Operaciones Especiales' 
  | 'Entregas a Domicilio' 
  | 'Contenido / Redes';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  password?: string;
  shiftType: ShiftType;
  areas: string[];
  daysOff: number[]; // 0 (Sunday) to 6 (Saturday)
  isActive: boolean;
  createdAt: string;
  primaryRole?: OperationalRole;
  secondaryRole?: OperationalRole;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  clockIn?: string; // ISO String
  mealStart?: string;
  mealEnd?: string;
  clockOut?: string;
  isLate: boolean;
  totalMinutes: number;
}

export interface WeeklyRoster {
  userId: string;
  weekStarting: string; // YYYY-MM-DD (Sunday)
  assignments: {
    [day: number]: { // 0 to 6
      shift: ShiftType;
      area: string;
    }
  };
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminId: string;
}
