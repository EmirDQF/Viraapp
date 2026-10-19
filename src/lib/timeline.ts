/**
 * "Mi camino": la cronología del avance. Lógica pura sobre una lista de eventos append-only (lecciones,
 * impulsos, ánimo, SOS, técnicas, insignias y casos). Las fechas se agrupan por día local.
 */
import type { TechniqueId } from '@/data/techniques';
import { toIsoDate } from '@/lib/age';
import type { ModuleId } from '@/types/game';

export const MAX_TIMELINE = 500;
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_DAYS = 7;
/** Un día con ánimo de 1 o 2 cuenta como ánimo bajo. */
export const LOW_MOOD_MAX = 2;

export type MoodValue = 1 | 2 | 3 | 4 | 5;

interface EventBase {
  readonly id: string;
  /** Marca de tiempo ISO. */
  readonly at: string;
}

export type TimelineEvent =
  | (EventBase & { readonly kind: 'lesson'; readonly moduleId: ModuleId; readonly stage: number; readonly minutes: number; readonly score: number })
  | (EventBase & { readonly kind: 'impulse'; readonly status: 'registered' | 'resisted' | 'gave_in'; readonly label: string })
  | (EventBase & { readonly kind: 'mood'; readonly value: MoodValue })
  | (EventBase & { readonly kind: 'sos'; readonly technique: TechniqueId; readonly before: number; readonly after: number })
  | (EventBase & { readonly kind: 'technique'; readonly technique: TechniqueId; readonly minutes: number })
  | (EventBase & { readonly kind: 'badge'; readonly label: string })
  | (EventBase & { readonly kind: 'case'; readonly caseId: string });

export type TimelineKind = TimelineEvent['kind'];

/** Distribuye `Omit` sobre cada variante (un `Omit` simple aplanaría la unión). */
export type NewTimelineEvent = TimelineEvent extends infer E ? (E extends TimelineEvent ? Omit<E, 'id' | 'at'> : never) : never;

/** Agrega un evento al final; si se pasa del máximo, descarta los más antiguos. */
export function appendEvent(list: readonly TimelineEvent[], event: TimelineEvent): readonly TimelineEvent[] {
  return [...list, event].slice(-MAX_TIMELINE);
}

export function dayOf(iso: string): string {
  return toIsoDate(new Date(iso));
}

const byNewest = (a: TimelineEvent, b: TimelineEvent): number => Date.parse(b.at) - Date.parse(a.at);
const byOldest = (a: TimelineEvent, b: TimelineEvent): number => Date.parse(a.at) - Date.parse(b.at);

export interface DayGroup {
  readonly day: string;
  readonly events: readonly TimelineEvent[];
}

/** Agrupa por día local: días del más reciente al más antiguo y, dentro, eventos del más reciente al más antiguo. */
export function groupByDay(events: readonly TimelineEvent[]): readonly DayGroup[] {
  const groups = new Map<string, TimelineEvent[]>();
  [...events].sort(byNewest).forEach((event) => {
    const key = dayOf(event.at);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  });
  return [...groups.entries()].map(([key, items]) => ({ day: key, events: items }));
}

/** Minutos de práctica que aporta un evento (lecciones, técnicas y SOS). */
export function eventMinutes(event: TimelineEvent): number {
  if (event.kind === 'lesson' || event.kind === 'technique') return Math.max(0, event.minutes);
  if (event.kind === 'sos') return 2;
  return 0;
}

const isActivity = (event: TimelineEvent): boolean => eventMinutes(event) > 0 || (event.kind === 'impulse' && event.status === 'resisted') || event.kind === 'case';

export interface Milestone {
  readonly id: string;
  readonly at: string;
  readonly title: string;
}

interface CountRule {
  readonly id: string;
  readonly title: string;
  readonly count: number;
  readonly matches: (event: TimelineEvent) => boolean;
}

