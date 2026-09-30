import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ExerciseCardProps {
  readonly title: string;
  readonly instruction?: string;
  readonly children: ReactNode;
}

export function ExerciseCard({ title, instruction, children }: ExerciseCardProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(350)}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {instruction ? <Text style={[styles.instruction, { color: colors.textMuted }]}>{instruction}</Text> : null}
      <View style={styles.body}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 2,
    borderBottomWidth: 5,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { ...typography.subtitle },
  instruction: { ...typography.body },
  body: { marginTop: spacing.sm, gap: spacing.md },
});
