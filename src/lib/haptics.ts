import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticKind = 'light' | 'medium' | 'selection' | 'success' | 'error' | 'warning' | 'none';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

function run(effect: () => Promise<void>): void {
  // La vibración es un extra: si el dispositivo no la soporta, se ignora sin interrumpir al usuario.
  effect().catch(() => undefined);
}

export function haptic(kind: HapticKind): void {
  if (!isSupported || kind === 'none') {
    return;
  }
  switch (kind) {
    case 'light':
      run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
      return;
    case 'selection':
      run(() => Haptics.selectionAsync());
      return;
    case 'medium':
      run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
      return;
    case 'success':
      run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
      return;
    case 'error':
      run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
      return;
    case 'warning':
      run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
      return;
  }
}
