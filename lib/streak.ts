import type { Streak } from '../types';
import { toIsoDate } from './age';

const DAY_MS = 24 * 60 * 60 * 1000;

function dayNumber(isoDate: string): number {
  const [year, month, day] = isoDate.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
}

/** Registra actividad hoy y devuelve la racha resultante (sin mutar la original). */
export function registerActivity(streak: Streak, today: Date = new Date()): Streak {
  const todayIso = toIsoDate(today);
  if (streak.lastActiveDate === null) {
    return { count: 1, lastActiveDate: todayIso };
  }
  const gap = dayNumber(todayIso) - dayNumber(streak.lastActiveDate);
  if (gap <= 0) {
    return streak;
  }
  if (gap === 1) {
    return { count: streak.count + 1, lastActiveDate: todayIso };
  }
  return { count: 1, lastActiveDate: todayIso };
}

/** Racha visible: si pasó más de un día sin actividad, se muestra en 0. */
export function visibleStreak(streak: Streak, today: Date = new Date()): number {
  if (streak.lastActiveDate === null) {
    return 0;
  }
  const gap = dayNumber(toIsoDate(today)) - dayNumber(streak.lastActiveDate);
  return gap > 1 ? 0 : streak.count;
}
