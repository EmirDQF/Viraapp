import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { seedFrom, seededRandom } from '@/lib/random';
import { shuffle } from '@/lib/shuffle';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { WordRainContent } from '@/types/content';

/** 16 palabras en ~45 s: una nueva cada 2,5 s y cada una tarda 6 s en caer. */
const SPAWN_EVERY_MS = 2500;
const FALL_MS = 6000;
const SLOW_FALL_MS = 9000;
const WORD_WIDTH = 132;

interface Drop {
  readonly id: number;
  readonly text: string;
  readonly good: boolean;
  readonly lane: number;
}

type DropState = 'falling' | 'caught' | 'landed';

interface FallingWordProps {
  readonly drop: Drop;
  readonly height: number;
  readonly left: number;
  readonly fallMs: number;
  readonly state: DropState;
  readonly onTap: (drop: Drop) => void;
  readonly onLanded: (drop: Drop) => void;
}

const FallingWord = memo(function FallingWord({ drop, height, left, fallMs, state, onTap, onLanded }: FallingWordProps) {
  const { colors } = useTheme();
  const y = useSharedValue(-MIN_TOUCH);

  useEffect(() => {
    y.set(
      withDelay(
        drop.id * SPAWN_EVERY_MS,
        withTiming(height, { duration: fallMs, easing: Easing.linear }, (finished) => {
          if (finished) scheduleOnRN(onLanded, drop);
        }),
      ),
    );
    return () => cancelAnimation(y);
  }, [drop, fallMs, height, onLanded, y]);

  useEffect(() => {
    if (state === 'caught') cancelAnimation(y);
  }, [state, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }], opacity: state === 'caught' ? 0 : 1 }));
  if (state !== 'falling') return null;
  return (
    <Animated.View style={[styles.word, { left }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Atrapar la palabra ${drop.text}`}
        onPress={() => onTap(drop)}
        style={[styles.chip, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <AppText variant="bodyStrong" align="center">
          {drop.text}
        </AppText>
      </Pressable>
    </Animated.View>
  );
});

/** Lluvia de palabras: atrapa las buenas, esquiva las malas. */
export function WordRainMechanic({ content, tone, onComplete }: MechanicProps<WordRainContent>) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const score = useStageScore();
  const [started, setStarted] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [states, setStates] = useState<Readonly<Record<number, DropState>>>({});
  const [caughtGood, setCaughtGood] = useState(0);

  const drops = useMemo<readonly Drop[]>(() => {
    const random = seededRandom(seedFrom(content.phrase));
    const words = shuffle([...content.good.map((text) => ({ text, good: true })), ...content.bad.map((text) => ({ text, good: false }))], random);
    return words.map((word, id) => ({ id, ...word, lane: random() }));
  }, [content]);

  const resolve = useCallback((drop: Drop, next: DropState) => {
    setStates((current) => (current[drop.id] && current[drop.id] !== 'falling' ? current : { ...current, [drop.id]: next }));
  }, []);

  const onTap = useCallback(
    (drop: Drop) => {
      score.answer(drop.good);
      if (drop.good) setCaughtGood((value) => value + 1);
      resolve(drop, 'caught');
    },
    [resolve, score],
  );

  const onLanded = useCallback(
    (drop: Drop) => {
      // Dejar caer una palabra mala es esquivarla bien; dejar caer una buena es perderla (sin castigo extra).
      score.answer(!drop.good);
      resolve(drop, 'landed');
    },
    [resolve, score],
  );

  const onLayout = (event: LayoutChangeEvent) => setSize({ width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height });
  const finished = Object.values(states).filter((state) => state !== 'falling').length >= drops.length;
  const fallMs = reduceMotion ? SLOW_FALL_MS : FALL_MS;

  if (!started) {
    return (
      <View style={styles.intro}>
        <AppText variant="heading" align="center">
          Lluvia de palabras
        </AppText>
        <AppText tone="muted" align="center">
          Van a caer 16 palabras durante unos 45 segundos. Toca las que te ayudan y deja pasar las que no.
        </AppText>
        <Button3D label="Empezar" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => setStarted(true)} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <AppText variant="bodyStrong">
          Atrapadas: {caughtGood} / {content.good.length}
        </AppText>
      </View>
      <View style={[styles.field, { backgroundColor: tone.soft, borderColor: colors.border }]} onLayout={onLayout}>
        {size.height > 0
          ? drops.map((drop) => (
              <FallingWord
                key={drop.id}
                drop={drop}
                height={size.height}
                left={drop.lane * Math.max(0, size.width - WORD_WIDTH)}
                fallMs={fallMs}
                state={states[drop.id] ?? 'falling'}
                onTap={onTap}
                onLanded={onLanded}
              />
            ))
          : null}
      </View>
      {finished ? <FeedbackPanel correct message={`“${content.phrase}”`} onContinue={() => onComplete(score.result())} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.sm },
  intro: { flex: 1, justifyContent: 'center', gap: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'center' },
  field: { flex: 1, minHeight: 320, borderRadius: radius.xxl, borderWidth: 1, overflow: 'hidden' },
  word: { position: 'absolute', top: 0, width: WORD_WIDTH },
  chip: { borderRadius: radius.pill, borderWidth: 2, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH, justifyContent: 'center' },
});
