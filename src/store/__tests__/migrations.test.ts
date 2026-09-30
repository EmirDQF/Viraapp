import { DEFAULT_PERSISTED, STORE_VERSION, migrateState } from '@/store/migrations';

const V1_STATE = {
  user: { name: 'Ana', birthDate: '2003-04-10', createdAt: '2026-01-01T10:00:00.000Z' },
  activeCrucible: 'academic',
  progress: { academic: { completedModules: ['m1-acceptance'], mantra: 'Paso a paso.' } },
  xp: 120,
  streak: { count: 4, lastActiveDate: '2026-09-20' },
  energy: { current: 3, max: 5 },
};

describe('migrateState', () => {
  test('la versión actual del store es la 2', () => {
    expect(STORE_VERSION).toBe(2);
  });

  test('v1 → v2 conserva usuario, XP y racha', () => {
    const migrated = migrateState(V1_STATE, 1);
    expect(migrated.user).toEqual(V1_STATE.user);
    expect(migrated.xp).toBe(120);
    expect(migrated.streak).toEqual({ count: 4, lastActiveDate: '2026-09-20' });
  });

  test('v1 → v2 guarda el progreso de los crisoles como legado, sin perderlo', () => {
    const migrated = migrateState(V1_STATE, 1);
    expect(migrated.legacy).toEqual({ activeCrucible: 'academic', crucibleProgress: V1_STATE.progress });
  });

  test('v1 → v2 descarta las vidas/energía (VIRA no castiga los errores)', () => {
    const migrated = migrateState(V1_STATE, 1) as unknown as Record<string, unknown>;
    expect(migrated.energy).toBeUndefined();
  });

  test('un usuario existente no repite el onboarding', () => {
    expect(migrateState(V1_STATE, 1).onboarding.completed).toBe(true);
    expect(migrateState({ ...V1_STATE, user: null }, 1).onboarding.completed).toBe(false);
  });

  test('empieza el recorrido nuevo desde cero', () => {
    const migrated = migrateState(V1_STATE, 1);
    expect(migrated.modules).toEqual({});
    expect(migrated.lastPlayed).toBeNull();
  });

  test('datos corruptos o vacíos no rompen la app: se usan los valores por defecto', () => {
    expect(migrateState(null, 1)).toEqual(DEFAULT_PERSISTED);
    expect(migrateState('basura', 1)).toEqual(DEFAULT_PERSISTED);
    const partial = migrateState({ user: { name: 42 }, xp: -5, streak: 'x' }, 1);
    expect(partial.user).toBeNull();
    expect(partial.xp).toBe(0);
    expect(partial.streak).toEqual(DEFAULT_PERSISTED.streak);
  });

  test('un estado ya en v2 se valida y se conserva', () => {
    const v2 = { ...DEFAULT_PERSISTED, xp: 50, dailyGoalMinutes: 15 };
    expect(migrateState(v2, 2)).toEqual(v2);
  });
});
