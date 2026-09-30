import { fireEvent, render, screen, userEvent } from '@testing-library/react-native';

import { ChoiceGroup, SettingSwitch } from '@/features/settings/SettingControls';

const OPTIONS = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
] as const;

describe('controles de ajustes', () => {
  test('ChoiceGroup marca la opción elegida y avisa del cambio', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    await render(<ChoiceGroup label="Meta" options={OPTIONS} value={5} onChange={onChange} />);

    expect(screen.getByRole('radio', { name: 'Meta: 5 min' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Meta: 10 min' })).not.toBeChecked();

    await user.press(screen.getByRole('radio', { name: 'Meta: 10 min' }));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  test('ChoiceGroup deshabilitado no cambia', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    await render(<ChoiceGroup label="Meta" options={OPTIONS} value={5} onChange={onChange} disabled />);

    await user.press(screen.getByRole('radio', { name: 'Meta: 10 min' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('SettingSwitch expone su estado y lo alterna', async () => {
    const onChange = jest.fn();
    await render(<SettingSwitch label="Sonidos" value={false} onChange={onChange} />);

    const control = screen.getByRole('switch', { name: 'Sonidos' });
    expect(control).not.toBeChecked();
    fireEvent(control, 'valueChange', true);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
