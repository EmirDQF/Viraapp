import { ACTIVITY_XP } from '@/lib/caminos';
import { DEFAULT_PERSISTED, migrateState } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

beforeEach(() => {
  useAppStore.setState({ ...DEFAULT_PERSISTED });
});

describe('caminos en el store', () => {
  test('guarda la respuesta inicial y la de "Antes y ahora" sin exigir que la tensión baje', () => {
    const { saveSituation } = useAppStore.getState();
    saveSituation('bajo-presion', 'before', { decision: 1, argument: 2, tension: 2 });
    saveSituation('bajo-presion', 'after', { decision: 0, argument: 0, tension: 4 });
    const journey = useAppStore.getState().caminoJourneys['bajo-presion'];
    expect(journey?.before).toMatchObject({ decision: 1, argument: 2, tension: 2 });
    expect(journey?.after).toMatchObject({ decision: 0, argument: 0, tension: 4 });
  });

  test('la tensión se limita a la escala de 1 a 5', () => {
    useAppStore.getState().saveSituation('punto-giro', 'before', { decision: 0, argument: 0, tension: 9 });
    expect(useAppStore.getState().caminoJourneys['punto-giro']?.before?.tension).toBe(5);
  });

  test('pausar, reintentar y finalizar una actividad', () => {
    const store = useAppStore.getState();
    store.pauseActivity('efecto-domino', 2, [0, 1]);
    expect(useAppStore.getState().caminoActivities['efecto-domino']).toMatchObject({ completed: false, step: 2, answers: [0, 1] });

    store.restartActivity('efecto-domino');
    expect(useAppStore.getState().caminoActivities['efecto-domino']).toMatchObject({ step: 0, answers: [] });

    store.completeActivity('efecto-domino');
    expect(useAppStore.getState().caminoActivities['efecto-domino']?.completed).toBe(true);
    expect(useAppStore.getState().xp).toBe(ACTIVITY_XP);
  });

  test('solo suma XP la primera vez que se completa', () => {
    const store = useAppStore.getState();
    store.completeActivity('mapa-de-senales');
    store.completeActivity('mapa-de-senales');
    expect(useAppStore.getState().xp).toBe(ACTIVITY_XP);
  });

  test('ignora actividades que no existen', () => {
    useAppStore.getState().completeActivity('no-existe');
    expect(useAppStore.getState().caminoActivities).toEqual({});
  });
});

describe('migración v6', () => {
  test('un estado v5 sin caminos empieza vacío', () => {
    const state = migrateState({ xp: 30 }, 5);
    expect(state.caminoJourneys).toEqual({});
    expect(state.caminoActivities).toEqual({});
    expect(state.xp).toBe(30);
  });

  test('descarta módulos, actividades y valores que no reconoce', () => {
    const at = '2026-11-10T10:00:00.000Z';
    const state = migrateState(
      {
        caminoJourneys: {
          'muro-evidencia': { before: { decision: 1, argument: 0, tension: 3, at }, after: null },
          'modulo-viejo': { before: null, after: null },
          'toma-mando': { before: { decision: 99, argument: 0, tension: 3, at }, after: null },
        },
        caminoActivities: {
          'semaforo-en-accion': { completed: true, step: 0, answers: [], updatedAt: at },
          'actividad-borrada': { completed: true, step: 0, answers: [], updatedAt: at },
          'efecto-domino': { completed: 'si', step: 0, answers: [], updatedAt: at },
        },
      },
      6,
    );
    expect(Object.keys(state.caminoJourneys)).toEqual(['muro-evidencia']);
    expect(Object.keys(state.caminoActivities)).toEqual(['semaforo-en-accion']);
  });
});
