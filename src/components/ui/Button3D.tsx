import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { haptic, type HapticKind } from '@/lib/haptics';
import { BUTTON_LIP, MIN_TOUCH, radius, spacing, type ThemeColors } from '@/theme/tokens';
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
  /** Degradado opcional para la cara del botón (dos colores con contraste AA frente a `tone.text`). */
  readonly gradient?: readonly [string, string];
}

interface ResolvedTone extends ButtonTone {
  readonly border: string;
}

function resolveTone(colors: ThemeColors, variant: ButtonVariant, disabled: boolean, tone?: ButtonTone): ResolvedTone {
  if (disabled) {
    return { face: colors.disabled, shadow: colors.disabledShadow, text: colors.textMuted, border: colors.disabled };
  }
  if (tone) {
    return { ...tone, border: tone.face };
  }
  const map: Record<ButtonVariant, ResolvedTone> = {
    primary: { face: colors.primary, shadow: colors.primaryShadow, text: colors.onPrimary, border: colors.primary },
    stable: { face: colors.stable, shadow: colors.stableShadow, text: colors.onPrimary, border: colors.stable },
    secondary: { face: colors.secondary, shadow: colors.secondaryShadow, text: colors.onSecondary, border: colors.secondary },
    accent: { face: colors.accent, shadow: colors.accentShadow, text: colors.onAccent, border: colors.accent },
    success: { face: colors.success, shadow: colors.successShadow, text: colors.onSuccess, border: colors.success },
    danger: { face: colors.danger, shadow: colors.dangerShadow, text: colors.onDanger, border: colors.danger },
    outline: { face: colors.surface, shadow: colors.border, text: colors.text, border: colors.border },
    ghost: { face: 'transparent', shadow: 'transparent', text: colors.highlight, border: 'transparent' },
  };
  return map[variant];
}

const HEIGHT: Record<ButtonSize, number> = { sm: MIN_TOUCH, md: 54, lg: 62 };

/** Botón 3D estilo Duolingo: la cara "se hunde" sobre su labio al pulsar. */
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
  const hasLip = variant !== 'ghost';

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
        pressed.value = withTiming(1, { duration: 60 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 14, stiffness: 280 });
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
        {gradient && !inactive ? (
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.gradient]}
          />
        ) : null}
        {loading ? <ActivityIndicator color={resolved.text} /> : icon}
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
  lip: { position: 'absolute', left: 0, right: 0, top: BUTTON_LIP, bottom: 0, borderRadius: radius.lg },
  face: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  faceSmall: { paddingHorizontal: spacing.md },
  gradient: { borderRadius: radius.lg - 2 },
  labelSmall: { fontSize: 13 },
  labelLarge: { fontSize: 18 },
});
