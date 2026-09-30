import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { withAlpha } from '@/lib/color';
import { brand, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ProgressBarProps {
  readonly value: number; // 0..1
  readonly color?: string;
  readonly height?: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/** Barra de progreso animada con brillo; en 0 no muestra relleno. */
export function ProgressBar({ value, color, height = 16 }: ProgressBarProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(clamp(value));

  useEffect(() => {
    const target = clamp(value);
    progress.set(reduceMotion ? target : withTiming(target, { duration: 450, easing: Easing.out(Easing.cubic) }));
  }, [progress, reduceMotion, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.get() * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamp(value) * 100) }}
      style={[styles.track, { height, backgroundColor: colors.border }]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: color ?? colors.success }, fillStyle]}>
        <View style={[styles.shine, { top: Math.max(2, height * 0.2), backgroundColor: withAlpha(brand.white, 0.35) }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  shine: { position: 'absolute', left: 6, right: 6, height: 3, borderRadius: radius.pill },
});
