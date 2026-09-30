import { Timer } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { haptic } from '@/lib/haptics';
import type { MicroActionExercise } from '@/types';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button3D } from '@/components/Button3D';
import { OptionTile } from '@/components/OptionTile';
import { ProgressBar } from '@/components/ProgressBar';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

const MIN_COMMITMENT = 5;
const MAX_COMMITMENT = 140;

type Stage = 'choose' | 'running' | 'finished';

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export function MicroActionStep({ exercise, onComplete }: StepProps<MicroActionExercise>) {
  const { colors } = useTheme();
  const [stage, setStage] = useState<Stage>('choose');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [commitment, setCommitment] = useState('');
  const [remaining, setRemaining] = useState(0);

  const challenge = exercise.challenges.find((item) => item.id === challengeId);
  const commitmentValid = commitment.trim().length >= MIN_COMMITMENT;

  useEffect(() => {
    if (stage !== 'running') return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  // Al llegar a 0 el reto se considera terminado (derivado, sin setState en un efecto).
  const timedOut = stage === 'running' && remaining === 0;
  const isFinished = stage === 'finished' || timedOut;
  useEffect(() => {
    if (timedOut) haptic('success');
  }, [timedOut]);

  const start = () => {
    if (!challenge || !commitmentValid) return;
    setRemaining(challenge.durationSec);
    setStage('running');
  };

  const finish = () => {
    if (!challenge) return;
    onComplete({ kind: 'micro-action', challengeId: challenge.id, commitment: commitment.trim() });
  };

  if (stage !== 'choose' && challenge) {
    const progress = 1 - remaining / challenge.durationSec;
    return (
      <StepLayout
        footer={
          isFinished ? (
            <Button3D label="Registrar compromiso" onPress={finish} variant="success" haptics="success" />
          ) : (
            <Button3D label="¡Ya lo hice!" onPress={() => setStage('finished')} variant="accent" haptics="medium" />
          )
        }
      >
        <Text style={[styles.title, { color: colors.text }]}>{challenge.title}</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>{challenge.description}</Text>
        <View style={[styles.timerCard, { borderColor: colors.accent, backgroundColor: colors.surface }]}>
          <Timer color={colors.accent} size={32} />
          <Text style={[styles.time, { color: colors.accent }]}>{formatTime(remaining)}</Text>
          <View style={styles.progressRow}>
            <ProgressBar value={progress} color={colors.accent} height={12} />
          </View>
        </View>
        <View style={[styles.commitmentCard, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
          <Text style={[styles.label, { color: colors.primary }]}>Tu compromiso</Text>
          <Text style={[styles.body, { color: colors.text }]}>{commitment.trim()}</Text>
        </View>
        {isFinished ? (
          <Text style={[styles.done, { color: colors.success }]}>
            ¡Tracción conseguida! Acabas de demostrarte que puedes moverte.
          </Text>
        ) : null}
      </StepLayout>
    );
  }

  return (
    <StepLayout
      footer={
        <Button3D
          label="Activar temporizador"
          onPress={start}
          disabled={!challenge || !commitmentValid}
          variant="accent"
          haptics="medium"
          icon={<Timer color={challenge && commitmentValid ? palette.white : colors.textMuted} size={20} />}
        />
      }
    >
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <View style={styles.options}>
        {exercise.challenges.map((item) => (
          <OptionTile
            key={item.id}
            title={item.title}
            description={`${item.description} · ${formatTime(item.durationSec)}`}
            state={challengeId === item.id ? 'selected' : 'idle'}
            onPress={() => {
              haptic('light');
              setChallengeId(item.id);
            }}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: colors.primary }]}>Compromiso escrito</Text>
      <TextInput
        value={commitment}
        onChangeText={setCommitment}
        placeholder="Hoy me comprometo a…"
        placeholderTextColor={colors.textMuted}
        maxLength={MAX_COMMITMENT}
        multiline
        style={[styles.input, { color: colors.text, borderColor: commitmentValid ? colors.primary : colors.border, backgroundColor: colors.surface }]}
      />
      <Text style={[styles.helper, { color: commitment.length > 0 && !commitmentValid ? colors.danger : colors.textMuted }]}>
        {commitment.length > 0 && !commitmentValid
          ? `Escribe al menos ${MIN_COMMITMENT} caracteres.`
          : `${commitment.length}/${MAX_COMMITMENT}`}
      </Text>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  body: { ...typography.body },
  options: { gap: spacing.sm },
  label: { ...typography.caption, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { minHeight: 80, borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, fontSize: 16, textAlignVertical: 'top' },
  helper: { ...typography.caption, textAlign: 'right' },
  timerCard: { alignItems: 'center', gap: spacing.sm, borderWidth: 3, borderBottomWidth: 6, borderRadius: radius.xl, padding: spacing.xl },
  time: { fontSize: 56, fontWeight: '900', fontVariant: ['tabular-nums'] },
  progressRow: { flexDirection: 'row', alignSelf: 'stretch' },
  commitmentCard: { borderWidth: 2, borderLeftWidth: 6, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs },
  done: { ...typography.subtitle, textAlign: 'center' },
});
