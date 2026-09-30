import { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { MODULE_COLORS, brand, feedback } from '@/theme/tokens';
import { useReduceMotion } from '@/theme/useReduceMotion';

const PIECES = 36;
const COLORS = [feedback.gold, brand.coral, feedback.victory, brand.sage, MODULE_COLORS.enfriador.base, brand.petrolBright];

interface PieceSpec {
  readonly x: number;
  readonly delay: number;
  readonly duration: number;
  readonly color: string;
  readonly width: number;
  readonly spin: number;
  readonly drift: number;
}

function ConfettiPiece({ spec, height }: { readonly spec: PieceSpec; readonly height: number }) {
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(spec.delay, withTiming(1, { duration: spec.duration, easing: Easing.in(Easing.quad) }));
  }, [fall, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - fall.value * 0.3,
    transform: [
      { translateY: -40 + fall.value * (height + 80) },
      { translateX: Math.sin(fall.value * Math.PI * 2) * spec.drift },
      { rotate: `${fall.value * spec.spin}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.piece, { left: spec.x, width: spec.width, height: spec.width * 1.6, backgroundColor: spec.color }, style]}
    />
  );
}

/** PRNG determinista (mulberry32): el render debe ser puro, así que no usamos Math.random aquí. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CONFETTI_SEED = 20260929;

function buildPieces(width: number): readonly PieceSpec[] {
  const random = seededRandom(CONFETTI_SEED);
  return Array.from({ length: PIECES }, (_, index) => ({
    x: random() * width,
    delay: random() * 500,
    duration: 1800 + random() * 1400,
    color: COLORS[index % COLORS.length],
    width: 6 + random() * 6,
    spin: 360 + random() * 720,
    drift: 10 + random() * 30,
  }));
}

export function Confetti() {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo(() => buildPieces(width), [width]);
  const reduceMotion = useReduceMotion();
  // Con "reducir movimiento" el confeti no aporta información: se omite.
  if (reduceMotion) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((spec, index) => (
        <ConfettiPiece key={index} spec={spec} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, borderRadius: 2 },
});
