import { useEffect, useId, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { clampProgress } from '@/components/ui/ProgressRing';
import { spring } from '@/theme/motion';
import { gradients, type GradientStops } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Barrido del arco en grados (abierto por abajo, como en la maqueta del Inicio). */
const SWEEP_DEG = 240;
/** El brillo es el mismo trazo, más ancho y translúcido, detrás del principal. */
const GLOW_EXTRA = 10;
const GLOW_OPACITY = 0.22;

interface ProgressArcProps {
  readonly value: number;
  readonly size?: number;
  readonly strokeWidth?: number;
  /** Color sólido (si no hay degradado). */
  readonly color?: string;
  /** Degradado del trazo (aurora por defecto). */
  readonly gradient?: GradientStops;
  readonly trackColor?: string;
  readonly glow?: boolean;
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

/**
 * Arco de progreso que rodea a Regi en el Inicio: trazo con degradado aurora, extremo redondeado, brillo
 * difuso y valor animado con resorte.
 */
export function ProgressArc({
  value,
  size = 280,
  strokeWidth = 16,
  color,
  gradient = gradients.aurora,
  trackColor,
  glow = true,
  children,
  accessibilityLabel,
}: ProgressArcProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const gradientId = `arc-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const progress = useSharedValue(0);
  // El brillo sobresale del trazo: se reserva margen para que no se recorte.
  const inset = glow ? GLOW_EXTRA / 2 : 0;
  const inner = size - inset * 2;
  const r = inner / 2 - strokeWidth / 2;
  const length = (2 * Math.PI * r * SWEEP_DEG) / 360;
  const d = arcPath(inner, strokeWidth);
  const stroke = color ?? `url(#${gradientId})`;

  useEffect(() => {
    const target = clampProgress(value);
    progress.value = reduceMotion ? target : withSpring(target, spring.gentle);
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
      <Svg width={size} height={size} viewBox={`${-inset} ${-inset} ${size} ${size}`}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            {gradient.map((stop, index) => (
              <Stop key={stop} offset={index / (gradient.length - 1)} stopColor={stop} />
            ))}
          </LinearGradient>
        </Defs>
        <Path d={d} stroke={trackColor ?? colors.border} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" />
        {glow ? (
          <AnimatedPath
            d={d}
            stroke={stroke}
            strokeOpacity={GLOW_OPACITY}
            strokeWidth={strokeWidth + GLOW_EXTRA}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${length} ${length}`}
            animatedProps={animatedProps}
          />
        ) : null}
        <AnimatedPath
          d={d}
          stroke={stroke}
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
