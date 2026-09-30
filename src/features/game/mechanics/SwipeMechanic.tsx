import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { SwipeContent, SwipeSide } from '@/types/content';

const SWIPE_THRESHOLD = 110;
const MAX_ROTATION = 14;

/** Swipe: la tarjeta se desliza a izquierda o derecha con rotación y feedback. Botones para accesibilidad. */
export function SwipeMechanic({ content, tone, onComplete }: MechanicProps<SwipeContent>) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const score = useStageScore();
  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<{ correct: boolean; why: string } | null>(null);
  const translateX = useSharedValue(0);
  const card = content.cards[index];

  const decide = useCallback(
    (side: SwipeSide) => {
      if (verdict) return;
      const correct = card.answer === side;
      score.answer(correct);
      setVerdict({ correct, why: card.why });
    },
    [card, score, verdict],
  );

  const flyOut = (side: SwipeSide) => {
    translateX.set(withTiming(side === 'left' ? -width : width, { duration: 220 }));
    decide(side);
  };

  const next = () => {
    setVerdict(null);
    translateX.set(0);
    if (index + 1 >= content.cards.length) {
      onComplete(score.result());
      return;
    }
    setIndex(index + 1);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(verdict === null)
        .onUpdate((event) => {
          translateX.set(event.translationX);
        })
        .onEnd((event) => {
          if (Math.abs(event.translationX) < SWIPE_THRESHOLD) {
            translateX.set(withSpring(0));
            return;
          }
          const side: SwipeSide = event.translationX < 0 ? 'left' : 'right';
          translateX.set(withTiming(side === 'left' ? -width : width, { duration: 200 }));
          scheduleOnRN(decide, side);
        }),
    [decide, translateX, verdict, width],
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.get() },
      { rotate: `${interpolate(translateX.get(), [-width, 0, width], [-MAX_ROTATION, 0, MAX_ROTATION])}deg` },
    ],
  }));

  return (
    <View style={styles.root}>
      <AppText variant="subtitle" align="center">
        {content.prompt}
      </AppText>
      <View style={styles.labels}>
        <AppText variant="overline" tone="muted">
          ← {content.left}
        </AppText>
        <AppText variant="caption" tone="muted">
          {index + 1} / {content.cards.length}
        </AppText>
        <AppText variant="overline" tone="muted">
          {content.right} →
        </AppText>
      </View>
      <View style={styles.stage}>
        <GestureDetector gesture={pan}>
          <Animated.View
            accessible
            accessibilityLabel={`Tarjeta: ${card.text}`}
            style={[styles.card, { backgroundColor: colors.surface, borderColor: tone.base }, elevation.raised, cardStyle]}
          >
            <AppText variant="heading" align="center">
              {card.text}
            </AppText>
          </Animated.View>
        </GestureDetector>
      </View>
      {verdict ? (
        <FeedbackPanel correct={verdict.correct} message={verdict.why} onContinue={next} />
      ) : (
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button3D label={content.left} variant="outline" icon={<ArrowLeft color={colors.text} size={18} />} onPress={() => flyOut('left')} />
          </View>
          <View style={styles.button}>
            <Button3D
              label={content.right}
              tone={{ face: tone.base, shadow: tone.deep, text: tone.on }}
              icon={<ArrowRight color={tone.on} size={18} />}
              onPress={() => flyOut('right')}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.md },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 260 },
  card: { width: '92%', minHeight: 220, borderRadius: radius.xxl, borderWidth: 3, padding: spacing.xl, justifyContent: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1 },
});
