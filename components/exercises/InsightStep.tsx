import { StyleSheet, Text, View } from 'react-native';

import type { InsightExercise } from '../../types';
import { typography } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { AxoMascot } from '../AxoMascot';
import { Button3D } from '../Button3D';
import { ExerciseCard } from '../ExerciseCard';
import { StepLayout } from './StepLayout';
import type { StepProps } from './types';

export function InsightStep({ exercise, onComplete }: StepProps<InsightExercise>) {
  const { colors } = useTheme();
  return (
    <StepLayout footer={<Button3D label="Entendido" onPress={() => onComplete()} haptics="medium" />}>
      <View style={styles.axo}>
        <AxoMascot mood="thinking" size={150} />
      </View>
      <ExerciseCard title={exercise.title}>
        <Text style={[styles.body, { color: colors.text }]}>{exercise.body}</Text>
      </ExerciseCard>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  axo: { alignItems: 'center' },
  body: { ...typography.body },
});
