import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface CardProps {
  readonly children: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  readonly tone?: 'surface' | 'alt' | 'color';
  readonly color?: string;
  readonly padded?: boolean;
  readonly raised?: boolean;
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
}

/** Tarjeta redondeada (radio 20-24) con sombra suave; opcionalmente pulsable. */
export function Card({
  children,
  style,
  tone = 'surface',
  color,
  padded = true,
  raised = false,
  onPress,
  accessibilityLabel,
}: CardProps) {
  const { colors, isDark } = useTheme();
  const background = tone === 'color' && color ? color : tone === 'alt' ? colors.surfaceAlt : colors.surface;
  const baseStyle = [
    styles.card,
    padded && styles.padded,
    { backgroundColor: background, borderColor: tone === 'color' ? background : colors.border },
    !isDark && (raised ? elevation.raised : elevation.card),
    style,
  ];

  if (!onPress) {
    // Con etiqueta, la tarjeta se anuncia como un solo elemento (p. ej. "62% de las veces…").
    return (
      <View style={baseStyle} accessible={accessibilityLabel !== undefined} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [baseStyle, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xxl, borderWidth: 1 },
  padded: { padding: spacing.lg },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.95 },
});
