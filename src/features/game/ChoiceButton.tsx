import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dimmed';

interface ChoiceButtonProps {
  readonly label: string;
  readonly badge?: string;
  readonly state?: ChoiceState;
  readonly disabled?: boolean;
  readonly onPress: () => void;
}

/** Opción de respuesta 3D (preguntas, decisiones y debate), con estado de acierto/error. */
export const ChoiceButton = memo(function ChoiceButton({ label, badge, state = 'idle', disabled = false, onPress }: ChoiceButtonProps) {
  const { colors } = useTheme();
  const tone = {
    idle: { bg: colors.surface, border: colors.border },
    correct: { bg: colors.successSoft, border: colors.success },
    wrong: { bg: colors.dangerSoft, border: colors.danger },
    dimmed: { bg: colors.surface, border: colors.border },
  }[state];
  const stateLabel = state === 'correct' ? ', correcta' : state === 'wrong' ? ', incorrecta' : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${badge ? `Opción ${badge}: ` : ''}${label}${stateLabel}`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        { backgroundColor: tone.bg, borderColor: tone.border, opacity: state === 'dimmed' ? 0.55 : 1 },
        pressed && styles.pressed,
      ]}
    >
      {badge ? (
        <View style={[styles.badge, { borderColor: tone.border }]}>
          <AppText variant="caption">{badge}</AppText>
        </View>
      ) : null}
      <AppText variant="bodyStrong" style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: MIN_TOUCH + 8,
  },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  badge: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});
