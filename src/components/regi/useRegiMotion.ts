/**
 * Movimiento de Regi: respiración, flotación, parpadeo, branquias que ondean y reacciones (salto, inclinar la
 * cabeza, baile y risa). Todo corre en el hilo de UI y anima solo `transform` y `opacity`.
 * Con "reducir movimiento" Regi queda quieto: sin bucles ni reacciones (la pose sigue cambiando).
 */
import { useEffect } from 'react';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { blinkDelay } from '@/data/regiLines';

export type RegiReaction = 'jump' | 'tilt' | 'dance' | 'laugh';

const BREATH_MS = 1800;
const FLOAT_MS = 2600;
const GILL_MS = 1400;
const BREATH_SCALE = 0.03;
/** Flotación vertical máxima (px) para un Regi de 160 px; escala con el tamaño. */
const FLOAT_PX = 4;
const GILL_DEG = 5;
const BLINK_CLOSE_MS = 70;
const BLINK_OPEN_MS = 120;
const ease = Easing.inOut(Easing.sin);
const BOUNCE = { damping: 9, stiffness: 220, mass: 0.8 } as const;

function loop(value: SharedValue<number>, ms: number, delay = 0): void {
  value.value = withDelay(delay, withRepeat(withTiming(1, { duration: ms, easing: ease }), -1, true));
}

/** Bucles de reposo: respiración, flotación y branquias (izquierda y derecha desfasadas). */
function useIdleLoops(reduceMotion: boolean) {
  const breath = useSharedValue(0);
  const float = useSharedValue(0);
  const gillLeft = useSharedValue(0);
  const gillRight = useSharedValue(0);
  useEffect(() => {
    const values = [breath, float, gillLeft, gillRight];
    if (reduceMotion) {
      values.forEach((value) => {
        cancelAnimation(value);
        value.value = 0;
      });
      return;
    }
    loop(breath, BREATH_MS);
    loop(float, FLOAT_MS);
    loop(gillLeft, GILL_MS);
    loop(gillRight, GILL_MS, GILL_MS / 2);
    return () => values.forEach((value) => cancelAnimation(value));
  }, [breath, float, gillLeft, gillRight, reduceMotion]);
  return { breath, float, gillLeft, gillRight };
}

/** Parpadeo cada 3 a 6 segundos (al azar), con el ojo cerrándose en 70 ms. */
function useBlink(reduceMotion: boolean): SharedValue<number> {
  const blink = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        blink.value = withSequence(withTiming(1, { duration: BLINK_CLOSE_MS }), withTiming(0, { duration: BLINK_OPEN_MS }));
        schedule();
      }, blinkDelay());
    };
    schedule();
    return () => clearTimeout(timer);
  }, [blink, reduceMotion]);
  return blink;
}

/** Reproduce una reacción cada vez que cambia `reactionKey`. */
function useReaction(reaction: RegiReaction | null, reactionKey: number, size: number, reduceMotion: boolean) {
  const lift = useSharedValue(0);
  const tilt = useSharedValue(0);
  const squash = useSharedValue(0);
  const flash = useSharedValue(0);
  useEffect(() => {
    if (!reaction || reduceMotion || reactionKey === 0) return;
    const jumpPx = -size * 0.12;
    if (reaction === 'jump') {
      lift.value = withSequence(withTiming(jumpPx, { duration: 170, easing: Easing.out(Easing.quad) }), withSpring(0, BOUNCE));
      flash.value = withSequence(withTiming(1, { duration: 160 }), withTiming(0, { duration: 600 }));
    } else if (reaction === 'tilt') {
      tilt.value = withSequence(withTiming(-9, { duration: 260, easing: ease }), withDelay(700, withTiming(0, { duration: 360, easing: ease })));
    } else if (reaction === 'dance') {
      tilt.value = withSequence(withRepeat(withSequence(withTiming(10, { duration: 160 }), withTiming(-10, { duration: 160 })), 3), withTiming(0, { duration: 160 }));
      lift.value = withRepeat(withSequence(withTiming(jumpPx / 2, { duration: 160 }), withTiming(0, { duration: 160 })), 3);
      flash.value = withSequence(withTiming(1, { duration: 200 }), withDelay(600, withTiming(0, { duration: 400 })));
    } else {
      squash.value = withSequence(withTiming(1, { duration: 90 }), withTiming(-1, { duration: 90 }), withTiming(1, { duration: 90 }), withSpring(0, BOUNCE));
      lift.value = withSequence(withTiming(jumpPx / 3, { duration: 120 }), withSpring(0, BOUNCE));
    }
  }, [flash, lift, reaction, reactionKey, reduceMotion, size, squash, tilt]);
  return { lift, tilt, squash, flash };
}

/** Estilos animados de cada capa de Regi. */
export function useRegiMotion(size: number, reaction: RegiReaction | null, reactionKey: number, reduceMotion: boolean) {
  const idle = useIdleLoops(reduceMotion);
  const blink = useBlink(reduceMotion);
  const react = useReaction(reaction, reactionKey, size, reduceMotion);
  const floatPx = FLOAT_PX * Math.min(1.5, size / 160);

  const body = useAnimatedStyle(() => {
    const breathe = 1 + idle.breath.value * BREATH_SCALE;
    const squashX = 1 + react.squash.value * 0.06;
    const squashY = 1 - react.squash.value * 0.06;
    return {
      transform: [
        { translateY: (idle.float.value * 2 - 1) * floatPx + react.lift.value },
        { rotate: `${react.tilt.value}deg` },
        { scaleX: breathe * squashX },
        { scaleY: breathe * squashY },
      ],
    };
  });
  const gillLeft = useAnimatedStyle(() => ({ transform: [{ rotate: `${(idle.gillLeft.value * 2 - 1) * GILL_DEG}deg` }] }));
  const gillRight = useAnimatedStyle(() => ({ transform: [{ rotate: `${(1 - idle.gillRight.value * 2) * GILL_DEG}deg` }] }));
  const eyes = useAnimatedStyle(() => ({ transform: [{ scaleY: 1 - blink.value * 0.9 }] }));
  const sparkle = useAnimatedStyle(() => ({ opacity: react.flash.value * 0.55, transform: [{ scale: 0.7 + react.flash.value * 0.4 }] }));
  return { body, gillLeft, gillRight, eyes, sparkle };
}
