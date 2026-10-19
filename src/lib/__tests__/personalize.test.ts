import { MODULE_ORDER } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import { FOCUS_AREA_IDS, focusLabel, lessonOfDay, rankModules, recommendedStart } from '@/lib/personalize';
import type { ModulesProgress } from '@/types/game';

const allStages = Array.from({ length: STAGES_PER_MODULE }, (_, index) => index);
const done = { completedStages: allStages, bestScores: {}, completedAt: '2026-10-01T00:00:00.000Z' };
const NOW = new Date(2026, 9, 19, 10, 0, 0);

describe('rankModules', () => {
  test('sin áreas devuelve el orden de la guía', () => {
    expect(rankModules([])).toEqual(MODULE_ORDER);
  });

  test('con todas las áreas devuelve los 6 módulos sin repetir', () => {
    const ranked = rankModules(FOCUS_AREA_IDS);
    expect(ranked).toHaveLength(MODULE_ORDER.length);
    expect(new Set(ranked).size).toBe(MODULE_ORDER.length);
  });

  test('controlar impulsos pone primero Freno de Mano', () => {
    expect(rankModules(['impulsos'])[0]).toBe('freno');
  });

  test('pensamientos negativos pone primero el Muro de Evidencia', () => {
    expect(rankModules(['pensamientos'])[0]).toBe('muro');
  });

  test('es determinista e ignora áreas repetidas', () => {
    expect(rankModules(['ansiedad', 'ansiedad'])).toEqual(rankModules(['ansiedad']));
  });
});

describe('recommendedStart', () => {
  test('sin áreas recomienda el primer módulo de la guía', () => {
    expect(recommendedStart([])).toBe(MODULE_ORDER[0]);
  });

  test('con frustración recomienda el Enfriador', () => {
    expect(recommendedStart(['frustracion'])).toBe('enfriador');
  });
});

describe('lessonOfDay', () => {
  test('usuario nuevo: la primera etapa del módulo de inicio', () => {
    const lesson = lessonOfDay({ focusAreas: [], modules: {}, start: 'descarga', now: NOW });
    expect(lesson.pointer).toEqual({ moduleId: 'descarga', stage: 0 });
    expect(lesson.isReview).toBe(false);
  });

  test('explica el motivo según el área de foco que más pesa en ese módulo', () => {
    const lesson = lessonOfDay({ focusAreas: ['impulsos'], modules: {}, start: 'freno', now: NOW });
    expect(lesson.pointer.moduleId).toBe('freno');
    expect(lesson.focus).toBe('impulsos');
  });

  test('si hay varios módulos desbloqueados elige el que más encaja con el foco', () => {
    const modules: ModulesProgress = { descarga: done };
    // Con descarga completo, enfriador queda desbloqueado (y es el que mejor encaja con frustración).
    const lesson = lessonOfDay({ focusAreas: ['frustracion'], modules, start: 'descarga', now: NOW });
    expect(lesson.pointer).toEqual({ moduleId: 'enfriador', stage: 0 });
  });

  test('con todo completado propone un repaso de un módulo prioritario', () => {
    const modules = Object.fromEntries(MODULE_ORDER.map((id) => [id, done])) as ModulesProgress;
    const lesson = lessonOfDay({ focusAreas: ['ansiedad'], modules, start: 'descarga', now: NOW });
    expect(lesson.isReview).toBe(true);
    expect(lesson.pointer.moduleId).toBe('ancla');
    expect(lesson.pointer.stage).toBeGreaterThanOrEqual(0);
    expect(lesson.pointer.stage).toBeLessThan(STAGES_PER_MODULE);
  });

  test('el repaso es estable durante el día', () => {
    const modules = Object.fromEntries(MODULE_ORDER.map((id) => [id, done])) as ModulesProgress;
    const morning = lessonOfDay({ focusAreas: [], modules, start: null, now: NOW });
    const night = lessonOfDay({ focusAreas: [], modules, start: null, now: new Date(2026, 9, 19, 22, 0, 0) });
    expect(night.pointer).toEqual(morning.pointer);
  });
});

describe('focusLabel', () => {
  test('cada área tiene una etiqueta legible', () => {
    FOCUS_AREA_IDS.forEach((id) => expect(focusLabel(id).length).toBeGreaterThan(3));
  });
});
