import { Lightbulb } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { ChoiceButton } from '@/features/game/ChoiceButton';
import type { DecisionOutcome, MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { radius, spacing } from '@/theme/tokens';
import type { DecisionScene } from '@/types/content';

const LETTERS = ['A', 'B'] as const;
const GOOD_GLOW = 0.9;
const BAD_GLOW = -0.85;

interface DecisionProps extends Omit<MechanicProps<DecisionScene>, 'onComplete'> {
  readonly onComplete: (result: DecisionOutcome) => void;
}

/**
 * Video interactivo / decisión: escena ilustrada con Regi, opciones A y B, resultado y tarjeta de aprendizaje.
 * Regi refleja la decisión (se tensa o brilla). Si la elección fue impulsiva, se puede volver a elegir.
 */
export function DecisionMechanic({ content, tone, onComplete }: DecisionProps) {
  const score = useStageScore();
  const [choice, setChoice] = useState<number | null>(null);
  const [firstChoiceGood, setFirstChoiceGood] = useState<boolean | null>(null);
  const option = choice === null ? null : content.options[choice];
  const glow = option ? (option.good ? GOOD_GLOW : BAD_GLOW) : 0;

  const choose = (index: number) => {
    const good = content.options[index].good;
    if (firstChoiceGood === null) setFirstChoiceGood(good);
    score.answer(good, firstChoiceGood === null);
    setChoice(index);
  };

  const finish = () => {
    const result = score.result();
    onComplete({ ...result, score: firstChoiceGood ? 1 : 0.5, firstChoiceGood: firstChoiceGood === true });
  };

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={[styles.scene, { backgroundColor: tone.soft }]} accessible accessibilityLabel={`Escena: ${content.situation}`}>
        <AppText variant="overline" color={tone.deep}>
          {content.title}
        </AppText>
        <RegiMascot pose={option?.good ? 'growth' : option ? 'empathetic' : 'calm'} size={150} glow={glow} glowColor={tone.base} />
        <AppText variant="bodyStrong" align="center" color={tone.deep}>
          {content.situation}
        </AppText>
      </View>
      {option === null ? (
        <View style={styles.options}>
          <AppText variant="subtitle">¿Qué hace Regi?</AppText>
          {content.options.map((item, index) => (
            <ChoiceButton key={item.label} label={item.label} badge={LETTERS[index]} onPress={() => choose(index)} />
          ))}
        </View>
      ) : (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.options}>
          <Card>
            <AppText variant="overline" tone="muted">
              Resultado
            </AppText>
            <AppText>{option.outcome}</AppText>
          </Card>
          <Card tone="alt" style={styles.learning}>
            <Lightbulb color={tone.base} size={22} />
            <AppText variant="bodyStrong" style={styles.learningText}>
              {option.learning}
            </AppText>
          </Card>
          {option.good ? (
            <Button3D label="Continuar" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={finish} />
          ) : (
            <Button3D label="Volver a elegir" variant="outline" onPress={() => setChoice(null)} haptics="light" />
          )}
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingBottom: spacing.xl },
  scene: { alignItems: 'center', gap: spacing.sm, padding: spacing.lg, borderRadius: radius.xxl },
  options: { gap: spacing.md },
  learning: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  learningText: { flex: 1 },
});