const COUNT_RULES: readonly CountRule[] = [
  { id: 'first-lesson', title: '¡Primera lección!', count: 1, matches: (event) => event.kind === 'lesson' },
  { id: 'lessons-10', title: '10 lecciones completadas', count: 10, matches: (event) => event.kind === 'lesson' },
  { id: 'lessons-50', title: '50 lecciones completadas', count: 50, matches: (event) => event.kind === 'lesson' },
  { id: 'resisted-1', title: 'Primer impulso frenado', count: 1, matches: (event) => event.kind === 'impulse' && event.status === 'resisted' },
  { id: 'resisted-10', title: '10 impulsos frenados', count: 10, matches: (event) => event.kind === 'impulse' && event.status === 'resisted' },
  { id: 'first-case', title: 'Primer caso resuelto', count: 1, matches: (event) => event.kind === 'case' },
  { id: 'cases-5', title: '5 casos resueltos', count: 5, matches: (event) => event.kind === 'case' },
  { id: 'sos-calm', title: 'Bajaste un impulso con el SOS', count: 1, matches: (event) => event.kind === 'sos' && event.after < event.before },
];

const STREAK_RULES: readonly { readonly days: number; readonly title: string }[] = [
  { days: 3, title: 'Racha de 3 días' },
  { days: 7, title: 'Racha de 7 días' },
  { days: 30, title: 'Racha de 30 días' },
];

function countMilestones(sorted: readonly TimelineEvent[]): Milestone[] {
  return COUNT_RULES.flatMap((rule) => {
    const hit = sorted.filter(rule.matches)[rule.count - 1];
    return hit ? [{ id: rule.id, at: hit.at, title: rule.title }] : [];
  });
}

/** Hitos de días activos: "¡Primera semana!" (7 días distintos) y rachas de días seguidos. */
function dayMilestones(sorted: readonly TimelineEvent[]): Milestone[] {
  const firstOfDay = new Map<string, TimelineEvent>();
  sorted.filter(isActivity).forEach((event) => {
    if (!firstOfDay.has(dayOf(event.at))) firstOfDay.set(dayOf(event.at), event);
  });
  const days = [...firstOfDay.entries()];
  const found: Milestone[] = [];
  if (days.length >= WEEK_DAYS) found.push({ id: 'first-week', at: days[WEEK_DAYS - 1][1].at, title: '¡Primera semana!' });
  let run = 0;
  days.forEach(([key, event], index) => {
    const previous = days[index - 1]?.[0];
    const consecutive = previous !== undefined && Date.parse(`${key}T12:00:00`) - Date.parse(`${previous}T12:00:00`) <= DAY_MS + 60 * 60 * 1000;
    run = consecutive ? run + 1 : 1;
    STREAK_RULES.forEach((rule) => {
      if (run === rule.days && !found.some((item) => item.id === `streak-${rule.days}`)) {
        found.push({ id: `streak-${rule.days}`, at: event.at, title: rule.title });
      }
    });
  });
  return found;
}

/** Hitos alcanzados, cada uno con el momento en que se logró (del más antiguo al más reciente). */
export function milestones(events: readonly TimelineEvent[]): readonly Milestone[] {
  const sorted = [...events].sort(byOldest);
  return [...countMilestones(sorted), ...dayMilestones(sorted)].sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export type JourneyItem = { readonly type: 'event'; readonly event: TimelineEvent } | { readonly type: 'milestone'; readonly milestone: Milestone };

export interface JourneySection {
  readonly day: string;
  readonly data: readonly JourneyItem[];
}

const itemTime = (item: JourneyItem): number => Date.parse(item.type === 'event' ? item.event.at : item.milestone.at);

/** Secciones de la línea de tiempo: un día por sección, con eventos e hitos del más reciente al más antiguo. */
export function journeySections(events: readonly TimelineEvent[]): readonly JourneySection[] {
  const items: JourneyItem[] = [
    ...events.map((event): JourneyItem => ({ type: 'event', event })),
    ...milestones(events).map((milestone): JourneyItem => ({ type: 'milestone', milestone })),
  ];
  const byDay = new Map<string, JourneyItem[]>();
  [...items]
    .sort((a, b) => itemTime(b) - itemTime(a))
    .forEach((item) => {
      const key = dayOf(item.type === 'event' ? item.event.at : item.milestone.at);
      byDay.set(key, [...(byDay.get(key) ?? []), item]);
    });
  return [...byDay.entries()].map(([key, data]) => ({ day: key, data }));
}

export interface DayStat {
  readonly day: string;
  readonly minutes: number;
}

export interface WeekSummary {
  /** Los 7 últimos días, del más antiguo a hoy. */
  readonly days: readonly DayStat[];
  readonly minutes: number;
  readonly impulsesResisted: number;
  /** Promedio de ánimo (1 a 5) o null si no hubo check-ins. */
  readonly moodAverage: number | null;
}

function lastDays(now: Date, count: number, offset = 0): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset - (count - 1 - index), 12);
    return toIsoDate(date);
  });
}

