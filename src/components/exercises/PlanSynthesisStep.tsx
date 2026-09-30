import { ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { haptic } from '@/lib/haptics';
import type { PlanSynthesisExercise } from '@/types';
import { spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { Button3D } from '@/components/ui/Button3D';
import { OptionTile } from '@/components/OptionTile';
import { StepLayout } from '@/components/exercises/StepLayout';
import type { StepProps } from '@/components/exercises/types';

export function PlanSynthesisStep({ exercise, onComplete }: StepProps<PlanSynthesisExercise>) {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<readonly string[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const { requiredRules } = exercise;

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      haptic('light');
      setWarning(null);
      setSelected(selected.filter((item) => item !== id));
      return;
    }
    if (selected.length >= requiredRules) {
      haptic('warning');
      setWarning(`Ya elegiste ${requiredRules}. Quita una para cambiarla.`);
      return;
    }
    haptic('light');
    setWarning(null);
    setSelected([...selected, id]);
  };

  const ready = selected.length === requiredRules;

  return (
    <StepLayout
      footer={
        <Button3D
          label={ready ? 'Generar mi plan' : `Elige ${requiredRules - selected.length} más`}
          onPress={() => onComplete({ kind: 'rules', ruleIds: selected })}
          disabled={!ready}
          variant="accent"
          haptics="success"
        />
      }
    >
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <Text style={[styles.body, { color: colors.textMuted }]}>
        Serán tus acuerdos para los días difíciles. Elige las que de verdad puedas cumplir.
      </Text>
      <Text style={[styles.counter, { color: ready ? colors.success : colors.primary }]}>
        {selected.length}/{requiredRules} reglas elegidas
      </Text>
      <View style={styles.options}>
        {exercise.rules.map((rule) => {
          const isSelected = selected.includes(rule.id);
          return (
            <OptionTile
              key={rule.id}
              title={rule.text}
              state={isSelected ? 'selected' : 'idle'}
              icon={<ShieldCheck color={isSelected ? colors.primary : colors.textMuted} size={24} />}
              onPress={() => toggle(rule.id)}
            />
          );
        })}
      </View>
      {warning ? <Text style={[styles.warning, { color: colors.accent }]}>{warning}</Text> : null}
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  body: { ...typography.body },
  counter: { ...typography.subtitle },
  options: { gap: spacing.sm },
  warning: { ...typography.caption, textAlign: 'center' },
});
