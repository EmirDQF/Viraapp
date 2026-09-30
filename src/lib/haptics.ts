import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type HapticKind = 'light' | 'medium' | 'selection' | 'success' | 'error' | 'warning' | 'none';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/**
 * Interruptor global que refleja el ajuste "Vibración". Lo sincroniza el layout raíz con el store, para
 * que cualquier `haptic()` (botones, juego, dial) respete la preferencia sin leer el store desde `lib/`.
 */
let enabled = true;

export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

export function hapticsEnabled(): boolean {
  return enabled;
}

function run(effect: () => Promise<void>): void {
  // La vibración es un extra: si el dispositivo no la soporta, se ignora sin interrumpir al usuario.
  effect().catch(() => undefined);
}

export function haptic(kind: HapticKind): void {
  if (!isSupported || !enabled || kind === 'none') {
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
