import { economicCrucible } from '@/data/crucibles/economic';
import { buildModules } from '@/data/modules';
import {
  EMPTY_PROGRESS,
  applyRecord,
  isPathComplete,
  markCompleted,
  moduleStatus,
  refillEnergy,
  spendEnergy,
  xpForModule,
} from '@/lib/progress';

describe('moduleStatus', () => {
  it('el primer módulo siempre está desbloqueado', () => {
    expect(moduleStatus('m1-acceptance', [])).toBe('unlocked');
  });

  it('bloquea un módulo si el anterior no está completo', () => {
    expect(moduleStatus('m3-anchoring', ['m1-acceptance'])).toBe('locked');
  });

  it('desbloquea el siguiente al completar el anterior', () => {
    expect(moduleStatus('m2-distortions', ['m1-acceptance'])).toBe('unlocked');
  });

  it('marca como completado', () => {
    expect(moduleStatus('m1-acceptance', ['m1-acceptance'])).toBe('completed');
  });
});

describe('isPathComplete', () => {
  it('requiere los 5 módulos', () => {
    expect(isPathComplete(['m1-acceptance', 'm2-distortions'])).toBe(false);
    expect(
      isPathComplete(['m1-acceptance', 'm2-distortions', 'm3-anchoring', 'm4-micro-actions', 'm5-manifesto']),
    ).toBe(true);
  });
});

describe('xpForModule', () => {
  const [module] = buildModules(economicCrucible);

  it('da bonus completo sin errores', () => {
    expect(xpForModule(module, 0)).toBe(module.xp + 10);
  });

  it('el bonus nunca es negativo', () => {
    expect(xpForModule(module, 20)).toBe(module.xp);
  });
});

describe('transiciones inmutables', () => {
  it('markCompleted no duplica ni muta', () => {
    const once = markCompleted(EMPTY_PROGRESS, 'm1-acceptance');
    expect(once.completedModules).toEqual(['m1-acceptance']);
    expect(EMPTY_PROGRESS.completedModules).toEqual([]);
    expect(markCompleted(once, 'm1-acceptance')).toBe(once);
  });

  it('applyRecord guarda cada tipo de registro', () => {
    const withMantra = applyRecord(EMPTY_PROGRESS, { kind: 'mantra', mantra: 'Paso a paso' });
    const withAction = applyRecord(withMantra, { kind: 'micro-action', challengeId: 'emc1', commitment: 'Hoy' });
    const withRules = applyRecord(withAction, { kind: 'rules', ruleIds: ['er1', 'er2', 'er3'] });
    const withReframe = applyRecord(withRules, { kind: 'reframe', text: 'Tengo deudas...' });
    expect(withReframe).toEqual({
      completedModules: [],
      mantra: 'Paso a paso',
      microAction: { challengeId: 'emc1', commitment: 'Hoy' },
      ruleIds: ['er1', 'er2', 'er3'],
      reframe: 'Tengo deudas...',
    });
  });

  it('la energía no baja de 0 y se recarga al máximo', () => {
    expect(spendEnergy({ current: 0, max: 5 }).current).toBe(0);
    expect(spendEnergy({ current: 3, max: 5 }).current).toBe(2);
    expect(refillEnergy({ current: 1, max: 5 }).current).toBe(5);
  });
});

describe('buildModules', () => {
  it('genera 5 módulos en orden con ejercicios', () => {
    const modules = buildModules(economicCrucible);
    expect(modules.map((m) => m.order)).toEqual([1, 2, 3, 4, 5]);
    modules.forEach((m) => expect(m.exercises.length).toBeGreaterThan(1));
  });
});
