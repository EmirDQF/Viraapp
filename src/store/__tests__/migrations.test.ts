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

  test('etapas duplicadas en datos corruptos no cuentan como módulo completo', () => {
    const corrupt = { ...DEFAULT_PERSISTED, modules: { descarga: { completedStages: Array(13).fill(0), bestScores: {}, completedAt: null } } };
    expect(migrateState(corrupt, 2).modules.descarga?.completedStages).toEqual([0]);
  });

  test('un estado ya en v2 se valida y se conserva', () => {
    const v2 = { ...DEFAULT_PERSISTED, xp: 50, dailyGoalMinutes: 15 };
    expect(migrateState(v2, 2)).toEqual(v2);
  });
  test('bienestar: descarta solo los registros corruptos y conserva los válidos', () => {
    const impulse = {
      id: 'i1',
      title: 'Comprar',
      minutes: 20,
      createdAt: '2026-09-30T10:00:00.000Z',
      endsAt: '2026-09-30T10:20:00.000Z',
      status: 'waiting',
      resolvedAt: null,
      notificationId: null,
    };
    const raw = {
      ...DEFAULT_PERSISTED,
      impulses: [impulse, { ...impulse, id: 'i2', endsAt: 'no-es-fecha' }, { ...impulse, id: 'i3', status: 'otro' }, { ...impulse, id: 'i4', minutes: 500 }],
      evidence: [
        { id: 'e1', title: 'Aprobé', icon: 'trophy', date: '2026-09-01', source: 'manual' },
        { id: 'e2', title: 'Mal ícono', icon: 'bomba', date: '2026-09-01', source: 'manual' },
      ],
      contacts: [
        { id: 'c1', name: 'Mamá', phone: '+51987654321' },
        { id: 'c2', name: 'Raro', phone: 'sms:1;evil' },
        { id: 'c3', name: 'B', phone: '987654322' },
        { id: 'c4', name: 'C', phone: '987654323' },
        { id: 'c5', name: 'D', phone: '987654324' },
      ],
      anchorPhotoUri: 42,
    };
    const migrated = migrateState(raw, 2);
    expect(migrated.impulses.map((item) => item.id)).toEqual(['i1']);
    expect(migrated.evidence.map((item) => item.id)).toEqual(['e1']);
    expect(migrated.contacts.map((item) => item.id)).toEqual(['c1', 'c3', 'c4']);
    expect(migrated.anchorPhotoUri).toBeNull();
  });

  test('ajustes: streakRisk falta en datos antiguos y se asume apagado', () => {
    const { streakRisk: _omit, ...oldSettings } = DEFAULT_PERSISTED.settings;
    const migrated = migrateState({ ...DEFAULT_PERSISTED, settings: { ...oldSettings, sounds: false } }, 2);
    expect(migrated.settings.streakRisk).toBe(false);
    expect(migrated.settings.sounds).toBe(false);
  });

  test('legacy corrupto se descarta en lugar de pasar sin validar', () => {
    const migrated = migrateState({ ...DEFAULT_PERSISTED, legacy: 'basura' }, 2);
    expect(migrated.legacy).toBeNull();
  });

  test('legacy válido se conserva en v2', () => {
    const legacy = { activeCrucible: 'academic', crucibleProgress: { academic: {} } };
    const migrated = migrateState({ ...DEFAULT_PERSISTED, legacy }, 2);
    expect(migrated.legacy).toEqual(legacy);
  });
});
