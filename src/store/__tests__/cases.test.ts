import { CASE_SOLVED_XP } from '@/store/slices/casesSlice';
import { DEFAULT_PERSISTED, migrateState } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

const draft = { title: 'Mi examen', impulses: 'Dejarlo todo', thoughts: 'No puedo', frustration: 'Tensión', technique: 'STOP' };

describe('casos en el store', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  test('resolver un caso lo marca y da XP solo la primera vez', () => {
    useAppStore.getState().solveCase('coco-miguel');
    useAppStore.getState().solveCase('coco-miguel');
    const state = useAppStore.getState();
    expect(state.solvedCases).toEqual(['coco-miguel']);
    expect(state.xp).toBe(CASE_SOLVED_XP);
  });

  test('guarda y borra un caso propio', () => {
    useAppStore.getState().addOwnCase(draft);
    const [saved] = useAppStore.getState().ownCases;
    expect(saved.title).toBe('Mi examen');
    expect(saved.id).toMatch(/^case-/);
    useAppStore.getState().removeOwnCase(saved.id);
    expect(useAppStore.getState().ownCases).toEqual([]);
  });

  test('v3 → v4: sin casos previos empieza vacío y conserva el progreso', () => {
    const migrated = migrateState({ ...DEFAULT_PERSISTED, solvedCases: undefined, ownCases: undefined, xp: 12 }, 3);
    expect(migrated.solvedCases).toEqual([]);
    expect(migrated.ownCases).toEqual([]);
    expect(migrated.xp).toBe(12);
  });

  test('descarta casos propios corruptos y ids repetidos', () => {
    const own = { id: 'case-1', ...draft, createdAt: '2026-10-01T10:00:00.000Z' };
    const migrated = migrateState(
      { ...DEFAULT_PERSISTED, solvedCases: ['a', 'a', 3], ownCases: [own, { ...own, id: '' }, { ...own, id: 'case-2', title: 'x'.repeat(500) }] },
      4,
    );
    expect(migrated.solvedCases).toEqual(['a']);
    expect(migrated.ownCases.map((item) => item.id)).toEqual(['case-1']);
  });
});
