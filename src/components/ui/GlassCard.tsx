import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { withAlpha } from '@/lib/color';
import { brand, elevationFor, radius, spacing, type ElevationLevel } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Intensidad del desenfoque por defecto (0-100 en expo-blur). */
const BLUR_INTENSITY = 40;
/** Opacidad del brillo del borde superior (claro / oscuro). */
const TOP_LIGHT_ALPHA = 0.5;
const TOP_LIGHT_ALPHA_DARK = 0.1;

/** Liquid glass nativo (iOS 26+). Se evalúa una vez: no cambia durante la ejecución. */
const NATIVE_GLASS = Platform.OS === 'ios' && isLiquidGlassAvailable();

interface GlassCardProps {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly padded?: boolean;
  readonly radius?: number;
  /** Sombra de la capa (ninguna por defecto: el vidrio suele ir sobre otro fondo). */
  readonly elevation?: ElevationLevel;
  /**
   * false = sin desenfoque real (solo tinte translúcido). Úsalo en ítems de listas largas para no anidar
   * blurs, que cuestan caro en el hilo de render.
   */
  readonly blur?: boolean;
  /** Tinte opcional (por defecto el vidrio del tema). */
  readonly tint?: string;
  readonly accessibilityLabel?: string;
}

/**
 * Tarjeta de vidrio: desenfoque + tinte translúcido + borde de luz arriba. En iOS 26 usa el liquid glass
 * nativo (expo-glass-effect); en el resto, expo-blur (en Android sin BlurTargetView queda un velo translúcido,
 * que es el comportamiento documentado).
 */
export function GlassCard({
  children,
  style,
  padded = true,
  radius: cornerRadius = radius.xxl,
  elevation,
  blur = true,
  tint,
  accessibilityLabel,
}: GlassCardProps) {
  const { colors, isDark } = useTheme();
  const fill = tint ?? colors.glass;
  const shape = { borderRadius: cornerRadius };
  const nativeGlass = blur && NATIVE_GLASS;

  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityLabel={accessibilityLabel}
      style={[shape, elevation ? elevationFor(elevation, isDark) : null, style]}
    >
      <View style={[StyleSheet.absoluteFill, shape, styles.clip]} pointerEvents="none">
        {nativeGlass ? (
          <GlassView style={StyleSheet.absoluteFill} glassEffectStyle="regular" tintColor={fill} />
        ) : null}
        {blur && !nativeGlass ? (
          <BlurView intensity={BLUR_INTENSITY} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
        ) : null}
        {nativeGlass ? null : <View style={[StyleSheet.absoluteFill, { backgroundColor: fill }]} />}
        <LinearGradient
          colors={[withAlpha(brand.white, isDark ? TOP_LIGHT_ALPHA_DARK : TOP_LIGHT_ALPHA), withAlpha(brand.white, 0)]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.35 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, shape, styles.border, { borderColor: colors.glassBorder }]}
      />
      <View style={padded ? styles.padded : null}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  border: { borderWidth: 1 },
  padded: { padding: spacing.lg },
});
