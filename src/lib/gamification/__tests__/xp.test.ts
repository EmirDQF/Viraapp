import { MODULE_COMPLETE_BONUS, levelInfo, xpForLevel, xpForStage } from '@/lib/gamification/xp';

describe('xpForStage', () => {
  test('una etapa perfecta da el máximo con bono de acierto a la primera', () => {
    expect(xpForStage({ score: 1, bestCombo: 0 })).toBe(15);
  });

  test('equivocarse no quita XP: siempre se gana al menos la mitad', () => {
    expect(xpForStage({ score: 0, bestCombo: 0 })).toBe(5);
    expect(xpForStage({ score: 0.5, bestCombo: 0 })).toBe(8);
  });

  test('el combo suma hasta 5 puntos extra', () => {
    expect(xpForStage({ score: 1, bestCombo: 3 })).toBe(18);
    expect(xpForStage({ score: 1, bestCombo: 50 })).toBe(20);
  });

  test('valores inválidos se tratan como 0', () => {
    expect(xpForStage({ score: Number.NaN, bestCombo: -2 })).toBe(5);
  });

  test('completar un módulo da un bono', () => {
    expect(MODULE_COMPLETE_BONUS).toBeGreaterThan(0);
  });
});

describe('niveles', () => {
  test('la curva es progresiva: cada nivel cuesta más que el anterior', () => {
    expect(xpForLevel(1)).toBe(0);
    expect(xpForLevel(2)).toBe(60);
    expect(xpForLevel(3)).toBe(180);
    expect(xpForLevel(4) - xpForLevel(3)).toBeGreaterThan(xpForLevel(3) - xpForLevel(2));
  });

  test('levelInfo calcula nivel actual y progreso hacia el siguiente', () => {
    expect(levelInfo(0)).toEqual({ level: 1, floor: 0, ceil: 60, progress: 0 });
    expect(levelInfo(90)).toEqual({ level: 2, floor: 60, ceil: 180, progress: 0.25 });
    expect(levelInfo(180).level).toBe(3);
    expect(levelInfo(179).level).toBe(2);
  });

  test('levelInfo es instantáneo y correcto incluso con XP enorme', () => {
    const info = levelInfo(1e12);
    expect(xpForLevel(info.level)).toBeLessThanOrEqual(1e12);
    expect(xpForLevel(info.level + 1)).toBeGreaterThan(1e12);
  });
});
