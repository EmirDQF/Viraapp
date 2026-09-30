import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import { shuffle } from '@/lib/shuffle';
import type { ReframeBlock, ReframeCase, ReframeExercise } from '@/types';
import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button3D } from '@/components/ui/Button3D';
import { FeedbackPanel } from '@/components/exercises/FeedbackPanel';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

type ReframeStatus = 'building' | 'wrong' | 'right';

function diagnoseAnswer(answer: readonly string[], reframe: ReframeCase): string {
  if (answer.some((id) => !reframe.correctOrder.includes(id))) {
    return 'Uno de tus bloques repite la distorsión original. Quítalo y busca una pieza más realista.';
  }
  if (answer.length < reframe.correctOrder.length) {
    return 'Te faltan piezas para completar una idea equilibrada.';
  }
  return 'Las piezas son las correctas, pero el orden no fluye. Léelo en voz alta y reordénalo.';
}

function isCorrectAnswer(answer: readonly string[], reframe: ReframeCase): boolean {
  return answer.length === reframe.correctOrder.length && answer.every((id, index) => reframe.correctOrder[index] === id);
}

interface ChipProps {
  readonly block: ReframeBlock;
  readonly placed: boolean;
  readonly onPress: () => void;
}

function Chip({ block, placed, onPress }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={placed ? 'Quitar de la frase' : 'Añadir a la frase'}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: colors.surface, borderColor: placed ? colors.primary : colors.border },
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.chipText, { color: colors.text }]}>{block.text}</Text>
    </Pressable>
  );
}

export function ReframeStep({ exercise, onComplete, onMistake }: StepProps<ReframeExercise>) {
  const { colors } = useTheme();
  const reframe = exercise.case;
  const bankOrder = useMemo(() => shuffle(reframe.blocks), [reframe.blocks]);
  const [answer, setAnswer] = useState<readonly string[]>([]);
  const [status, setStatus] = useState<ReframeStatus>('building');

  const blockById = (id: string) => reframe.blocks.find((block) => block.id === id);
  const sentence = answer.map((id) => blockById(id)?.text ?? '').join(' ');

  const toggle = (id: string) => {
    if (status === 'right') return;
    haptic('light');
    setStatus('building');
    setAnswer((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const check = () => {
    if (isCorrectAnswer(answer, reframe)) {
      haptic('success');
      setStatus('right');
      return;
    }
    haptic('error');
    onMistake();
    setStatus('wrong');
  };

  let footer = <Button3D label="Comprobar" onPress={check} disabled={answer.length === 0} haptics="none" />;
  if (status === 'right') {
    footer = (
      <FeedbackPanel
        tone="success"
        title="¡Pensamiento reconstruido!"
        message={reframe.explanation}
        actionLabel="Guardar y continuar"
        onAction={() => onComplete({ kind: 'reframe', text: sentence })}
      />
    );
  } else if (status === 'wrong') {
    footer = (
      <FeedbackPanel
        tone="retry"
        title="Ajustemos la frase"
        message={diagnoseAnswer(answer, reframe)}
        actionLabel="Seguir editando"
        onAction={() => setStatus('building')}
      />
    );
  }

  return (
    <StepLayout footer={footer}>
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <View style={[styles.automatic, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}>
        <Text style={[styles.label, { color: colors.danger }]}>Pensamiento automático</Text>
        <Text style={[styles.automaticText, { color: colors.text }]}>{reframe.automaticThought}</Text>
      </View>

      <Text style={[styles.label, { color: colors.primary }]}>Tu pensamiento alternativo realista</Text>
      <View style={[styles.answer, { borderColor: status === 'right' ? colors.success : colors.border }]}>
        {answer.length === 0 ? (
          <Text style={[styles.placeholder, { color: colors.textMuted }]}>Toca los bloques en el orden correcto…</Text>
        ) : (
          answer.map((id) => {
            const block = blockById(id);
            return block ? (
              <Animated.View key={id} entering={FadeIn.duration(180)}>
                <Chip block={block} placed onPress={() => toggle(id)} />
              </Animated.View>
            ) : null;
          })
        )}
      </View>

      <View style={styles.bank}>
        {bankOrder
          .filter((block) => !answer.includes(block.id))
          .map((block) => (
            <Chip key={block.id} block={block} placed={false} onPress={() => toggle(block.id)} />
          ))}
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.8 },
  automatic: { borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs },
  automaticText: { ...typography.body, fontStyle: 'italic', textDecorationLine: 'line-through' },
  answer: {
    minHeight: 110,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignContent: 'flex-start',
  },
  placeholder: { ...typography.body },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipPressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  chipText: { fontSize: 15, fontWeight: '700' },
});
