import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled';

interface OptionTileProps {
  readonly title: string;
  readonly description?: string;
  readonly state?: OptionState;
  readonly icon?: ReactNode;
  readonly onPress: () => void;
}

export function OptionTile({ title, description, state = 'idle', icon, onPress }: OptionTileProps) {
  const { colors } = useTheme();
  const tone = {
    idle: { border: colors.border, bg: colors.surface, text: colors.text },
    selected: { border: colors.primary, bg: colors.surfaceAlt, text: colors.primary },
    correct: { border: colors.success, bg: colors.successSoft, text: colors.text },
    wrong: { border: colors.danger, bg: colors.dangerSoft, text: colors.text },
    disabled: { border: colors.border, bg: colors.surface, text: colors.textMuted },
  }[state];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: state === 'selected' || state === 'correct', disabled: state === 'disabled' }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { borderColor: tone.border, backgroundColor: tone.bg, opacity: state === 'disabled' ? 0.55 : 1 },
        pressed && styles.pressed,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.text}>
        <Text style={[styles.title, { color: tone.text }]}>{title}</Text>
        {description ? <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  icon: { width: 32, alignItems: 'center' },
  text: { flex: 1, gap: 2 },
  title: { ...typography.body, fontWeight: '700' },
  description: { ...typography.caption, fontWeight: '500', lineHeight: 18 },
});
