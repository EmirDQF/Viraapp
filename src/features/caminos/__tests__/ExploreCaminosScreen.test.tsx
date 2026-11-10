import { render, screen, userEvent } from '@testing-library/react-native';
import { router } from 'expo-router';

import { ExploreCaminosScreen } from '@/features/caminos/ExploreCaminosScreen';
import { DEFAULT_PERSISTED } from '@/store/migrations';
import { useAppStore } from '@/store/useAppStore';

// lucide-react-native es ESM y Jest no lo transforma: cualquier ícono se reemplaza por nada.
jest.mock('lucide-react-native', () => new Proxy({}, { get: () => () => null }));
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: () => true },
  useFocusEffect: jest.fn(),
}));
jest.mock('@/theme/useReduceMotion', () => ({ useReduceMotion: () => true }));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

function renderWithStage() {
  return render(<ExploreCaminosScreen />);
}

describe('Explorar · De la ruleta a los caminos', () => {
  beforeEach(() => {
    useAppStore.setState({ ...DEFAULT_PERSISTED });
    jest.clearAllMocks();
  });

  test('al tocar a Regi aparecen los 3 caminos con sus conteos', async () => {
    const user = userEvent.setup();
    await renderWithStage();

    await user.press(screen.getByRole('button', { name: 'Regi: tocar para ver los caminos' }));

    expect(screen.getByRole('button', { name: 'Camino 1: Reconocer mis recursos. 2 módulos · 6 actividades' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Camino 2: Comprender mis respuestas. 3 módulos · 11 actividades' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Camino 3: Elegir cómo actuar. 2 módulos · 8 actividades' })).toBeOnTheScreen();
  });

  test('un camino abre sus paradas y cada módulo lleva a su pantalla', async () => {
    const user = userEvent.setup();
    await renderWithStage();
    await user.press(screen.getByRole('button', { name: 'Regi: tocar para ver los caminos' }));

    await user.press(screen.getByRole('button', { name: /Camino 2: Comprender mis respuestas/ }));
    await user.press(screen.getByRole('button', { name: /Bajo Presión\. Estrés y tipos de estrés · 3 actividades\. Nuevo/ }));

    expect(router.push).toHaveBeenCalledWith({ pathname: '/camino/modulo/[id]', params: { id: 'bajo-presion' } });
  });

  test('"Regi recomienda" abre "Vuelve a tu centro"', async () => {
    const user = userEvent.setup();
    await renderWithStage();
    await user.press(screen.getByRole('button', { name: 'Regi: tocar para ver los caminos' }));
    await user.press(screen.getByRole('button', { name: /Camino 2: Comprender mis respuestas/ }));

    await user.press(screen.getByText(/prueba “Vuelve a tu centro”/));

    expect(router.push).toHaveBeenCalledWith('/technique/grounding');
    expect(useAppStore.getState().caminoActivities['vuelve-a-tu-centro']).toMatchObject({ completed: false });
  });

  test('"Ver los 7 módulos" lista los 7 módulos activos', async () => {
    const user = userEvent.setup();
    await renderWithStage();
    await user.press(screen.getByRole('button', { name: 'Regi: tocar para ver los caminos' }));

    await user.press(screen.getByRole('button', { name: 'Ver los 7 módulos' }));

    expect(screen.getByText('Los 7 módulos')).toBeOnTheScreen();
    ['Muro de Evidencia', 'Red de Recursos', 'Hoy en Fácil', 'Detrás del Impulso', 'Punto de Giro', 'Toma el Mando'].forEach((title) =>
      expect(screen.getAllByText(title).length).toBeGreaterThan(0),
    );
    expect(screen.getAllByText('Bajo Presión').length).toBeGreaterThan(0);
  });
});
