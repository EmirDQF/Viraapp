/**
 * Ruta personalizada: a partir de lo que el usuario quiere mejorar ("¿Qué quieres mejorar?") ordena los
 * módulos y elige la "Lección del día". Lógica pura: no toca el store ni el reloj (recibe `now`).
 */
import { MODULE_ORDER } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import { moduleStatus } from '@/lib/gamification/progress';
import { randomInt, seedFrom, seededRandom } from '@/lib/random';
import { toIsoDate } from '@/lib/age';
import type { ModuleId, ModulesProgress, StagePointer } from '@/types/game';

export const FOCUS_AREA_IDS = [
  'impulsos',
  'frustracion',
  'emociones',
  'ansiedad',
  'resiliencia',
  'estrategias',
  'pensamientos',
  'relaciones',
  'estres',
  'pantallas',
] as const;
export type FocusArea = (typeof FOCUS_AREA_IDS)[number];

export const HARD_MOMENT_IDS = ['manana', 'tarde', 'noche', 'personas'] as const;
export type HardMoment = (typeof HARD_MOMENT_IDS)[number];

interface FocusAreaDef {
  readonly label: string;
  /** Cuánto trabaja cada módulo esta área (0 si no aparece). */
  readonly weights: Partial<Readonly<Record<ModuleId, number>>>;
}

const FOCUS_AREAS: Readonly<Record<FocusArea, FocusAreaDef>> = {
  impulsos: { label: 'Controlar impulsos', weights: { freno: 3, enfriador: 2 } },
  frustracion: { label: 'Manejar la frustración', weights: { enfriador: 3, freno: 1, muro: 1 } },
  emociones: { label: 'Entender mis emociones', weights: { descarga: 3, ancla: 1 } },
  ansiedad: { label: 'Ansiedad y estrés', weights: { ancla: 3, descarga: 2 } },
  resiliencia: { label: 'Resiliencia', weights: { muro: 3, ancla: 1 } },
  estrategias: { label: 'Estrategias de control', weights: { freno: 2, hoy: 2 } },
  pensamientos: { label: 'Pensamientos negativos', weights: { muro: 3, descarga: 1 } },
  relaciones: { label: 'Relaciones y comunicación', weights: { ancla: 3, freno: 1 } },
  estres: { label: 'Estrés académico o laboral', weights: { hoy: 3, descarga: 1 } },
  pantallas: { label: 'Uso del celular y redes', weights: { enfriador: 3, freno: 1 } },
};

export const HARD_MOMENT_LABELS: Readonly<Record<HardMoment, string>> = {
  manana: 'En la mañana',
  tarde: 'En la tarde',
  noche: 'En la noche',
  personas: 'Con ciertas personas',
};

export function focusLabel(area: FocusArea): string {
  return FOCUS_AREAS[area].label;
}

export function isFocusArea(value: unknown): value is FocusArea {
  return typeof value === 'string' && (FOCUS_AREA_IDS as readonly string[]).includes(value);
}

function moduleScore(id: ModuleId, areas: readonly FocusArea[]): number {
  return [...new Set(areas)].reduce((total, area) => total + (FOCUS_AREAS[area].weights[id] ?? 0), 0);
}

/** Módulos ordenados del que más encaja con el foco al que menos; los empates respetan el orden de la guía. */
export function rankModules(areas: readonly FocusArea[]): readonly ModuleId[] {
  return [...MODULE_ORDER].sort((a, b) => moduleScore(b, areas) - moduleScore(a, areas) || MODULE_ORDER.indexOf(a) - MODULE_ORDER.indexOf(b));
}

/** Módulo con el que conviene empezar el recorrido según el foco. */
export function recommendedStart(areas: readonly FocusArea[]): ModuleId {
  return rankModules(areas)[0];
}

/** Área de foco del usuario que más pesa en un módulo (para explicar "por qué esta lección"). */
function topFocusFor(id: ModuleId, areas: readonly FocusArea[]): FocusArea | null {
  return areas.reduce<FocusArea | null>((best, area) => {
    const weight = FOCUS_AREAS[area].weights[id] ?? 0;
    if (weight === 0) return best;
    return best === null || weight > (FOCUS_AREAS[best].weights[id] ?? 0) ? area : best;
  }, null);
}

export interface LessonInput {
  readonly focusAreas: readonly FocusArea[];
  readonly modules: ModulesProgress;
  readonly start: ModuleId | null;
  readonly now: Date;
}

export interface Lesson {
  readonly pointer: StagePointer;
  /** true si ya completó todo y la lección es un repaso. */
  readonly isReview: boolean;
  /** Área de foco que justifica la elección, o null si no hay ninguna relacionada. */
  readonly focus: FocusArea | null;
}

function firstPendingStage(id: ModuleId, modules: ModulesProgress): number | null {
  const completed = modules[id]?.completedStages ?? [];
  const stage = Array.from({ length: STAGES_PER_MODULE }, (_, index) => index).find((index) => !completed.includes(index));
  return stage ?? null;
}

/**
 * Lección del día: la siguiente etapa pendiente del módulo desbloqueado que mejor encaja con el foco.
 * Si ya completó todo, un repaso del módulo prioritario que se mantiene igual durante todo el día.
 */
export function lessonOfDay({ focusAreas, modules, start, now }: LessonInput): Lesson {
  const ranked = rankModules(focusAreas);
  const pending = ranked.find((id) => moduleStatus(id, modules, start) === 'unlocked' && firstPendingStage(id, modules) !== null);
  if (pending) {
    const stage = firstPendingStage(pending, modules) ?? 0;
    return { pointer: { moduleId: pending, stage }, isReview: false, focus: topFocusFor(pending, focusAreas) };
  }
  const moduleId = ranked[0];
  const stage = randomInt(seededRandom(seedFrom(`${toIsoDate(now)}-${moduleId}`)), STAGES_PER_MODULE);
  return { pointer: { moduleId, stage }, isReview: true, focus: topFocusFor(moduleId, focusAreas) };
}
