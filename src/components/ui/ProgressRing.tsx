import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  readonly value: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly children?: ReactNode;
  readonly accessibilityLabel?: string;
  readonly durationMs?: number;
}

export const clampProgress = (value: number): number => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/** Anillo de progreso circular animado (temporizadores, medidores del espejo emocional). */
export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 12,
  color,
  trackColor,
  children,
  accessibilityLabel,
  durationMs = 500,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(clampProgress(value));
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    const target = clampProgress(value);
    progress.value = reduceMotion ? target : withTiming(target, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [durationMs, progress, reduceMotion, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampProgress(value) * 100) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} style={styles.svg}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor ?? colors.border} strokeWidth={strokeWidth} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color ?? colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: { transform: [{ rotate: '-90deg' }] },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
