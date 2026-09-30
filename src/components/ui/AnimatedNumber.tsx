import { useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { duration } from '@/theme/motion';
import type { TypographyVariant } from '@/theme/typography';
import { useReduceMotion } from '@/theme/useReduceMotion';

interface AnimatedNumberProps {
  readonly value: number;
  readonly variant?: TypographyVariant;
  readonly color?: string;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly durationMs?: number;
  readonly style?: StyleProp<TextStyle>;
  readonly accessibilityLabel?: string;
}

const easeOutCubic = (t: number): number => 1 - (1 - t) ** 3;

/**
 * Contador que sube (o baja) hasta `value` con una curva suave. Cifras tabulares para que no "bailen".
 * Con "reducir movimiento" muestra el valor final directamente. Se anima en JS a propósito: es un número
 * pequeño que cambia pocas veces, y así funciona igual en iOS, Android y web.
 */
export function AnimatedNumber({
  value,
  variant = 'number',
  color,
  prefix = '',
  suffix = '',
  durationMs = duration.counter,
  style,
  accessibilityLabel,
}: AnimatedNumberProps) {
  const reduceMotion = useReduceMotion();
  const [shown, setShown] = useState(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const from = shownRef.current;
    if (reduceMotion || from === value) {
      shownRef.current = value;
      setShown(value);
      return;
    }
    let frame = 0;
    const start = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / durationMs);
      const next = Math.round(from + (value - from) * easeOutCubic(t));
      shownRef.current = next;
      setShown(next);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, reduceMotion, value]);

  return (
    <AppText
      variant={variant}
      color={color}
      style={style}
      accessibilityLabel={accessibilityLabel ?? `${prefix}${value}${suffix}`}
    >
      {`${prefix}${shown}${suffix}`}
    </AppText>
  );
}
