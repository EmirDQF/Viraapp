/** Lógica pura del Buzón de Impulsos: anotar un impulso, esperar y decidir con calma. */

export type ImpulseStatus = 'waiting' | 'resisted' | 'gave_in' | 'discarded';

export interface Impulse {
  readonly id: string;
  readonly title: string;
  readonly minutes: number;
  /** Marcas de tiempo ISO. */
  readonly createdAt: string;
  readonly endsAt: string;
  readonly status: ImpulseStatus;
  readonly resolvedAt: string | null;
  readonly notificationId: string | null;
}

export const TIMER_OPTIONS: readonly number[] = [5, 10, 20, 30];
export const DEFAULT_TIMER = 20;
const MIN_MINUTES = 1;
const MAX_MINUTES = 120;
const MINUTE_MS = 60 * 1000;
export const IMPULSE_TITLE_MAX = 60;

export const IMPULSE_PRESETS: readonly { readonly title: string; readonly icon: 'cart' | 'phone' | 'food' }[] = [
  { title: 'Comprar algo online', icon: 'cart' },
  { title: 'Scrollear redes sociales', icon: 'phone' },
  { title: 'Picar algo de comida', icon: 'food' },
];

export function createImpulse(id: string, title: string, minutes: number, now: Date = new Date()): Impulse {
  const safeMinutes = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(Number.isFinite(minutes) ? minutes : DEFAULT_TIMER)));
  return {
    id,
    title: title.trim().slice(0, IMPULSE_TITLE_MAX),
    minutes: safeMinutes,
    createdAt: now.toISOString(),
    endsAt: new Date(now.getTime() + safeMinutes * MINUTE_MS).toISOString(),
    status: 'waiting',
    resolvedAt: null,
    notificationId: null,
  };
}

export function remainingMs(impulse: Impulse, now: Date = new Date()): number {
  return Math.max(0, Date.parse(impulse.endsAt) - now.getTime());
}

export function isDue(impulse: Impulse, now: Date = new Date()): boolean {
  return impulse.status === 'waiting' && remainingMs(impulse, now) === 0;
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function resolveImpulse(impulse: Impulse, status: Exclude<ImpulseStatus, 'waiting'>, now: Date = new Date()): Impulse {
  return { ...impulse, status, resolvedAt: now.toISOString() };
}

export interface ImpulseStats {
  readonly total: number;
  readonly waiting: number;
  readonly resisted: number;
  readonly gaveIn: number;
  readonly discarded: number;
  /** Proporción de impulsos resistidos entre los decididos (resistidos + cedidos). */
  readonly resistRate: number;
}

export function impulseStats(list: readonly Impulse[]): ImpulseStats {
  const count = (status: ImpulseStatus) => list.filter((impulse) => impulse.status === status).length;
  const resisted = count('resisted');
  const gaveIn = count('gave_in');
  return {
    total: list.length,
    waiting: count('waiting'),
    resisted,
    gaveIn,
    discarded: count('discarded'),
    resistRate: resisted + gaveIn === 0 ? 0 : resisted / (resisted + gaveIn),
  };
}
