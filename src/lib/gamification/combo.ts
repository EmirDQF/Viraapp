/** Marcador inmutable de una etapa: aciertos a la primera y combo (respuestas correctas seguidas). */
import type { StageResult } from '@/lib/gamification/xp';

export interface ScoreState {
  readonly correct: number;
  readonly total: number;
  readonly combo: number;
  readonly best: number;
}

export const EMPTY_SCORE: ScoreState = { correct: 0, total: 0, combo: 0, best: 0 };

export function registerAnswer(state: ScoreState, correctFirstTry: boolean): ScoreState {
  const combo = correctFirstTry ? state.combo + 1 : 0;
  return {
    correct: state.correct + (correctFirstTry ? 1 : 0),
    total: state.total + 1,
    combo,
    best: Math.max(state.best, combo),
  };
}

export function toResult(state: ScoreState): StageResult {
  return { score: state.total === 0 ? 1 : state.correct / state.total, bestCombo: state.best };
}
