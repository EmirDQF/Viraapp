/**
 * XP y niveles. VIRA no castiga: equivocarse nunca resta, solo se gana algo menos.
 * Una etapa da entre 5 y 20 XP según acierto a la primera y combo.
 */

const BASE_STAGE_XP = 10;
const PERFECT_BONUS = 5;
const MAX_COMBO_BONUS = 5;
/** Cada nivel cuesta 60 XP más que el anterior: 0, 60, 180, 360, 600… */
const LEVEL_STEP = 30;

export const MODULE_COMPLETE_BONUS = 50;

export interface StageResult {
  /** Proporción de aciertos a la primera (0 a 1). */
  readonly score: number;
  /** Mejor racha de aciertos seguidos dentro de la etapa. */
  readonly bestCombo: number;
}

const finiteOrZero = (value: number): number => (Number.isFinite(value) ? value : 0);

export function xpForStage({ score, bestCombo }: StageResult): number {
  const safeScore = Math.min(1, Math.max(0, finiteOrZero(score)));
  const combo = Math.min(MAX_COMBO_BONUS, Math.max(0, Math.trunc(finiteOrZero(bestCombo))));
  const base = Math.round(BASE_STAGE_XP * (0.5 + 0.5 * safeScore));
  return base + (safeScore === 1 ? PERFECT_BONUS : 0) + combo;
}

/** XP total necesaria para alcanzar un nivel. */
export function xpForLevel(level: number): number {
  const safe = Math.max(1, Math.trunc(level));
  return LEVEL_STEP * (safe - 1) * safe;
}

export interface LevelInfo {
  readonly level: number;
  readonly floor: number;
  readonly ceil: number;
  /** Progreso dentro del nivel actual (0 a 1). */
  readonly progress: number;
}

export function levelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, finiteOrZero(xp));
  let level = 1;
  while (xpForLevel(level + 1) <= safeXp) level += 1;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return { level, floor, ceil, progress: (safeXp - floor) / (ceil - floor) };
}
