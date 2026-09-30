import { ACHIEVEMENTS, computeAchievements, unlockedCount, type AchievementInput } from '@/lib/gamification/achievements';

const empty: AchievementInput = {
  completedStages: 0,
  completedModules: 0,
  streak: 0,
  resistedImpulses: 0,
  evidence: 0,
  contacts: 0,
  level: 1,
};

describe('logros', () => {
  test('sin actividad no hay logros desbloqueados', () => {
    const list = computeAchievements(empty);
    expect(list).toHaveLength(ACHIEVEMENTS.length);
    expect(unlockedCount(list)).toBe(0);
  });

  test('desbloquea al alcanzar la meta y calcula el avance', () => {
    const list = computeAchievements({ ...empty, completedStages: 1, streak: 5, resistedImpulses: 4 });
    const byId = Object.fromEntries(list.map((item) => [item.id, item]));
    expect(byId['first-stage'].unlocked).toBe(true);
    expect(byId['streak-3'].unlocked).toBe(true);
    expect(byId['streak-7'].unlocked).toBe(false);
    expect(byId['streak-7'].progress).toBeCloseTo(5 / 7);
    expect(byId['impulse-10'].progress).toBeCloseTo(0.4);
  });

  test('el avance nunca pasa de 1 y tolera valores no válidos', () => {
    const list = computeAchievements({ ...empty, evidence: 50, contacts: Number.NaN, level: -3 });
    const byId = Object.fromEntries(list.map((item) => [item.id, item]));
    expect(byId['evidence-5'].progress).toBe(1);
    expect(byId['support-1'].value).toBe(0);
    expect(byId['level-5'].value).toBe(0);
  });
});
