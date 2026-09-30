import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomOut } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ChoiceButton } from '@/features/game/ChoiceButton';
import type { SimProps } from '@/features/game/mechanics/SimulatorMechanic';
import { haptic } from '@/lib/haptics';
import { radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type Stage = 'write' | 'sort' | 'done';

/** El Descarga: escribir en crudo y "soltar" (el texto no se guarda ni se envía), luego separar lo controlable. */
export function JournalSim({ content, tone, onDone }: SimProps) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [stage, setStage] = useState<Stage>('write');
  const [choice, setChoice] = useState<string | null>(null);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };

  if (stage === 'write') {
    return (
      <Animated.View exiting={ZoomOut.duration(400)} style={styles.root}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={content.placeholder}
          placeholderTextColor={colors.textMuted}
          accessibilityLabel="Tu descarga"
          multiline
          maxLength={2000}
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
        />
        <Button3D
          label="Soltar"
          tone={button}
          disabled={text.trim().length < 3}
          haptics="medium"
          onPress={() => {
            setText('');
            setStage('sort');
          }}
        />
      </Animated.View>
    );
  }

  if (stage === 'sort') {
    return (
      <Animated.View entering={FadeIn.duration(400)} exiting={FadeOut} style={styles.root}>
        <AppText variant="heading" align="center">
          Soltado. Ahora, lo que más te pesa…
        </AppText>
        {content.options.map((option) => (
          <ChoiceButton key={option.label} label={`${option.label}: ${option.detail}`} onPress={() => {
            haptic('selection');
            setChoice(option.detail);
            setStage('done');
          }} />
        ))}
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={styles.root}>
      <AppText variant="heading" align="center">
        {choice}
      </AppText>
      <AppText tone="muted" align="center">
        {content.closing}
      </AppText>
      <Button3D label="Continuar" tone={button} onPress={onDone} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  input: {
    minHeight: 180,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: spacing.md,
    textAlignVertical: 'top',
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
});

