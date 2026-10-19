import { DEFAULT_PERSISTED, migrateState } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

const impulse = {
  id: 'i1',
  title: 'Comprar',
  minutes: 20,
  createdAt: '2026-09-30T10:00:00.000Z',
  endsAt: '2026-09-30T10:20:00.000Z',
  status: 'resisted',
  resolvedAt: '2026-09-30T10:25:00.000Z',
  notificationId: null,
};

describe('cronología en el store', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  test('completar una etapa agrega un evento de lección con sus minutos', () => {
    useAppStore.getState().recordStage({ moduleId: 'freno', stage: 1 }, 0.8);
    const [event] = useAppStore.getState().timeline;
    expect(event).toMatchObject({ kind: 'lesson', moduleId: 'freno', stage: 1, score: 0.8 });
    expect(event.kind === 'lesson' && event.minutes).toBeGreaterThan(0);
  });

  test('anotar y resistir un impulso deja dos eventos', () => {
    const { addImpulse, resolveImpulse } = useAppStore.getState();
    addImpulse({ ...impulse, status: 'waiting', resolvedAt: null } as never);
    resolveImpulse('i1', 'resisted');
    expect(useAppStore.getState().timeline.map((event) => event.kind === 'impulse' && event.status)).toEqual(['registered', 'resisted']);
  });

  test('resolver un caso por primera vez agrega un evento; repetirlo no', () => {
    useAppStore.getState().solveCase('coco-miguel');
    useAppStore.getState().solveCase('coco-miguel');
    expect(useAppStore.getState().timeline.filter((event) => event.kind === 'case')).toHaveLength(1);
  });

  test('una insignia nueva queda en la cronología', () => {
    useAppStore.getState().earnReward('badge-freno');
    useAppStore.getState().earnReward('badge-freno');
    expect(useAppStore.getState().timeline.filter((event) => event.kind === 'badge')).toHaveLength(1);
  });

  test('logEvent registra ánimo con id y fecha', () => {
    useAppStore.getState().logEvent({ kind: 'mood', value: 4 });
    const [event] = useAppStore.getState().timeline;
    expect(event).toMatchObject({ kind: 'mood', value: 4 });
    expect(event.id).toMatch(/^ev-/);
    expect(Number.isNaN(Date.parse(event.at))).toBe(false);
  });
});

describe('migración v4 → v5', () => {
  test('rellena la cronología con los impulsos que ya existían', () => {
    const migrated = migrateState({ ...DEFAULT_PERSISTED, timeline: undefined, impulses: [impulse] }, 4);
    expect(migrated.timeline.map((event) => event.kind === 'impulse' && event.status)).toEqual(['registered', 'resisted']);
  });

  test('la etapa de Regi ya vista parte del XP actual (sin celebrar etapas pasadas)', () => {
    expect(migrateState({ ...DEFAULT_PERSISTED, regiStageSeen: undefined, xp: 900 }, 4).regiStageSeen).toBe('adulto');
  });

  test('descarta eventos corruptos y conserva los válidos', () => {
    const good = { id: 'e1', at: '2026-10-01T10:00:00.000Z', kind: 'mood', value: 3 };
    const migrated = migrateState(
      { ...DEFAULT_PERSISTED, timeline: [good, { ...good, id: 'e2', value: 9 }, { ...good, id: 'e3', kind: 'otro' }, { ...good, id: 'e4', at: 'ayer' }] },
      5,
    );
    expect(migrated.timeline.map((event) => event.id)).toEqual(['e1']);
  });
});
