import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { GlassCard } from '@/components/ui/GlassCard';
import { elevationFor, radius, spacing, type ElevationLevel, type GradientStops } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type CardVariant = 'solid' | 'glass' | 'gradient';

interface CardProps {
  readonly children: ReactNode;
  /** Estilo de la caja (layout interno incluido, como gap o flexDirection). */
  readonly style?: StyleProp<ViewStyle>;
  /** solid (superficie con elevación), glass (vidrio) o gradient (degradado de color). */
  readonly variant?: CardVariant;
  /** Solo para `solid`: superficie normal, alternativa o un color propio (`color`). */
  readonly tone?: 'surface' | 'alt' | 'color';
  readonly color?: string;
  /** Para `gradient`: las paradas (el texto encima debe cumplir AA con todas). */
  readonly gradient?: GradientStops;
  readonly padded?: boolean;
  readonly raised?: boolean;
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
  readonly accessibilityHint?: string;
}

/** Propiedades que colocan la tarjeta en su contenedor: en las pulsables van al Pressable que la envuelve. */
const OUTER_KEYS = [
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignSelf',
  'width',
  'minWidth',
  'maxWidth',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
] as const;

function splitStyle(style: StyleProp<ViewStyle>): { outer: ViewStyle; inner: ViewStyle } {
  const flat = StyleSheet.flatten(style) ?? {};
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = { ...flat };
  OUTER_KEYS.forEach((key) => {
    if (flat[key] !== undefined) {
      outer[key] = flat[key];
      if (key.startsWith('margin')) {
        delete inner[key];
      }
    }
  });
  return { outer: outer as ViewStyle, inner: inner as ViewStyle };
}

/** Tarjeta 2026 (esquinas de 28, sombra difusa, borde de luz en oscuro); opcionalmente pulsable con resorte. */
export function Card({
  children,
  style,
  variant = 'solid',
  tone = 'surface',
  color,
  gradient,
  padded = true,
  raised = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: CardProps) {
  const { colors, isDark } = useTheme();
  const level: ElevationLevel = raised ? 'lg' : 'md';

  if (!onPress) {
    // Con etiqueta, la tarjeta se anuncia como un solo elemento (p. ej. "62% de las veces…").
    return (
      <CardBox
        {...{ variant, tone, color, gradient, padded, level, colors, isDark }}
        style={style}
        accessible={accessibilityLabel !== undefined}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </CardBox>
    );
  }
  const { outer, inner } = splitStyle(style);
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={outer}
    >
      <CardBox {...{ variant, tone, color, gradient, padded, level, colors, isDark }} style={[inner, styles.fill]}>
        {children}
      </CardBox>
    </AnimatedPressable>
  );
}

interface CardBoxProps {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly variant: CardVariant;
  readonly tone: 'surface' | 'alt' | 'color';
  readonly color?: string;
  readonly gradient?: GradientStops;
  readonly padded: boolean;
  readonly level: ElevationLevel;
  readonly colors: ReturnType<typeof useTheme>['colors'];
  readonly isDark: boolean;
  readonly accessible?: boolean;
  readonly accessibilityLabel?: string;
}

function CardBox({
  children,
  style,
  variant,
  tone,
  color,
  gradient,
  padded,
  level,
  colors,
  isDark,
  accessible,
  accessibilityLabel,
}: CardBoxProps) {
  if (variant === 'glass') {
    return (
      <GlassCard
        padded={false}
        elevation={level === 'lg' ? 'md' : 'sm'}
        accessibilityLabel={accessible ? accessibilityLabel : undefined}
        style={[padded ? styles.padded : null, style]}
      >
        {children}
      </GlassCard>
    );
  }
  const background = tone === 'color' && color ? color : tone === 'alt' ? colors.surfaceAlt : colors.surface;
  const plainBorder = tone === 'color' || variant === 'gradient' ? 'transparent' : colors.border;
  return (
    <View
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.card,
        padded && styles.padded,
        elevationFor(level, isDark),
        {
          backgroundColor: variant === 'gradient' && gradient ? gradient[0] : background,
          borderColor: isDark ? colors.glassBorder : plainBorder,
        },
        style,
      ]}
    >
      {variant === 'gradient' && gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  /** zIndex crea un contexto de apilamiento: el degradado (zIndex -1) queda sobre el fondo y bajo el contenido. */
  card: { borderRadius: radius.xxl, borderWidth: 1, zIndex: 0 },
  fill: { flexGrow: 1 },
  gradient: { borderRadius: radius.xxl, zIndex: -1 },
  padded: { padding: spacing.lg },
});
