import { render, screen, userEvent } from '@testing-library/react-native';
import { ScrollView } from 'react-native';

import { ChoiceButton } from '@/features/game/ChoiceButton';

// lucide-react-native se publica como ESM y Jest no lo transforma: cada ícono se sustituye por un componente vacío.
jest.mock('lucide-react-native', () => new Proxy({ __esModule: true }, { get: (target, key) => (key in target ? target[key as '__esModule'] : () => null) }));
// El mock de reanimated no incluye useReducedMotion.
jest.mock('@/theme/useReduceMotion', () => ({ useReduceMotion: () => false }));

describe('ChoiceButton', () => {
  test('llama a onPress al pulsar la opción dentro de un ScrollView', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <ScrollView>
        <ChoiceButton label="Escribirlo en una nota" badge="B" onPress={onPress} />
      </ScrollView>,
    );

    await user.press(screen.getByRole('button', { name: 'Opción B: Escribirlo en una nota' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('anuncia el estado correcto', async () => {
    await render(<ChoiceButton label="Respirar" badge="A" state="correct" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Opción A: Respirar, correcta' })).toBeOnTheScreen();
  });

  test('no llama a onPress cuando está deshabilitada', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<ChoiceButton label="Esperar" badge="C" disabled onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Opción C: Esperar' }));

    expect(onPress).not.toHaveBeenCalled();
  });
});
