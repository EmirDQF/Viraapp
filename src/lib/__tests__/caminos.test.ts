import { moduleProgress, moduleStage, moduleTag, pickPlan, type SituationAnswer } from '@/lib/caminos';

const answer: SituationAnswer = { decision: 0, argument: 0, tension: 3, at: '2026-11-10T10:00:00.000Z' };
const done = { completed: true, step: 0, answers: [], updatedAt: answer.at };

describe('pickPlan ("Que Regi elija")', () => {
  test.each([
    [0, 0],
    [0.5, 1],
    [0.99, 2],
  ])('con random %p termina resaltando y abriendo el camino %p', (random, target) => {
    const plan = pickPlan(random);
    expect(plan.target).toBe(target);
    expect(plan.steps).toHaveLength(10 + target);
    expect(plan.steps[plan.steps.length - 1].index).toBe(target);
  });

  test('cada paso es más lento que el anterior y se abre 450 ms después del último', () => {
    const { steps, openAt } = pickPlan(0);
    const gaps = steps.map((step, k) => step.at - (k === 0 ? 0 : steps[k - 1].at));
    gaps.slice(1).forEach((gap, k) => expect(gap).toBeGreaterThan(gaps[k]));
    expect(openAt - steps[steps.length - 1].at).toBe(450);
  });
});

describe('avance de un módulo', () => {
  test('cuenta solo las actividades que se pueden jugar', () => {
    expect(moduleProgress('muro-evidencia', {})).toEqual({ done: 0, total: 3 });
    expect(moduleProgress('red-recursos', { 'mi-mapa-de-recursos': done, 'aprendo-de-otros': done })).toEqual({ done: 1, total: 2 });
  });

  test('sigue las 4 etapas: situación, práctica, antes y ahora, completo', () => {
    expect(moduleStage(undefined, { done: 0, total: 3 })).toBe('situation');
    expect(moduleStage({ before: answer, after: null }, { done: 0, total: 3 })).toBe('practice');
    expect(moduleStage({ before: answer, after: null }, { done: 1, total: 3 })).toBe('compare');
    expect(moduleStage({ before: answer, after: answer }, { done: 1, total: 3 })).toBe('done');
  });

  test('etiqueta de avance para las listas', () => {
    expect(moduleTag({ done: 0, total: 3 }, false)).toBe('Empezar');
    expect(moduleTag({ done: 0, total: 3 }, true)).toBe('En curso');
    expect(moduleTag({ done: 1, total: 3 }, true)).toBe('1 de 3');
    expect(moduleTag({ done: 3, total: 3 }, true)).toBe('Completo');
  });
});
