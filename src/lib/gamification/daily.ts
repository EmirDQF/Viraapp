/** Meta diaria de práctica (5/10/15 minutos). Lógica pura e inmutable. */
import { toIsoDate } from '@/lib/age';
import type { DailyPractice } from '@/store/types';

export function minutesToday(practice: DailyPractice, now: Date = new Date()): number {
  return practice.date === toIsoDate(now) ? practice.minutes : 0;
}

export function addPracticeMinutes(practice: DailyPractice, minutes: number, now: Date = new Date()): DailyPractice {
  const safeMinutes = Number.isFinite(minutes) ? Math.max(0, minutes) : 0;
  return { date: toIsoDate(now), minutes: minutesToday(practice, now) + safeMinutes };
}

export function dailyGoalProgress(practice: DailyPractice, goalMinutes: number, now: Date = new Date()): number {
  if (goalMinutes <= 0) return 1;
  return Math.min(1, minutesToday(practice, now) / goalMinutes);
}
