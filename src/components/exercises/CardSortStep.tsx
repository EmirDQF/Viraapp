import { Hand, Wind } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import type { CardSortExercise, ControlZone, SortCard } from '@/types';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button3D } from '@/components/ui/Button3D';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

interface SortFeedback {
  readonly correct: boolean;
  readonly card: SortCard;
}

const ZONE_LABEL: Record<ControlZone, string> = {
  control: 'Bajo mi control',
  'no-control': 'Fuera de mi control',
};

export function CardSortStep({ exercise, onComplete, onMistake }: StepProps<CardSortExercise>) {
  const { colors } = useTheme();
  const [queue, setQueue] = useState<readonly string[]>(() => exercise.cards.map((card) => card.id));
  const [sortedCount, setSortedCount] = useState(0);
  const [feedback, setFeedback] = useState<SortFeedback | null>(null);

  const current = exercise.cards.find((card) => card.id === queue[0]);

  const choose = (zone: ControlZone) => {
    if (!current || feedback) {
      return;
    }
    const correct = current.zone === zone;
    haptic(correct ? 'success' : 'error');
    if (!correct) {
      onMistake();
    }
    setFeedback({ correct, card: current });
  };

  const advance = () => {
    if (!feedback) {
      return;
    }
    const [head, ...rest] = queue;
    if (feedback.correct) {
      setSortedCount((count) => count + 1);
      if (rest.length === 0) {
        onComplete();
        return;
      }
      setQueue(rest);
    } else {
      setQueue([...rest, head]);
    }
    setFeedback(null);
  };

  const footer = feedback ? (
    <FeedbackPanel
      tone={feedback.correct ? 'success' : 'retry'}
      title={feedback.correct ? `¡Exacto! ${ZONE_LABEL[feedback.card.zone]}` : 'Relectura consciente'}
      message={
        feedback.correct
          ? feedback.card.explanation
          : `${feedback.card.explanation} Esta tarjeta volverá al final para que la clasifiques de nuevo.`
      }
      actionLabel={feedback.correct ? 'Continuar' : 'Entendido'}
      onAction={advance}
    />
  ) : (
    <View style={styles.choices}>
      <View style={styles.choice}>
        <Button3D label="Bajo mi control" onPress={() => choose('control')} icon={<Hand color={palette.white} size={20} />} haptics="none" />
      </View>
      <View style={styles.choice}>
        <Button3D label="Fuera de mi control" onPress={() => choose('no-control')} variant="stable" icon={<Wind color={palette.white} size={20} />} haptics="none" />
      </View>
    </View>
  );

  return (
    <StepLayout footer={footer}>
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <Text style={[styles.counter, { color: colors.textMuted }]}>
        {sortedCount} de {exercise.cards.length} tarjetas clasificadas
      </Text>
      {current ? (
        <Animated.View
          key={`${current.id}-${queue.length}-${sortedCount}`}
          entering={ZoomIn.duration(260)}
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: feedback ? (feedback.correct ? colors.success : colors.danger) : colors.border,
            },
          ]}
        >
          <Text style={[styles.cardText, { color: colors.text }]}>{current.text}</Text>
          <Text style={[styles.cardHint, { color: colors.textMuted }]}>¿Esto depende de ti?</Text>
        </Animated.View>
      ) : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  counter: { ...typography.caption },
  card: {
    minHeight: 200,
    borderWidth: 3,
    borderBottomWidth: 7,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cardText: { fontSize: 22, fontWeight: '800', textAlign: 'center', lineHeight: 30 },
  cardHint: { ...typography.caption },
  choices: { flexDirection: 'row', gap: spacing.sm },
  choice: { flex: 1 },
});
