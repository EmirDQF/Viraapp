import { render, screen, userEvent } from '@testing-library/react-native';

import { getActivity } from '@/data/caminos/activities';
import type { FlowActivity } from '@/data/caminos/types';
import { ActivityFlowScreen } from '@/features/caminos/ActivityFlowScreen';
import { CaminoModuleScreen } from '@/features/caminos/CaminoModuleScreen';
import { DEFAULT_PERSISTED } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

jest.mock('lucide-react-native', () => new Proxy({}, { get: () => () => null }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: () => true } }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const at = '2026-11-10T10:00:00.000Z';

describe('módulo PA3 en 4 etapas', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  test('01 · la situación inicial guarda decisión, argumento y tensión', async () => {
    const user = userEvent.setup();
    await render(<CaminoModuleScreen moduleId="bajo-presion" />);

    await user.press(screen.getByRole('radio', { name: 'Organizo mis pendientes y me doy pausas' }));
    await user.press(screen.getByRole('radio', { name: 'Mi cuerpo me está avisando algo' }));
    await user.press(screen.getByRole('radio', { name: '4: Bastante' }));
    await user.press(screen.getByRole('button', { name: 'Guardar y empezar' }));

    expect(useAppStore.getState().caminoJourneys['bajo-presion']?.before).toMatchObject({ decision: 0, argument: 0, tension: 4 });
    expect(screen.getByText('Tu primera respuesta')).toBeOnTheScreen();
  });

  test('04 · antes y ahora compara sin exigir que baje la tensión', async () => {
    useAppStore.setState({
      caminoJourneys: {
        'punto-giro': { before: { decision: 1, argument: 1, tension: 2, at }, after: { decision: 0, argument: 0, tension: 4, at } },
      },
      caminoActivities: { 'efecto-domino': { completed: true, step: 0, answers: [], updatedAt: at } },
    });
    await render(<CaminoModuleScreen moduleId="punto-giro" />);

    expect(screen.getByText(/Lo que practicaste: Efecto dominó/)).toBeOnTheScreen();
    expect(screen.getByText('Antes 2 de 5 · Ahora 4 de 5')).toBeOnTheScreen();
    expect(screen.getByText(/notarlo también es avanzar/)).toBeOnTheScreen();
  });
});

describe('actividad que se juega', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  const activity = getActivity('semaforo-en-accion');
  if (!activity || activity.content.kind !== 'flow') throw new Error('falta la actividad de prueba');
  const flow: FlowActivity = activity.content;

  test('pausar guarda el paso para retomarlo después', async () => {
    const user = userEvent.setup();
    await render(<ActivityFlowScreen activity={activity} flow={flow} />);

    await user.press(screen.getByRole('button', { name: 'Se detiene y respira antes de decir nada' }));
    expect(screen.getByText(/Rojo es parar/)).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Siguiente' }));
    await user.press(screen.getByRole('button', { name: 'Pausar' }));

    expect(useAppStore.getState().caminoActivities['semaforo-en-accion']).toMatchObject({ completed: false, step: 1, answers: [0] });
  });

  test('responder todos los pasos y finalizar completa la actividad', async () => {
    const user = userEvent.setup();
    await render(<ActivityFlowScreen activity={activity} flow={flow} />);

    for (const step of flow.steps) {
      await user.press(screen.getByRole('button', { name: step.options[0].text }));
      await user.press(screen.getByRole('button', { name: /Siguiente|Ver cierre/ }));
    }
    expect(screen.getByText(flow.takeaway)).toBeOnTheScreen();
    await user.press(screen.getByRole('button', { name: 'Finalizar' }));

    expect(useAppStore.getState().caminoActivities['semaforo-en-accion']?.completed).toBe(true);
  });
});
