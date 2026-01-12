
import { AttendanceRecord, ShiftType, AttendanceStatus, User } from '../types';
import { SHIFT_HOURS } from '../constants';
import { StorageService } from './storage';

export const AttendanceService = {
  getTodayRecord(userId: string): AttendanceRecord | undefined {
    const today = new Date().toISOString().split('T')[0];
    return StorageService.getAttendance().find(r => r.userId === userId && r.date === today);
  },

  getStatus(record?: AttendanceRecord): AttendanceStatus {
    if (!record || !record.clockIn) return AttendanceStatus.OUT;
    if (record.clockOut) return AttendanceStatus.OUT;
    if (record.mealStart && !record.mealEnd) return AttendanceStatus.MEAL_BREAK;
    return AttendanceStatus.WORKING;
  },

  clockIn(user: User): string {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    // Check if late
    const shift = SHIFT_HOURS[user.shiftType];
    const [hours, minutes] = shift.start.split(':').map(Number);
    const shiftStartTime = new Date();
    shiftStartTime.setHours(hours, minutes, 0, 0);
    
    const isLate = now > shiftStartTime;

    const record: AttendanceRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      date: today,
      clockIn: now.toISOString(),
      isLate,
      totalMinutes: 0
    };

    StorageService.saveAttendance(record);
    return `Entrada registrada a las ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  },

  mealStart(recordId: string) {
    const records = StorageService.getAttendance();
    const record = records.find(r => r.id === recordId);
    if (record) {
      record.mealStart = new Date().toISOString();
      StorageService.saveAttendance(record);
    }
  },

  mealEnd(recordId: string) {
    const records = StorageService.getAttendance();
    const record = records.find(r => r.id === recordId);
    if (record) {
      record.mealEnd = new Date().toISOString();
      StorageService.saveAttendance(record);
    }
  },

  clockOut(recordId: string) {
    const records = StorageService.getAttendance();
    const record = records.find(r => r.id === recordId);
    if (record && record.clockIn) {
      const now = new Date();
      record.clockOut = now.toISOString();
      
      const start = new Date(record.clockIn);
      let diff = (now.getTime() - start.getTime()) / 60000;
      
      // Subtract meal time if exists
      if (record.mealStart && record.mealEnd) {
        const mStart = new Date(record.mealStart);
        const mEnd = new Date(record.mealEnd);
        const mealDiff = (mEnd.getTime() - mStart.getTime()) / 60000;
        diff -= mealDiff;
      }
      
      record.totalMinutes = Math.max(0, Math.round(diff));
      StorageService.saveAttendance(record);
    }
  },

  getWeeklyStats(userId: string) {
    const now = new Date();
    const currentDay = now.getDay();
    const diffToSunday = currentDay;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToSunday);
    startOfWeek.setHours(0,0,0,0);

    const records = StorageService.getAttendance().filter(r => {
      const recordDate = new Date(r.date);
      return r.userId === userId && recordDate >= startOfWeek;
    });

    const totalMinutes = records.reduce((acc, r) => acc + (r.totalMinutes || 0), 0);
    const lates = records.filter(r => r.isLate).length;

    return {
      hours: (totalMinutes / 60).toFixed(1),
      days: records.length,
      lates
    };
  }
};
