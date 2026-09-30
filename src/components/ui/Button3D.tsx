import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { darken, withAlpha } from '@/lib/color';
import { haptic, type HapticKind } from '@/lib/haptics';
import { spring } from '@/theme/motion';
import {
  brand,
  BUTTON_HEIGHT,
  BUTTON_LIP,
  gradients,
  MIN_TOUCH,
  onGradient,
  radius,
  spacing,
  type GradientStops,
  type ThemeColors,
} from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'stable' | 'success' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Colores explícitos para botones con el color de un módulo. */
export interface ButtonTone {
  readonly face: string;
  readonly shadow: string;
  readonly text: string;
}

interface Button3DProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
  /** @deprecated usa size="sm". */
  readonly compact?: boolean;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly icon?: ReactNode;
  readonly haptics?: HapticKind;
  readonly accessibilityLabel?: string;
  readonly accessibilityHint?: string;
  readonly testID?: string;
  /** Degradado para la cara del botón (todas sus paradas con contraste AA frente al texto). */
  readonly gradient?: GradientStops;
}

interface ResolvedTone extends ButtonTone {
  readonly border: string;
  readonly gradient?: GradientStops;
}

/** Oscurecimiento del labio respecto a la parada más oscura del degradado. */
const LIP_SHADE = 0.25;
const GLOSS_ALPHA = 0.22;

function resolveTone(colors: ThemeColors, variant: ButtonVariant, disabled: boolean, tone?: ButtonTone): ResolvedTone {
  if (disabled) {
    return { face: colors.disabled, shadow: colors.disabledShadow, text: colors.textMuted, border: colors.disabled };
  }
  if (tone) {
    return { ...tone, border: tone.face };
  }
  const map: Record<ButtonVariant, ResolvedTone> = {
    primary: {
      face: brand.petrolDeep,
      shadow: darken(brand.petrolDeep, LIP_SHADE),
      text: onGradient.auroraButton,
      border: brand.petrolDeep,
      gradient: gradients.auroraButton,
    },
    accent: {
      face: brand.coral,
      shadow: colors.accentShadow,
      text: onGradient.sunrise,
      border: brand.coral,
      gradient: gradients.sunrise,
    },
    stable: { face: colors.stable, shadow: colors.stableShadow, text: colors.onPrimary, border: colors.stable },
    secondary: { face: colors.secondary, shadow: colors.secondaryShadow, text: colors.onSecondary, border: colors.secondary },
    success: { face: colors.success, shadow: colors.successShadow, text: colors.onSuccess, border: colors.success },
    danger: { face: colors.danger, shadow: colors.dangerShadow, text: colors.onDanger, border: colors.danger },
    outline: { face: colors.surface, shadow: colors.border, text: colors.text, border: colors.border },
    ghost: { face: 'transparent', shadow: 'transparent', text: colors.highlight, border: 'transparent' },
  };
  return map[variant];
}

const HEIGHT: Record<ButtonSize, number> = { sm: MIN_TOUCH, md: BUTTON_HEIGHT, lg: BUTTON_HEIGHT + 6 };

/**
 * Botón 3D estilo Duolingo 2026: cara con degradado y brillo sobre un labio de 5 px del tono profundo; al
 * pulsar la cara "se hunde" con un resorte y vibra. `primary` = aurora, `accent` = sunrise.
 */
export function Button3D({
  label,
  onPress,
  variant = 'primary',
  tone,
  size,
  compact = false,
  disabled = false,
  loading = false,
  icon,
  haptics = 'light',
  accessibilityLabel,
  accessibilityHint,
  testID,
  gradient,
}: Button3DProps) {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);
  const resolvedSize: ButtonSize = size ?? (compact ? 'sm' : 'md');
  const inactive = disabled || loading;
  const resolved = resolveTone(colors, variant, inactive, tone);
  const faceGradient = inactive ? undefined : (gradient ?? resolved.gradient);
  const hasLip = variant !== 'ghost';
  const hasGloss = hasLip && variant !== 'outline' && !inactive;

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * (hasLip ? BUTTON_LIP : 1) }],
  }));

  const handlePress = () => {
    if (inactive) return;
    haptic(haptics);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      testID={testID}
      onPressIn={() => {
        pressed.set(withSpring(1, spring.snappy));
      }}
      onPressOut={() => {
        pressed.set(withSpring(0, spring.snappy));
      }}
      onPress={handlePress}
      style={[styles.wrapper, hasLip && styles.withLip]}
    >
      {hasLip ? <View style={[styles.lip, { backgroundColor: resolved.shadow }]} /> : null}
      <Animated.View
        style={[
          styles.face,
          { minHeight: HEIGHT[resolvedSize], backgroundColor: resolved.face, borderColor: resolved.border },
          resolvedSize === 'sm' && styles.faceSmall,
          faceStyle,
        ]}
      >
        {faceGradient ? (
          <LinearGradient
            colors={faceGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.gradient]}
          />
        ) : null}
        {hasGloss ? (
          <LinearGradient
            colors={[withAlpha(brand.white, GLOSS_ALPHA), withAlpha(brand.white, 0)]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gloss}
            pointerEvents="none"
          />
        ) : null}
        {/* En web, el degradado (posicionado) se pinta sobre lo estático: ícono y etiqueta van en su capa. */}
        {loading ? <ActivityIndicator color={resolved.text} /> : icon ? <View style={styles.layer}>{icon}</View> : null}
        <AppText
          variant="button"
          color={resolved.text}
          align="center"
          uppercase
          style={resolvedSize === 'sm' ? styles.labelSmall : resolvedSize === 'lg' ? styles.labelLarge : null}
        >
          {label}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch' },
  withLip: { paddingBottom: BUTTON_LIP },
  lip: { position: 'absolute', left: 0, right: 0, top: BUTTON_LIP, bottom: 0, borderRadius: radius.md },
  face: {
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  faceSmall: { paddingHorizontal: spacing.md },
  layer: { position: 'relative' },
  gradient: { borderRadius: radius.md - 1.5 },
  gloss: { position: 'absolute', top: 0, left: 0, right: 0, height: '50%' },
  labelSmall: { fontSize: 13 },
  labelLarge: { fontSize: 18 },
});