function eventsIn(events: readonly TimelineEvent[], days: readonly string[]): readonly TimelineEvent[] {
  const set = new Set(days);
  return events.filter((event) => set.has(dayOf(event.at)));
}

const sumMinutes = (events: readonly TimelineEvent[]): number => events.reduce((total, event) => total + eventMinutes(event), 0);

/** Resumen de los últimos 7 días (incluido hoy). */
export function weekSummary(events: readonly TimelineEvent[], now: Date): WeekSummary {
  const days = lastDays(now, WEEK_DAYS);
  const week = eventsIn(events, days);
  const moods = week.flatMap((event) => (event.kind === 'mood' ? [event.value] : []));
  return {
    days: days.map((key) => ({ day: key, minutes: sumMinutes(week.filter((event) => dayOf(event.at) === key)) })),
    minutes: sumMinutes(week),
    impulsesResisted: week.filter((event) => event.kind === 'impulse' && event.status === 'resisted').length,
    moodAverage: moods.length > 0 ? Math.round((moods.reduce((a, b) => a + b, 0) / moods.length) * 10) / 10 : null,
  };
}

export type Trend = 'new' | 'up' | 'steady' | 'down';

/** Compara la práctica de esta semana con la anterior (minutos + impulsos frenados como 2 minutos). */
export function weeklyTrend(events: readonly TimelineEvent[], now: Date): Trend {
  const score = (list: readonly TimelineEvent[]) =>
    sumMinutes(list) + 2 * list.filter((event) => event.kind === 'impulse' && event.status === 'resisted').length;
  const current = score(eventsIn(events, lastDays(now, WEEK_DAYS)));
  const previous = score(eventsIn(events, lastDays(now, WEEK_DAYS, WEEK_DAYS)));
  if (current === 0 && previous === 0) return 'new';
  if (current > previous * 1.2) return 'up';
  if (current < previous * 0.8) return 'down';
  return 'steady';
}

/** Días seguidos, terminando hoy o ayer, cuyo último check-in de ánimo fue bajo (1 o 2). */
export function lowMoodStreak(events: readonly TimelineEvent[], now: Date): number {
  const lastMoodByDay = new Map<string, MoodValue>();
  [...events].sort(byOldest).forEach((event) => {
    if (event.kind === 'mood') lastMoodByDay.set(dayOf(event.at), event.value);
  });
  let streak = 0;
  for (const key of [...lastDays(now, 30)].reverse()) {
    const value = lastMoodByDay.get(key);
    if (value === undefined && streak === 0 && key === toIsoDate(now)) continue;
    if (value === undefined || value > LOW_MOOD_MAX) break;
    streak += 1;
  }
  return streak;
}

/** Último check-in de ánimo de hoy, o null si aún no lo hizo. */
export function moodToday(events: readonly TimelineEvent[], now: Date): MoodValue | null {
  const today = toIsoDate(now);
  const moods = [...events].sort(byOldest).filter((event) => event.kind === 'mood' && dayOf(event.at) === today);
  const last = moods[moods.length - 1];
  return last && last.kind === 'mood' ? last.value : null;
}

/** Impulsos anotados en los últimos `days` días (incluido hoy). */
export function recentImpulseCount(events: readonly TimelineEvent[], now: Date, days = 3): number {
  return eventsIn(events, lastDays(now, days)).filter((event) => event.kind === 'impulse' && event.status === 'registered').length;
}

export type RegiStage = 'cria' | 'juvenil' | 'adulto' | 'sabio';

export const REGI_STAGES: readonly { readonly id: RegiStage; readonly name: string; readonly minXp: number }[] = [
  { id: 'cria', name: 'Cría', minXp: 0 },
  { id: 'juvenil', name: 'Juvenil', minXp: 200 },
  { id: 'adulto', name: 'Adulto', minXp: 800 },
  { id: 'sabio', name: 'Sabio', minXp: 2000 },
];

/** Etapa visual de Regi según el XP total. */
export function regiStageFor(xp: number): RegiStage {
  const safe = Number.isFinite(xp) ? xp : 0;
  return [...REGI_STAGES].reverse().find((stage) => safe >= stage.minXp)?.id ?? 'cria';
}
