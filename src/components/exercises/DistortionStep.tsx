import { Quote } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DISTORTIONS } from '@/data/distortions';
import { haptic } from '@/lib/haptics';
import type { DistortionExercise, DistortionType } from '@/types';
import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { OptionTile, type OptionState } from '@/components/OptionTile';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

export function DistortionStep({ exercise, onComplete, onMistake }: StepProps<DistortionExercise>) {
  const { colors } = useTheme();
  const { case: item } = exercise;
  const [wrongPicks, setWrongPicks] = useState<readonly DistortionType[]>([]);
  const [lastWrong, setLastWrong] = useState<DistortionType | null>(null);
  const [solved, setSolved] = useState(false);

  const pick = (option: DistortionType) => {
    if (solved || wrongPicks.includes(option)) {
      haptic('warning');
      return;
    }
    if (option === item.correct) {
      haptic('success');
      setLastWrong(null);
      setSolved(true);
      return;
    }
    haptic('error');
    onMistake();
    setWrongPicks((picks) => [...picks, option]);
    setLastWrong(option);
  };

  const stateFor = (option: DistortionType): OptionState => {
    if (solved && option === item.correct) return 'correct';
    if (wrongPicks.includes(option)) return 'wrong';
    if (solved) return 'disabled';
    return 'idle';
  };

  let footer = <Text style={[styles.hint, { color: colors.textMuted }]}>Elige la trampa mental que reconoces.</Text>;
  if (solved) {
    footer = (
      <FeedbackPanel
        tone="success"
        title={`¡Detectado: ${DISTORTIONS[item.correct].label}!`}
        message={item.explanation}
        actionLabel="Continuar"
        onAction={() => onComplete()}
      />
    );
  } else if (lastWrong) {
    footer = (
      <FeedbackPanel
        tone="retry"
        title="Casi. Relee el pensamiento"
        message={`"${DISTORTIONS[lastWrong].label}" es: ${DISTORTIONS[lastWrong].short} ¿Encaja con lo que dice la frase?`}
        actionLabel="Intentar de nuevo"
        onAction={() => setLastWrong(null)}
      />
    );
  }

  return (
    <StepLayout footer={footer}>
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <View style={[styles.thought, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
        <Quote color={colors.primary} size={22} />
        <Text style={[styles.thoughtText, { color: colors.text }]}>{item.thought}</Text>
      </View>
      <View style={styles.options}>
        {item.options.map((option) => (
          <OptionTile
            key={option}
            title={DISTORTIONS[option].label}
            description={DISTORTIONS[option].short}
            state={stateFor(option)}
            onPress={() => pick(option)}
          />
        ))}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  thought: { borderWidth: 2, borderLeftWidth: 6, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm },
  thoughtText: { fontSize: 18, fontWeight: '700', fontStyle: 'italic', lineHeight: 26 },
  options: { gap: spacing.sm },
  hint: { ...typography.caption, textAlign: 'center', paddingVertical: spacing.md },
});
