import { useEffect } from 'react';
import { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

/** "rise" del prototipo: sube 46 px, de 94 % a 100 % y de transparente a opaco, con un leve rebote. */
const RISE_EASING = Easing.bezier(0.2, 0.9, 0.3, 1.2);
const RISE_OFFSET = 46;
const RISE_SCALE = 0.06;

/** Anima la entrada cuando `active` pasa a true (o la deja lista de inmediato con "reducir movimiento"). */
export function useRise(active: boolean, delay: number, duration: number, reduceMotion: boolean) {
  const progress = useSharedValue(active && reduceMotion ? 1 : 0);

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }
    progress.value = reduceMotion ? 1 : withDelay(delay, withTiming(1, { duration, easing: RISE_EASING }));
  }, [active, delay, duration, progress, reduceMotion]);

  return useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value),
    transform: [{ translateY: RISE_OFFSET * (1 - progress.value) }, { scale: 1 - RISE_SCALE * (1 - progress.value) }],
  }));
}

/** "fade" del prototipo (burbuja y botones). */
export function useFade(active: boolean, delay: number, reduceMotion: boolean) {
  const progress = useSharedValue(active && reduceMotion ? 1 : 0);

  useEffect(() => {
    if (!active) {
      progress.value = 0;
      return;
    }
    progress.value = reduceMotion ? 1 : withDelay(delay, withTiming(1, { duration: 500 }));
  }, [active, delay, progress, reduceMotion]);

  return useAnimatedStyle(() => ({ opacity: progress.value }));
}
