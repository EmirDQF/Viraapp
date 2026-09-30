import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProgressBar } from '@/components/ProgressBar';
import { AppText } from '@/components/ui/AppText';
import { ChoiceButton, type ChoiceState } from '@/features/game/ChoiceButton';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { spacing } from '@/theme/tokens';
import type { QuizQuestion } from '@/types/content';

const LETTERS = ['a', 'b', 'c', 'd'] as const;

/**
 * Ronda de ~10 preguntas de opción múltiple con feedback inmediato. Sin vidas: una pregunta fallada vuelve
 * al final de la ronda para reintentarla (cuenta solo el acierto a la primera).
 */
export function QuizMechanic({ content, tone, onComplete }: MechanicProps<readonly QuizQuestion[]>) {
  const score = useStageScore();
  const [queue, setQueue] = useState<readonly number[]>(() => content.map((_, index) => index));
  const [retried, setRetried] = useState<ReadonlySet<number>>(() => new Set());
  const [position, setPosition] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const questionIndex = queue[position];
  const question = content[questionIndex];
  const answered = picked !== null;
  const correct = answered && picked === question.answer;
  const done = new Set(queue.slice(0, position)).size;

  const choose = (option: number) => {
    if (answered) return;
    setPicked(option);
    score.answer(option === question.answer, !retried.has(questionIndex));
  };

  const next = () => {
    let nextQueue = queue;
    if (!correct && !retried.has(questionIndex)) {
      nextQueue = [...queue, questionIndex];
      setQueue(nextQueue);
      setRetried(new Set([...retried, questionIndex]));
    }
    setPicked(null);
    if (position + 1 >= nextQueue.length) {
      onComplete(score.result());
      return;
    }
    setPosition(position + 1);
  };

  const stateOf = (option: number): ChoiceState => {
    if (!answered) return 'idle';
    if (option === question.answer) return 'correct';
    return option === picked ? 'wrong' : 'dimmed';
  };

  return (
    <View style={styles.root}>
      <View style={styles.progress}>
        <ProgressBar value={done / content.length} color={tone.base} height={10} />
        <AppText variant="caption" tone="muted">
          Pregunta {Math.min(done + 1, content.length)} de {content.length}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText variant="heading" accessibilityRole="header">
          {question.prompt}
        </AppText>
        {question.options.map((option, index) => (
          <ChoiceButton
            key={option}
            label={option}
            badge={LETTERS[index]}
            state={stateOf(index)}
            disabled={answered}
            onPress={() => choose(index)}
          />
        ))}
      </ScrollView>
      {answered ? <FeedbackPanel correct={correct} message={question.why} onContinue={next} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.md },
  progress: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  body: { gap: spacing.md, paddingBottom: spacing.lg },
});
