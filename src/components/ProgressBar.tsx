import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { lighten, withAlpha } from '@/lib/color';
import { spring } from '@/theme/motion';
import { brand, radius, type GradientStops } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

interface ProgressBarProps {
  readonly value: number; // 0..1
  readonly color?: string;
  /** Degradado del relleno (por defecto, derivado de `color`: más claro a la izquierda). */
  readonly gradient?: GradientStops;
  readonly height?: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
const SHINE_ALPHA = 0.4;
const GLOW_OPACITY = 0.45;

/**
 * Barra de progreso gruesa: relleno con degradado, brillo superior y un halo del mismo color; avanza con un
 * resorte suave. En 0 no muestra relleno.
 */
export function ProgressBar({ value, color, gradient, height = 16 }: ProgressBarProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(clamp(value));
  const base = color ?? colors.success;
  const stops = gradient ?? [lighten(base, 0.25), base];

  useEffect(() => {
    const target = clamp(value);
    progress.set(reduceMotion ? target : withSpring(target, spring.gentle));
  }, [progress, reduceMotion, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamp(value) * 100) }}
      style={[styles.track, { height, backgroundColor: colors.border }]}
    >
      <Animated.View
        style={[
          styles.fill,
          { backgroundColor: base, shadowColor: base, shadowOpacity: GLOW_OPACITY, shadowRadius: height / 2 },
          fillStyle,
        ]}
      >
        <LinearGradient colors={stops} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        <View
          style={[styles.shine, { top: Math.max(2, height * 0.2), height: Math.max(3, height * 0.2), backgroundColor: withAlpha(brand.white, SHINE_ALPHA) }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  shine: { position: 'absolute', left: 6, right: 6, borderRadius: radius.pill },
});
