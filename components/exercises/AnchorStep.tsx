import { Anchor } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { haptic } from '../../lib/haptics';
import type { AnchorExercise } from '../../types';
import { palette, radius, spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { Button3D } from '../Button3D';
import { OptionTile } from '../OptionTile';
import { StepLayout } from './StepLayout';
import type { StepProps } from './types';

const HOLD_SIZE = 150;

export function AnchorStep({ exercise, onComplete }: StepProps<AnchorExercise>) {
  const { colors } = useTheme();
  const [mantra, setMantra] = useState<string | null>(null);
  const [anchored, setAnchored] = useState(false);
  const [holding, setHolding] = useState(false);
  const charge = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anchoredRef = useRef(false);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const startHold = () => {
    if (!mantra || anchoredRef.current) {
      haptic('warning');
      return;
    }
    haptic('light');
    setHolding(true);
    charge.value = withTiming(1, { duration: exercise.holdMs, easing: Easing.linear });
    timeoutRef.current = setTimeout(() => {
      anchoredRef.current = true;
      setAnchored(true);
      setHolding(false);
      haptic('success');
    }, exercise.holdMs);
  };

  const endHold = () => {
    setHolding(false);
    if (anchoredRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    charge.value = withTiming(0, { duration: 250 });
  };

  const fillStyle = useAnimatedStyle(() => ({ height: `${charge.value * 100}%` }));

  const selectMantra = (value: string) => {
    if (anchored) return;
    haptic('light');
    setMantra(value);
  };

  let hint = 'Primero elige tu mantra.';
  if (anchored) hint = '¡Mantra anclado! Vuelve a él cuando la ola suba.';
  else if (holding) hint = 'Repítelo en silencio mientras se carga…';
  else if (mantra) hint = `Mantén presionado ${exercise.holdMs / 1000} segundos para fijarlo.`;

  return (
    <StepLayout
      footer={
        <Button3D
          label="Continuar"
          onPress={() => mantra && onComplete({ kind: 'mantra', mantra })}
          disabled={!anchored}
          variant="success"
          haptics="success"
        />
      }
    >
      <Text style={[styles.title, { color: colors.text }]}>{exercise.title}</Text>
      <View style={styles.options}>
        {exercise.mantras.map((value) => (
          <OptionTile
            key={value}
            title={`"${value}"`}
            state={mantra === value ? (anchored ? 'correct' : 'selected') : anchored ? 'disabled' : 'idle'}
            onPress={() => selectMantra(value)}
          />
        ))}
      </View>
      <View style={styles.holdArea}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mantener presionado para anclar el mantra"
          onPressIn={startHold}
          onPressOut={endHold}
          style={[
            styles.hold,
            { borderColor: anchored ? colors.success : colors.accent, backgroundColor: colors.surface },
          ]}
        >
          <Animated.View
            style={[styles.fill, { backgroundColor: anchored ? colors.success : colors.accent }, fillStyle]}
          />
          <Anchor color={anchored || holding ? palette.white : colors.accent} size={48} />
        </Pressable>
        <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text>
      </View>
    </StepLayout>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title },
  options: { gap: spacing.sm },
  holdArea: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  hold: {
    width: HOLD_SIZE,
    height: HOLD_SIZE,
    borderRadius: HOLD_SIZE,
    borderWidth: 4,
    borderBottomWidth: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, right: 0, bottom: 0, borderRadius: radius.md },
  hint: { ...typography.body, textAlign: 'center' },
});
