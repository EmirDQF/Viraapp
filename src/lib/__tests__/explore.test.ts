import { MAX_RECOMMENDATIONS, recommendModules } from '@/lib/explore';
import type { ModuleProgress, ModulesProgress } from '@/types/game';

const done: ModuleProgress = {
  completedStages: Array.from({ length: 13 }, (_, index) => index),
  bestScores: {},
  completedAt: '2026-09-01T00:00:00.000Z',
};

describe('recomendaciones de Explorar', () => {
  test('sin progreso recomienda los primeros temas en orden', () => {
    expect(recommendModules({})).toEqual(['descarga', 'enfriador', 'freno']);
  });

  test('respeta el módulo elegido en el onboarding', () => {
    expect(recommendModules({}, 'hoy')[0]).toBe('hoy');
  });

  test('salta los temas completados mientras haya pendientes', () => {
    const modules: ModulesProgress = { descarga: done };
    expect(recommendModules(modules)).toEqual(['enfriador', 'freno', 'hoy']);
  });

  test('con todo completado propone repasar', () => {
    const modules: ModulesProgress = { descarga: done, enfriador: done, freno: done, hoy: done, ancla: done, muro: done };
    const result = recommendModules(modules);
    expect(result).toHaveLength(MAX_RECOMMENDATIONS);
    expect(result[0]).toBe('descarga');
  });
});
