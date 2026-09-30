import * as Haptics from 'expo-haptics';

import { haptic, hapticsEnabled, setHapticsEnabled } from '@/lib/haptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error', Warning: 'warning' },
}));

describe('vibración', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setHapticsEnabled(true);
  });

  test('traduce cada tipo a la API de expo-haptics', () => {
    haptic('light');
    haptic('medium');
    haptic('selection');
    haptic('success');
    haptic('error');
    haptic('warning');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('success');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('error');
    expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
  });

  test('"none" no vibra', () => {
    haptic('none');
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  test('respeta el ajuste de vibración desactivada', () => {
    setHapticsEnabled(false);
    expect(hapticsEnabled()).toBe(false);
    haptic('success');
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
  });

  test('un fallo del dispositivo no se propaga', async () => {
    jest.mocked(Haptics.selectionAsync).mockRejectedValueOnce(new Error('sin motor'));
    expect(() => haptic('selection')).not.toThrow();
    await Promise.resolve();
  });
});
