/** Tipos del juego VIRA: 6 módulos, 13 etapas por módulo agrupadas en 4 sectores. */
import type { ModuleColorKey } from '@/theme/tokens';

/** El id de cada módulo coincide con su clave de color en MODULE_COLORS. */
export type ModuleId = ModuleColorKey;

export type SectorId = 'descubrir' | 'practicar' | 'aplicar' | 'dominar';

/** Las 10 mecánicas reutilizables del juego. */
export type MechanicKind =
  | 'decision'
  | 'puzzle'
  | 'swipe'
  | 'quiz'
  | 'word-rain'
  | 'simulator'
  | 'trap-case'
  | 'word-search'
  | 'boss'
  | 'rewind';

export interface StageDef {
  readonly index: number;
  readonly sector: SectorId;
  readonly kind: MechanicKind;
  readonly title: string;
  /** Duración aproximada en minutos (para la meta diaria). */
  readonly minutes: number;
}

export interface ModuleMeta {
  readonly id: ModuleId;
  readonly order: number;
  readonly name: string;
  /** Etiqueta del tramo del recorrido según la guía (p. ej. "Sector 1 · Factores"). */
  readonly track: string;
  readonly tagline: string;
  readonly focus: string;
  readonly idea: string;
  readonly phrase: string;
}

export interface ModuleProgress {
  /** Índices (0-12) de las etapas completadas. */
  readonly completedStages: readonly number[];
  /** Mejor puntuación por etapa (0 a 1). */
  readonly bestScores: Readonly<Record<number, number>>;
  readonly completedAt: string | null;
}

export type ModulesProgress = Partial<Readonly<Record<ModuleId, ModuleProgress>>>;

export type UnlockStatus = 'completed' | 'unlocked' | 'locked';

export interface StagePointer {
  readonly moduleId: ModuleId;
  readonly stage: number;
}
