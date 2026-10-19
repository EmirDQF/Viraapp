import { render, screen, userEvent } from '@testing-library/react-native';

import { SosScreen } from '@/features/sos/SosScreen';
import { DEFAULT_PERSISTED } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

// lucide-react-native es ESM y Jest no lo transforma: cualquier ícono se reemplaza por nada.
jest.mock('lucide-react-native', () => new Proxy({}, { get: () => () => null }));
jest.mock('expo-router', () => ({ router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: () => true } }));
jest.mock('@/theme/useReduceMotion', () => ({ useReduceMotion: () => true }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('SOS "Tengo un impulso ahora"', () => {
  beforeEach(() => useAppStore.setState({ ...DEFAULT_PERSISTED }));

  test('intensidad → técnica → ¿cómo estás ahora? guarda el resultado en Mi camino', async () => {
    const user = userEvent.setup();
    await render(<SosScreen />);

    await user.press(screen.getByRole('button', { name: 'Un impulso' }));
    await user.press(screen.getByRole('radio', { name: 'Intensidad 8 de 10' }));
    await user.press(screen.getByRole('button', { name: 'Ayúdame ahora' }));
    await user.press(screen.getByRole('button', { name: 'Ya terminé' }));
    await user.press(screen.getByRole('radio', { name: 'Intensidad 4 de 10' }));
    await user.press(screen.getByRole('button', { name: 'Listo' }));

    expect(screen.getByText(/Bajaste de 8 a 4/)).toBeOnTheScreen();
    const [event] = useAppStore.getState().timeline;
    expect(event).toMatchObject({ kind: 'sos', before: 8, after: 4 });
  });

  test('con intensidad 9 o más muestra las líneas de ayuda desde el primer paso', async () => {
    const user = userEvent.setup();
    await render(<SosScreen />);

    await user.press(screen.getByRole('radio', { name: 'Intensidad 10 de 10' }));

    expect(screen.getByText(/no estás solo/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: /Llamar a Línea 113/ })).toBeOnTheScreen();
  });
});
