import { EMPTY_SCORE, registerAnswer, toResult } from '@/lib/gamification/combo';

describe('marcador de una etapa', () => {
  test('cuenta aciertos a la primera y la racha', () => {
    const state = [true, true, false, true].reduce(registerAnswer, EMPTY_SCORE);
    expect(state).toEqual({ correct: 3, total: 4, combo: 1, best: 2 });
  });

  test('no muta el estado anterior', () => {
    const before = EMPTY_SCORE;
    registerAnswer(before, true);
    expect(before).toEqual({ correct: 0, total: 0, combo: 0, best: 0 });
  });

  test('toResult convierte el marcador en puntuación 0-1 y mejor combo', () => {
    const state = [true, false, true, true].reduce(registerAnswer, EMPTY_SCORE);
    expect(toResult(state)).toEqual({ score: 0.75, bestCombo: 2 });
  });

  test('sin respuestas la puntuación es 1 (etapas sin preguntas)', () => {
    expect(toResult(EMPTY_SCORE)).toEqual({ score: 1, bestCombo: 0 });
  });
});
