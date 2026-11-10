import { ACTIVITIES, activitiesOf } from '@/data/caminos/activities';
import { PA3_MODULES } from '@/data/caminos/modules';
import { PATHS } from '@/data/caminos/paths';
import type { Activity, CaminoPath, Pa3ModuleId } from '@/data/caminos/types';

/** Respuesta al caso inicial de un módulo (al empezar y otra vez en "Antes y ahora"). */
export interface SituationAnswer {
  /** Índice de la decisión elegida. */
  readonly decision: number;
  /** Índice del argumento elegido. */
  readonly argument: number;
  /** Tensión que sentía (1 a 5). Solo se registra: no se exige que baje. */
  readonly tension: number;
  /** Marca de tiempo ISO. */
  readonly at: string;
}

export interface ModuleJourney {
  readonly before: SituationAnswer | null;
  readonly after: SituationAnswer | null;
}

export interface ActivityProgress {
  readonly completed: boolean;
  /** Paso en el que se pausó (0 si no hay intento en curso). */
  readonly step: number;
  /** Índices de las opciones elegidas en el intento en curso. */
  readonly answers: readonly number[];
  /** Marca de tiempo ISO. */
  readonly updatedAt: string;
}

export type CaminoJourneys = Readonly<Partial<Record<Pa3ModuleId, ModuleJourney>>>;
export type CaminoActivities = Readonly<Record<string, ActivityProgress>>;

export const TENSION_MIN = 1;
export const TENSION_MAX = 5;
/** XP por terminar una actividad por primera vez. */
export const ACTIVITY_XP = 10;

/** Módulos activos (sin las paradas futuras) de un camino, en orden. */
export function pathModules(path: CaminoPath): readonly Pa3ModuleId[] {
  return path.stops.flatMap((stop) => (stop.kind === 'module' ? [stop.moduleId] : []));
}

/** "2 módulos · 6 actividades": se calcula desde los datos para que nunca quede desfasado. */
export function pathMeta(path: CaminoPath): string {
  const modules = pathModules(path);
  const activities = modules.reduce((total, id) => total + activitiesOf(id).length, 0);
  return `${modules.length} ${modules.length === 1 ? 'módulo' : 'módulos'} · ${activities} actividades`;
}

export function pathOfModule(moduleId: Pa3ModuleId): CaminoPath {
  const path = PATHS.find((item) => item.id === PA3_MODULES[moduleId].path);
  if (!path) throw new Error(`Módulo sin camino: ${moduleId}`);
  return path;
}

/** Se puede jugar o abrir: todo menos las propuestas. */
export function isPlayable(activity: Activity): boolean {
  return activity.content.kind !== 'planned';
}

export interface ModuleProgress {
  readonly done: number;
  /** Actividades que se pueden completar (las propuestas no cuentan). */
  readonly total: number;
}

export function moduleProgress(moduleId: Pa3ModuleId, progress: CaminoActivities): ModuleProgress {
  const playable = activitiesOf(moduleId).filter(isPlayable);
  return { done: playable.filter((activity) => progress[activity.id]?.completed === true).length, total: playable.length };
}

export type ModuleStage = 'situation' | 'practice' | 'compare' | 'done';

/** En qué etapa del flujo de 4 pasos está el usuario dentro de un módulo. */
export function moduleStage(journey: ModuleJourney | undefined, progress: ModuleProgress): ModuleStage {
  if (!journey?.before) return 'situation';
  if (journey.after) return 'done';
  return progress.done > 0 ? 'compare' : 'practice';
}

/** Etiqueta del avance de un módulo para listas ("Empezar", "1 de 3", "Completo"). */
export function moduleTag(progress: ModuleProgress, started: boolean): string {
  if (progress.total > 0 && progress.done >= progress.total) return 'Completo';
  if (progress.done > 0) return `${progress.done} de ${progress.total}`;
  return started ? 'En curso' : 'Empezar';
}

export interface HighlightStep {
  /** Tarjeta resaltada (0 a 2). */
  readonly index: number;
  /** Momento (ms desde que se pulsa) en que se resalta. */
  readonly at: number;
}

export interface PickPlan {
  readonly target: number;
  readonly steps: readonly HighlightStep[];
  /** Momento en que se abre el camino ganador. */
  readonly openAt: number;
}

const PICK_ROUNDS = 9;
const PICK_BASE_MS = 70;
const PICK_SLOWDOWN_MS = 14;
const PICK_OPEN_DELAY_MS = 450;

/**
 * "Que Regi elija": resalta las 3 tarjetas en orden, cada vez más lento, durante `9 + target` pasos, y abre el
 * camino ganador 450 ms después. `random` en [0, 1).
 */
export function pickPlan(random: number, count: number = PATHS.length): PickPlan {
  const target = Math.min(count - 1, Math.max(0, Math.floor(random * count)));
  const total = PICK_ROUNDS + target;
  let at = 0;
  const steps: HighlightStep[] = [];
  for (let k = 0; k <= total; k += 1) {
    at += PICK_BASE_MS + k * PICK_SLOWDOWN_MS;
    steps.push({ index: k % count, at });
  }
  return { target, steps, openAt: at + PICK_OPEN_DELAY_MS };
}

/** Evidencia para "Antes y ahora": las actividades completadas del módulo. */
export function moduleEvidence(moduleId: Pa3ModuleId, progress: CaminoActivities): readonly Activity[] {
  return activitiesOf(moduleId).filter((activity) => progress[activity.id]?.completed === true);
}

export const TOTAL_ACTIVITIES = ACTIVITIES.length;
