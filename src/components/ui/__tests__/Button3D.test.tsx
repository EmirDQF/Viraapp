import { render, screen, userEvent } from '@testing-library/react-native';

import { Button3D } from '@/components/ui/Button3D';

describe('Button3D', () => {
  test('muestra la etiqueta y se expone como botón accesible', async () => {
    await render(<Button3D label="Iniciar" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Iniciar' })).toBeOnTheScreen();
  });

  test('llama a onPress al pulsarlo', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<Button3D label="Continuar" onPress={onPress} />);

    await user.press(screen.getByRole('button', { name: 'Continuar' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('no llama a onPress cuando está deshabilitado y lo anuncia', async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<Button3D label="Enviar" onPress={onPress} disabled />);

    const button = screen.getByRole('button', { name: 'Enviar' });
    await user.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  test('usa accessibilityLabel propio cuando se indica', async () => {
    await render(<Button3D label="+" accessibilityLabel="Añadir impulso" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Añadir impulso' })).toBeOnTheScreen();
  });
});
