import { useReducedMotion } from 'react-native-reanimated';

import { useAppStore } from '@/store/useAppStore';

/**
 * true si hay que reducir el movimiento: por la preferencia del sistema o por el ajuste "Reducir movimiento"
 * de VIRA. Las animaciones de entrada (FadeIn, ZoomIn…) y los `with*` se reducen además de forma global con
 * `ReducedMotionConfig` en el layout raíz.
 * Ojo: reanimated lee la preferencia del sistema una sola vez al arrancar; si se cambia con la app abierta,
 * se aplica al reiniciarla. El ajuste de VIRA sí es inmediato.
 */
export function useReduceMotion(): boolean {
  const system = useReducedMotion();
  const setting = useAppStore((state) => state.settings.reduceMotion);
  return system || setting;
}
