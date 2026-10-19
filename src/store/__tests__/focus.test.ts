import { DEFAULT_PERSISTED } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

describe('setFocus', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  test('guarda áreas y momentos sin duplicados y marca el perfil como personalizado', () => {
    useAppStore.getState().setFocus(['impulsos', 'impulsos', 'ansiedad'], ['noche']);
    const state = useAppStore.getState();
    expect(state.focusAreas).toEqual(['impulsos', 'ansiedad']);
    expect(state.hardMoments).toEqual(['noche']);
    expect(state.onboarding.personalized).toBe(true);
  });

  test('elegir cero áreas también cuenta como personalizado (no vuelve a insistir)', () => {
    useAppStore.getState().setFocus([], []);
    expect(useAppStore.getState().onboarding.personalized).toBe(true);
  });

  test('no toca el módulo de inicio ni el progreso', () => {
    useAppStore.setState({ onboarding: { ...DEFAULT_PERSISTED.onboarding, completed: true, firstModule: 'muro' }, xp: 40 });
    useAppStore.getState().setFocus(['impulsos'], []);
    expect(useAppStore.getState().onboarding.firstModule).toBe('muro');
    expect(useAppStore.getState().xp).toBe(40);
  });
});
