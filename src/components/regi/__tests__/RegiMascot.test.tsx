import { act, render, screen } from '@testing-library/react-native';

import { EvolvedRegi } from '@/components/regi/EvolvedRegi';
import { InteractiveRegi } from '@/components/regi/InteractiveRegi';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { DEFAULT_PERSISTED } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

// lucide-react-native se publica como ESM y Jest no lo transforma: los íconos no importan en este test.
jest.mock('lucide-react-native', () => ({ Crown: () => null, Leaf: () => null, Sprout: () => null }));
// El mock de reanimated no trae useReducedMotion: se controla directamente nuestro hook.
const mockReduceMotion = jest.fn(() => false);
jest.mock('@/theme/useReduceMotion', () => ({ useReduceMotion: () => mockReduceMotion() }));

describe('RegiMascot', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useAppStore.setState({ ...DEFAULT_PERSISTED });
  });
  afterEach(() => {
    jest.useRealTimers();
    mockReduceMotion.mockReturnValue(false);
  });

  test('se expone como imagen accesible con su estado', async () => {
    await render(<RegiMascot pose="calm" />);
    expect(screen.getByRole('image', { name: /Regi/i })).toBeOnTheScreen();
  });

  test('cambia de pose y reacciona sin romperse (incluido el parpadeo programado)', async () => {
    const view = await render(<RegiMascot pose="calm" />);
    await view.rerender(<RegiMascot pose="empathetic" reaction="tilt" reactionKey={1} />);
    await view.rerender(<RegiMascot pose="growth" reaction="jump" reactionKey={2} />);
    await act(() => jest.advanceTimersByTime(7000));
    expect(screen.getByRole('image', { name: /celebrando/i })).toBeOnTheScreen();
  });

  test('con "reducir movimiento" también se muestra', async () => {
    mockReduceMotion.mockReturnValue(true);
    await render(<RegiMascot pose="resilient" reaction="dance" reactionKey={1} />);
    expect(screen.getByRole('image', { name: /Regi/i })).toBeOnTheScreen();
  });

  test('Regi evolucionado muestra cada etapa', async () => {
    const view = await render(<EvolvedRegi stage="cria" />);
    await view.rerender(<EvolvedRegi stage="sabio" />);
    expect(screen.getByRole('image', { name: /Regi/i })).toBeOnTheScreen();
  });

  test('Regi interactivo es un botón accesible', async () => {
    await render(<InteractiveRegi lines={['Hola']} />);
    expect(screen.getByRole('button', { name: 'Regi' })).toBeOnTheScreen();
  });
});
