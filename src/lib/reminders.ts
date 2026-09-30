import { toIsoDate } from '@/lib/age';
import { visibleStreak } from '@/lib/streak';
import type { Streak } from '@/types/user';

export interface ReminderInput {
  readonly dailyReminder: { readonly enabled: boolean; readonly hour: number; readonly minute: number };
  readonly streakRisk: boolean;
  readonly streak: Streak;
  /** Último día (yyyy-mm-dd) con práctica, o null. */
  readonly lastPracticeDate: string | null;
}

export interface ReminderPlan {
  readonly daily: { readonly hour: number; readonly minute: number } | null;
  /** true si hay que avisar hoy de que la racha está en riesgo. */
  readonly streakRisk: boolean;
}

/** Decide qué notificaciones locales deben estar programadas según los ajustes y la práctica de hoy. */
export function reminderPlan(input: ReminderInput, now: Date = new Date()): ReminderPlan {
  const { dailyReminder } = input;
  const practicedToday = input.lastPracticeDate === toIsoDate(now);
  return {
    daily: dailyReminder.enabled ? { hour: dailyReminder.hour, minute: dailyReminder.minute } : null,
    streakRisk: input.streakRisk && !practicedToday && visibleStreak(input.streak, now) > 0,
  };
}

/** Horas que se ofrecen para el recordatorio diario. */
export const REMINDER_HOURS: readonly number[] = [8, 12, 16, 19, 21];

export function formatHour(hour: number, minute = 0): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
