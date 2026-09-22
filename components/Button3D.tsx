import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { haptic, type HapticKind } from '../lib/haptics';
import { BUTTON_LIP, radius, spacing, type ThemeColors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export type ButtonVariant = 'primary' | 'accent' | 'stable' | 'success' | 'danger' | 'outline';

interface Button3DProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: ButtonVariant;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly haptics?: HapticKind;
  readonly compact?: boolean;
  readonly accessibilityHint?: string;
}

interface VariantColors {
  readonly face: string;
  readonly shadow: string;
  readonly text: string;
  readonly border?: string;
}

function resolveColors(colors: ThemeColors, variant: ButtonVariant, disabled: boolean): VariantColors {
  if (disabled) {
    return { face: colors.disabled, shadow: colors.disabledShadow, text: colors.textMuted };
  }
  switch (variant) {
    case 'primary':
      return { face: colors.primary, shadow: colors.primaryShadow, text: colors.onColor };
    case 'accent':
      return { face: colors.accent, shadow: colors.accentShadow, text: colors.onColor };
    case 'stable':
      return { face: colors.stable, shadow: colors.stableShadow, text: colors.onColor };
    case 'success':
      return { face: colors.success, shadow: colors.successShadow, text: colors.onColor };
    case 'danger':
      return { face: colors.danger, shadow: colors.dangerShadow, text: colors.onColor };
    case 'outline':
      return { face: colors.surface, shadow: colors.border, text: colors.text, border: colors.border };
  }
}

export function Button3D({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  haptics = 'light',
  compact = false,
  accessibilityHint,
}: Button3DProps) {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);
  const tone = resolveColors(colors, variant, disabled);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * BUTTON_LIP }, { scale: 1 - pressed.value * 0.02 }],
  }));

  const handlePress = () => {
    if (disabled) {
      haptic('warning');
      return;
    }
    haptic(haptics);
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 70 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 12, stiffness: 260 });
      }}
      onPress={handlePress}
      style={styles.wrapper}
    >
      <View style={[styles.lip, { backgroundColor: tone.shadow }]} />
      <Animated.View
        style={[
          styles.face,
          compact && styles.compact,
          { backgroundColor: tone.face, borderColor: tone.border ?? tone.face },
          faceStyle,
        ]}
      >
        {icon}
        <Text style={[styles.label, compact && styles.compactLabel, { color: tone.text }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingBottom: BUTTON_LIP, alignSelf: 'stretch' },
  lip: { position: 'absolute', left: 0, right: 0, top: BUTTON_LIP, bottom: 0, borderRadius: radius.lg },
  face: {
    minHeight: 54,
    borderRadius: radius.lg,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  compact: { minHeight: 42, paddingHorizontal: spacing.md },
  label: { fontSize: 16, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center' },
  compactLabel: { fontSize: 13 },
});
