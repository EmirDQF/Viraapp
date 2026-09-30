import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptic } from '@/lib/haptics';
import type { BreathingExercise } from '@/types';
import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button3D } from '@/components/ui/Button3D';
import { ProgressBar } from '@/components/ProgressBar';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

const PHASES = [
  { label: 'Inhala', scale: 1 },
  { label: 'Sostén', scale: 1 },
  { label: 'Exhala', scale: 0.55 },
  { label: 'Sostén', scale: 0.55 },
] as const;

const BOX_SIZE = 240;
const MIN_SCALE = 0.55;

type BreathStatus = 'idle' | 'running' | 'done';

export function BreathingStep({ exercise, onComplete }: StepProps<BreathingExercise>) {
  const { colors } = useTheme();
  const { phaseSeconds, cycles } = exercise;
  const totalSeconds = phaseSeconds * PHASES.length * cycles;
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const scale = useSharedValue(MIN_SCALE);

  // El estado "terminado" se deriva del tiempo transcurrido en lugar de guardarse aparte.
  let status: BreathStatus = 'idle';
  if (started) status = elapsed >= totalSeconds ? 'done' : 'running';

  const phaseIndex = Math.floor(elapsed / phaseSeconds) % PHASES.length;
  const secondsLeft = phaseSeconds - (elapsed % phaseSeconds);
  const cycle = Math.min(cycles, Math.floor(elapsed / (phaseSeconds * PHASES.length)) + 1);

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === 'done') haptic('success');
  }, [status]);

  useEffect(() => {
    if (status !== 'running') return;
    haptic('light');
    scale.value = withTiming(PHASES[phaseIndex].scale, {
      duration: phaseSeconds * 1000,
      easing: Easing.inOut(Easing.sin),
    });
  }, [phaseIndex, phaseSeconds, scale, status]);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const start = () => {
    setElapsed(0);
    setStarted(true);
  };

  const footer =
    status === 'done' ? (
      <Button3D label="Continuar" onPress={() => onComplete()} variant="success" haptics="success" />
    ) : status === 'running' ? (
      <Button3D label="Respira con Axo…" onPress={() => haptic('light')} disabled />
    ) : (
      <Button3D label="Comenzar respiración" onPress={start} haptics="medium" />
    );

  const centerLabel = status === 'done' ? 'Bien hecho' : status === 'running' ? PHASES[phaseIndex].label : 'Listo';

  return (
    <StepLayout footer={footer}>
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <Text style={[styles.instruction, { color: colors.textMuted }]}>
        Sigue el círculo: inhala {phaseSeconds}s, sostén {phaseSeconds}s, exhala {phaseSeconds}s y sostén {phaseSeconds}s.
        Harás {cycles} ciclos.
      </Text>
      <View style={styles.stage}>
        <View style={[styles.box, { borderColor: colors.primary }]}>
          <Animated.View style={[styles.circle, { backgroundColor: colors.primary }, circleStyle]} />
          <View style={styles.center}>
            <Text style={[styles.phase, { color: colors.onColor }]}>{centerLabel}</Text>
            {status === 'running' ? <Text style={[styles.count, { color: colors.onColor }]}>{secondsLeft}</Text> : null}
          </View>
        </View>
      </View>
      <View style={styles.progressRow}>
        <ProgressBar value={elapsed / totalSeconds} color={colors.primary} height={12} />
      </View>
      <Text style={[styles.cycle, { color: colors.textMuted }]}>
        {status === 'idle' ? `${cycles} ciclos` : `Ciclo ${cycle} de ${cycles}`}
      </Text>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  instruction: { ...typography.body },
  stage: { alignItems: 'center', paddingVertical: spacing.md },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 4,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: { position: 'absolute', width: BOX_SIZE - 40, height: BOX_SIZE - 40, borderRadius: BOX_SIZE, opacity: 0.9 },
  center: { alignItems: 'center' },
  phase: { fontSize: 24, fontWeight: '900' },
  count: { fontSize: 44, fontWeight: '900' },
  progressRow: { flexDirection: 'row' },
  cycle: { ...typography.caption, textAlign: 'center' },
});
