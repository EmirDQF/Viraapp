import { StyleSheet, Text, View } from 'react-native';

import type { InsightExercise } from '@/types';
import { typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';
import { ExerciseCard } from '@/components/ExerciseCard';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

export function InsightStep({ exercise, onComplete }: StepProps<InsightExercise>) {
  const { colors } = useTheme();
  return (
    <StepLayout footer={<Button3D label="Entendido" onPress={() => onComplete()} haptics="medium" />}>
      <View style={styles.mascot}>
        <RegiMascot pose="resilient" size={150} />
      </View>
      <ExerciseCard title={exercise.title}>
        <Text style={[styles.body, { color: colors.text }]}>{exercise.body}</Text>
      </ExerciseCard>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  mascot: { alignItems: 'center' },
  body: { ...typography.body },
});
