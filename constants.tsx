
import React from 'react';
import { ShiftType, OperationalRole } from './types';

export const APP_BLUE = '#184E77'; // Institutional Blue
export const APP_ACCENT = '#1E6091';

export const SHIFT_HOURS = {
  [ShiftType.MORNING]: { start: '07:00', end: '15:00' },
  [ShiftType.AFTERNOON]: { start: '13:00', end: '21:00' },
  [ShiftType.CLOSING]: { start: '15:00', end: '23:00' }, // Standard closing example
  [ShiftType.OFF]: { start: '00:00', end: '00:00' },
  [ShiftType.VACATION]: { start: '00:00', end: '00:00' },
};

export const DAYS_SPANISH = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado'
];

export const AREAS = [
  'Mostrador',
  'Cocina',
  'Almacén',
  'Limpieza',
  'Caja',
  'Administración'
];

export const OPERATIONAL_ROLES: OperationalRole[] = [
  'Mostrador',
  'Caja',
  'Papelería / Servicios',
  'Bodega',
  'Operaciones Especiales',
  'Entregas a Domicilio',
  'Contenido / Redes'
];

export const SHIFT_COLORS = {
  [ShiftType.MORNING]: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  [ShiftType.AFTERNOON]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ShiftType.CLOSING]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ShiftType.OFF]: 'bg-slate-100 text-slate-500 border-slate-200',
  [ShiftType.VACATION]: 'bg-amber-100 text-amber-800 border-amber-200',
};
