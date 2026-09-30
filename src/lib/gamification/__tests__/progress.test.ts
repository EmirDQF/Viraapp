import {
  completeStage,
  countCompletedModules,
  currentModule,
  moduleCompletion,
  moduleStatus,
  nextStage,
  stageStatus,
} from '@/lib/gamification/progress';
import type { ModulesProgress } from '@/types/game';

const ALL_STAGES = Array.from({ length: 13 }, (_, index) => index);
const done = (stages: readonly number[] = ALL_STAGES) => ({
  completedStages: stages,
  bestScores: {},
  completedAt: stages.length === 13 ? '2026-09-20T10:00:00.000Z' : null,
});

describe('moduleStatus', () => {
  test('el primer módulo está desbloqueado desde el inicio y el resto bloqueado', () => {
    expect(moduleStatus('descarga', {})).toBe('unlocked');
    expect(moduleStatus('enfriador', {})).toBe('locked');
  });

  test('completar un módulo desbloquea el siguiente', () => {
    const progress: ModulesProgress = { descarga: done() };
    expect(moduleStatus('descarga', progress)).toBe('completed');
    expect(moduleStatus('enfriador', progress)).toBe('unlocked');
    expect(moduleStatus('freno', progress)).toBe('locked');
  });
});

describe('stageStatus', () => {
  test('solo la primera etapa de un módulo desbloqueado está disponible al empezar', () => {
    expect(stageStatus('descarga', 0, {})).toBe('unlocked');
    expect(stageStatus('descarga', 1, {})).toBe('locked');
  });

  test('las etapas de un módulo bloqueado están bloqueadas', () => {
    expect(stageStatus('enfriador', 0, {})).toBe('locked');
  });

  test('una etapa completada queda como completada y desbloquea la siguiente', () => {
    const progress: ModulesProgress = { descarga: done([0]) };
    expect(stageStatus('descarga', 0, progress)).toBe('completed');
    expect(stageStatus('descarga', 1, progress)).toBe('unlocked');
  });
});

describe('nextStage (botón INICIAR)', () => {
  test('sin progreso lleva a la primera etapa del primer módulo', () => {
    expect(nextStage({})).toEqual({ moduleId: 'descarga', stage: 0 });
  });

  test('retoma la primera etapa pendiente', () => {
    expect(nextStage({ descarga: done([0, 1, 2]) })).toEqual({ moduleId: 'descarga', stage: 3 });
  });

  test('pasa al siguiente módulo al completar uno', () => {
    expect(nextStage({ descarga: done() })).toEqual({ moduleId: 'enfriador', stage: 0 });
  });

  test('devuelve null cuando todo está completado', () => {
    const all: ModulesProgress = {
      descarga: done(),
      enfriador: done(),
      freno: done(),
      hoy: done(),
      ancla: done(),
      muro: done(),
    };
    expect(nextStage(all)).toBeNull();
    expect(countCompletedModules(all)).toBe(6);
  });
});

describe('moduleCompletion y currentModule', () => {
  test('calcula la fracción de etapas completadas', () => {
    expect(moduleCompletion('descarga', {})).toBe(0);
    expect(moduleCompletion('descarga', { descarga: done([0, 1, 2, 3]) })).toBeCloseTo(4 / 13);
  });

  test('el módulo actual es el primero sin completar', () => {
    expect(currentModule({ descarga: done() })).toBe('enfriador');
    expect(currentModule({})).toBe('descarga');
  });
});

describe('completeStage', () => {
  test('registra la etapa sin mutar el progreso original', () => {
    const original: ModulesProgress = {};
    const next = completeStage(original, 'descarga', 0, 0.8, new Date('2026-09-29T12:00:00Z'));
    expect(original).toEqual({});
    expect(next.descarga?.completedStages).toEqual([0]);
    expect(next.descarga?.bestScores[0]).toBe(0.8);
  });

  test('conserva la mejor puntuación y no duplica etapas', () => {
    const first = completeStage({}, 'descarga', 0, 0.9);
    const second = completeStage(first, 'descarga', 0, 0.5);
    expect(second.descarga?.completedStages).toEqual([0]);
    expect(second.descarga?.bestScores[0]).toBe(0.9);
  });

  test('marca la fecha de finalización al completar las 13 etapas', () => {
    const almost: ModulesProgress = { descarga: done(ALL_STAGES.slice(0, 12)) };
    const now = new Date('2026-09-29T12:00:00Z');
    const next = completeStage(almost, 'descarga', 12, 1, now);
    expect(next.descarga?.completedAt).toBe(now.toISOString());
  });

  test('ignora índices de etapa fuera de rango', () => {
    expect(completeStage({}, 'descarga', 99, 1)).toEqual({});
    expect(completeStage({}, 'descarga', -1, 1)).toEqual({});
  });
});
