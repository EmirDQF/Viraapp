import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { clampProgress } from '@/components/ui/ProgressRing';
import { useTheme } from '@/theme/useTheme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Barrido del arco en grados (abierto por abajo, como en el boceto del Inicio). */
const SWEEP_DEG = 240;

interface ProgressArcProps {
  readonly value: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly color?: string;
  readonly trackColor?: string;
  readonly children?: ReactNode;
  readonly accessibilityLabel?: string;
}

function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Trayectoria SVG de un arco centrado arriba, de -SWEEP/2 a +SWEEP/2. */
export function arcPath(size: number, strokeWidth: number): string {
  const c = size / 2;
  const r = c - strokeWidth / 2;
  const start = polar(c, c, r, -SWEEP_DEG / 2);
  const end = polar(c, c, r, SWEEP_DEG / 2);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 1 1 ${end.x} ${end.y}`;
}

/** Arco de progreso que rodea a Regi en el Inicio: cuánto falta para desbloquear el siguiente tema. */
export function ProgressArc({ value, size = 280, strokeWidth = 16, color, trackColor, children, accessibilityLabel }: ProgressArcProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);
  const r = size / 2 - strokeWidth / 2;
  const length = (2 * Math.PI * r * SWEEP_DEG) / 360;
  const d = arcPath(size, strokeWidth);

  useEffect(() => {
    const target = clampProgress(value);
    progress.value = reduceMotion ? target : withTiming(target, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress, reduceMotion, value]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: length * (1 - progress.value) }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampProgress(value) * 100) }}
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size}>
        <Path d={d} stroke={trackColor ?? colors.border} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        <AnimatedPath
          d={d}
          stroke={color ?? colors.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${length} ${length}`}
          animatedProps={animatedProps}
        />
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
