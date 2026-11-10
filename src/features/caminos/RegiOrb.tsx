import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { caminos } from '@/features/caminos/theme';

const REGI_IMAGE = require('../../../assets/regi-avatar.png');

/** Medidas del prototipo (px dentro del escenario). */
export const ORB_SIZE = 180;
export const ORB_TOP = 169;
const CORNER_SIZE = 64;
const CORNER_TOP = 14;
const CORNER_RIGHT = 20;
const RING_SIZE = 270;

const MOVE_MS = 650;
const FLOAT_MS = 3200;
const PULSE_MS = 2400;
const SPIN_MS = 1150;
const MOVE_EASING = Easing.bezier(0.5, -0.15, 0.25, 1.15);

export type OrbMode = 'center' | 'spin' | 'corner';

interface RegiOrbProps {
  readonly mode: OrbMode;
  readonly stageWidth: number;
  readonly reduceMotion: boolean;
  readonly onPress: () => void;
}

/** Arco de un anillo (en grados, 0 = arriba, sentido horario), como el `conic-gradient` del prototipo. */
function arcPath(from: number, to: number, radius: number, center: number): string {
  const point = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${center + radius * Math.cos(rad)} ${center + radius * Math.sin(rad)}`;
  };
  return `M ${point(from)} A ${radius} ${radius} 0 0 1 ${point(to)}`;
}

/** Banda del 55 % al 70 % del radio: 108° por camino con 12° de separación. */
const RING_RADIUS = (RING_SIZE / 2) * 0.625;
const RING_STROKE = (RING_SIZE / 2) * 0.15;
const RING_ARCS = [
  { color: caminos.c1, from: 0, to: 108 },
  { color: caminos.c2, from: 120, to: 228 },
  { color: caminos.c3, from: 240, to: 348 },
];

/** Anillo que late hacia afuera (0 → 1 en bucle) mientras Regi espera. */
function usePulse(delay: number, active: boolean): SharedValue<number> {
  const value = useSharedValue(0);
  useEffect(() => {
    if (!active) {
      cancelAnimation(value);
      value.value = 0;
      return;
    }
    value.value = 0;
    value.value = withDelay(delay, withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.ease) }), -1, false));
  }, [active, delay, value]);
  return value;
}

/**
 * Regi en lugar de la ruleta: espera en el centro flotando y latiendo; al tocarlo salta y gira un anillo con
 * los colores de los 3 caminos; después sube a la esquina superior derecha.
 */
export function RegiOrb({ mode, stageWidth, reduceMotion, onPress }: RegiOrbProps) {
  const corner = useSharedValue(mode === 'corner' ? 1 : 0);
  const float = useSharedValue(0);
  const hopScale = useSharedValue(1);
  const hopRotate = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.7);
  const ringRotate = useSharedValue(0);

  const idle = mode === 'center' && !reduceMotion;
  const pulseA = usePulse(0, idle);
  const pulseB = usePulse(PULSE_MS / 2, idle);

  useEffect(() => {
    const target = mode === 'corner' ? 1 : 0;
    corner.value = reduceMotion ? target : withTiming(target, { duration: MOVE_MS, easing: MOVE_EASING });
  }, [corner, mode, reduceMotion]);

  useEffect(() => {
    if (!idle) {
      cancelAnimation(float);
      float.value = withTiming(0, { duration: 200 });
      return;
    }
    const half = { duration: FLOAT_MS / 2, easing: Easing.inOut(Easing.ease) };
    float.value = withRepeat(withSequence(withTiming(1, half), withTiming(0, half)), -1, false);
  }, [float, idle]);

  useEffect(() => {
    if (mode !== 'spin' || reduceMotion) return;
    // "hop": 18 % · 45 % · 70 % · 100 % de 1150 ms.
    const at = (from: number, to: number) => ({ duration: Math.round(SPIN_MS * (to - from)), easing: Easing.inOut(Easing.ease) });
    hopScale.value = withSequence(withTiming(0.88, at(0, 0.18)), withTiming(1.12, at(0.18, 0.45)), withTiming(0.97, at(0.45, 0.7)), withTiming(1, at(0.7, 1)));
    hopRotate.value = withSequence(withTiming(-6, at(0, 0.18)), withTiming(6, at(0.18, 0.45)), withTiming(-3, at(0.45, 0.7)), withTiming(0, at(0.7, 1)));
    // "spin": 15 % · 80 % · 100 %.
    const spinAt = (from: number, to: number) => ({ duration: Math.round(SPIN_MS * (to - from)), easing: Easing.bezier(0.2, 0.7, 0.2, 1) });
    ringRotate.value = 0;
    ringRotate.value = withSequence(withTiming(160, spinAt(0, 0.15)), withTiming(660, spinAt(0.15, 0.8)), withTiming(720, spinAt(0.8, 1)));
    ringScale.value = 0.7;
    ringScale.value = withSequence(withTiming(1, spinAt(0, 0.15)), withTiming(1.04, spinAt(0.15, 0.8)), withTiming(1.6, spinAt(0.8, 1)));
    ringOpacity.value = withSequence(withTiming(1, spinAt(0, 0.15)), withTiming(1, spinAt(0.15, 0.8)), withTiming(0, spinAt(0.8, 1)));
  }, [hopRotate, hopScale, mode, reduceMotion, ringOpacity, ringRotate, ringScale]);

  const dx = stageWidth - CORNER_RIGHT - CORNER_SIZE / 2 - stageWidth / 2;
  const dy = CORNER_TOP + CORNER_SIZE / 2 - (ORB_TOP + ORB_SIZE / 2);
  const cornerScale = CORNER_SIZE / ORB_SIZE;

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dx * corner.value },
      { translateY: dy * corner.value },
      { scale: 1 + (cornerScale - 1) * corner.value },
    ],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * float.value }, { scale: hopScale.value }, { rotate: `${hopRotate.value}deg` }],
  }));
  const pulseStyleA = useAnimatedStyle(() => ({ opacity: idle ? 0.55 * (1 - pulseA.value) : 0, transform: [{ scale: 1 + 0.45 * pulseA.value }] }));
  const pulseStyleB = useAnimatedStyle(() => ({ opacity: idle ? 0.55 * (1 - pulseB.value) : 0, transform: [{ scale: 1 + 0.45 * pulseB.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }, { rotate: `${ringRotate.value}deg` }],
  }));

  const inCorner = mode === 'corner';
  return (
    <Animated.View style={[styles.wrapper, { left: (stageWidth - ORB_SIZE) / 2 }, wrapperStyle]} pointerEvents="box-none">
      <Animated.View pointerEvents="none" style={[styles.ring, ringStyle]}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          {RING_ARCS.map((arc) => (
            <Path key={arc.color} d={arcPath(arc.from, arc.to, RING_RADIUS, RING_SIZE / 2)} stroke={arc.color} strokeWidth={RING_STROKE} fill="none" />
          ))}
        </Svg>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.pulse, pulseStyleA]} />
      <Animated.View pointerEvents="none" style={[styles.pulse, pulseStyleB]} />
      <Pressable
        onPress={onPress}
        disabled={mode === 'spin'}
        accessibilityRole="button"
        accessibilityLabel={inCorner ? 'Regi: volver al inicio de Explorar' : 'Regi: tocar para ver los caminos'}
        style={styles.press}
      >
        <Animated.View style={[styles.shadow, imageStyle]}>
          <Image source={REGI_IMAGE} style={styles.image} contentFit="cover" accessibilityIgnoresInvertColors />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

/** Avatar circular de Regi (consejos y burbujas). */
export function RegiAvatar({ size }: { readonly size: number }) {
  return <Image source={REGI_IMAGE} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" accessible={false} />;
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', top: ORB_TOP, width: ORB_SIZE, height: ORB_SIZE, zIndex: 10 },
  ring: {
    position: 'absolute',
    left: (ORB_SIZE - RING_SIZE) / 2,
    top: (ORB_SIZE - RING_SIZE) / 2,
    width: RING_SIZE,
    height: RING_SIZE,
  },
  pulse: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    borderWidth: 3,
    borderColor: caminos.c3,
  },
  press: { width: ORB_SIZE, height: ORB_SIZE },
  shadow: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: caminos.mint,
    shadowColor: caminos.regiShadow,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  image: { width: ORB_SIZE, height: ORB_SIZE, borderRadius: ORB_SIZE / 2 },
});

