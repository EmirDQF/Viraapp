import { useEffect, useId, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

import type { GradientStops } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const GLOW_EXTRA = 8;
const GLOW_OPACITY = 0.22;

interface ProgressRingProps {
  readonly value: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly color?: string;
  /** Degradado del trazo (tiene prioridad sobre `color`). */
  readonly gradient?: GradientStops;
  readonly trackColor?: string;
  /** Brillo difuso detrás del trazo. */
  readonly glow?: boolean;
  readonly children?: ReactNode;
  readonly accessibilityLabel?: string;
  readonly durationMs?: number;
}

export const clampProgress = (value: number): number => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/**
 * Anillo de progreso circular animado (temporizadores, medidores del espejo emocional, impulsos): trazo con
 * degradado opcional, extremo redondeado y brillo.
 */
export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 12,
  color,
  gradient,
  trackColor,
  glow = false,
  children,
  accessibilityLabel,
  durationMs = 500,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const gradientId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const progress = useSharedValue(clampProgress(value));
  const pad = glow ? GLOW_EXTRA / 2 : 0;
  const r = (size - strokeWidth) / 2 - pad;
  const circumference = 2 * Math.PI * r;
  const stroke = gradient ? `url(#${gradientId})` : (color ?? colors.primary);

  useEffect(() => {
    const target = clampProgress(value);
    progress.value = reduceMotion ? target : withTiming(target, { duration: durationMs, easing: Easing.out(Easing.cubic) });
  }, [durationMs, progress, reduceMotion, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const arc = (width: number, opacity?: number) => (
    <AnimatedCircle
      cx={size / 2}
      cy={size / 2}
      r={r}
      stroke={stroke}
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      strokeDasharray={`${circumference} ${circumference}`}
      animatedProps={animatedProps}
    />
  );

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampProgress(value) * 100) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} style={styles.svg}>
        {gradient ? (
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              {gradient.map((stop, index) => (
                <Stop key={stop} offset={index / (gradient.length - 1)} stopColor={stop} />
              ))}
            </LinearGradient>
          </Defs>
        ) : null}
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor ?? colors.border} strokeWidth={strokeWidth} fill="none" />
        {glow ? arc(strokeWidth + GLOW_EXTRA, GLOW_OPACITY) : null}
        {arc(strokeWidth)}
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: { transform: [{ rotate: '-90deg' }] },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
