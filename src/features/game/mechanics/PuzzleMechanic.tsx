import { ArrowDown } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { seedFrom, seededRandom } from '@/lib/random';
import { shuffle } from '@/lib/shuffle';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { PuzzleContent } from '@/types/content';

/**
 * Rompecabezas causa → efecto: se arma la cadena tocando los bloques en orden (como el constructor de frases
 * de Duolingo). Si un bloque no va ahí, tiembla y vuelve al banco; no hay castigo.
 */
export function PuzzleMechanic({ content, tone, onComplete }: MechanicProps<PuzzleContent>) {
  const { colors } = useTheme();
  const score = useStageScore();
  const bank = useMemo(() => shuffle(content.steps, seededRandom(seedFrom(content.prompt))), [content]);
  const [chain, setChain] = useState<readonly string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [missedSlots, setMissedSlots] = useState<ReadonlySet<number>>(() => new Set());
  const shake = useSharedValue(0);
  const complete = chain.length === content.steps.length;

  const place = (step: string) => {
    const correct = content.steps[chain.length] === step;
    // Solo cuenta el primer intento de cada posición: tantear no resta (sin castigos).
    score.answer(correct, !missedSlots.has(chain.length));
    if (!correct) {
      setMissedSlots(new Set([...missedSlots, chain.length]));
      shake.set(withSequence(withTiming(-8, { duration: 50 }), withTiming(8, { duration: 50 }), withTiming(0, { duration: 50 })));
      setHint(`"${step}" va más adelante (o antes) en la cadena. ¿Qué pasa justo después de "${chain.at(-1) ?? 'el inicio'}"?`);
      return;
    }
    setHint(null);
    setChain([...chain, step]);
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText variant="heading" accessibilityRole="header">
          {content.prompt}
        </AppText>
        <Animated.View style={[styles.chain, { borderColor: colors.border }, shakeStyle]}>
          {content.steps.map((_, index) => {
            const filled = chain[index];
            return (
              <View key={index} style={styles.slotWrap}>
                <View style={[styles.slot, { backgroundColor: filled ? tone.base : colors.surfaceAlt, borderColor: filled ? tone.deep : colors.border }]}>
                  <AppText variant="bodyStrong" color={filled ? tone.on : colors.textMuted}>
                    {filled ?? `${index + 1}. ?`}
                  </AppText>
                </View>
                {index < content.steps.length - 1 ? <ArrowDown color={colors.textMuted} size={18} /> : null}
              </View>
            );
          })}
        </Animated.View>
        <View style={styles.bank} accessibilityLabel="Bloques disponibles">
          {bank
            .filter((step) => !chain.includes(step))
            .map((step) => (
              <Pressable
                key={step}
                accessibilityRole="button"
                accessibilityLabel={`Colocar ${step} en la posición ${chain.length + 1}`}
                onPress={() => place(step)}
                style={({ pressed }) => [styles.piece, { backgroundColor: colors.surface, borderColor: tone.base }, pressed && styles.pressed]}
              >
                <AppText variant="bodyStrong">{step}</AppText>
              </Pressable>
            ))}
        </View>
        {hint ? (
          <Animated.View entering={FadeIn}>
            <AppText tone="muted" accessibilityLiveRegion="polite">
              {hint}
            </AppText>
          </Animated.View>
        ) : null}
      </ScrollView>
      {complete ? <FeedbackPanel correct message={content.insight} onContinue={() => onComplete(score.result())} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { gap: spacing.lg, paddingBottom: spacing.lg },
  chain: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.xl, padding: spacing.md, gap: spacing.xs },
  slotWrap: { alignItems: 'center', gap: spacing.xs },
  slot: { alignSelf: 'stretch', borderRadius: radius.lg, borderWidth: 2, padding: spacing.md, minHeight: MIN_TOUCH, justifyContent: 'center' },
  bank: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  piece: { borderWidth: 2, borderBottomWidth: 4, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: MIN_TOUCH, justifyContent: 'center' },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
});
