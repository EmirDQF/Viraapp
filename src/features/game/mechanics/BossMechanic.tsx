import { Timer } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { seedFrom, seededRandom } from '@/lib/random';
import { shuffle } from '@/lib/shuffle';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { BossContent, SwipeSide } from '@/types/content';

const TICK_MS = 1000;

/** Boss contrarreloj: clasificar rápido cada tarjeta. Si se acaba el tiempo no se pierde nada: se cierra con lo logrado. */
export function BossMechanic({ content, tone, onComplete }: MechanicProps<BossContent>) {
  const { colors } = useTheme();
  const score = useStageScore();
  const items = useMemo(() => shuffle(content.items, seededRandom(seedFrom(content.prompt))), [content]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(content.seconds);
  const [flash, setFlash] = useState<boolean | null>(null);
  const timeUp = remaining <= 0;
  const done = index >= items.length || timeUp;

  useEffect(() => {
    if (!started || done) return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), TICK_MS);
    return () => clearInterval(timer);
  }, [done, started]);

  const classify = (side: SwipeSide) => {
    if (done) return;
    const correct = items[index].answer === side;
    score.answer(correct);
    setFlash(correct);
    setIndex(index + 1);
  };

  if (!started) {
    return (
      <View style={styles.center}>
        <Timer color={tone.base} size={48} />
        <AppText variant="heading" align="center">
          Prueba final contrarreloj
        </AppText>
        <AppText tone="muted" align="center">
          {content.prompt} Tienes {content.seconds} segundos.
        </AppText>
        <Button3D label="¡Vamos!" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => setStarted(true)} />
      </View>
    );
  }

  if (done) {
    const { correct, total } = score.state;
    const message = timeUp && index < items.length
      ? `Se acabó el tiempo y clasificaste ${correct} de ${total}. Lo importante es que ya reconoces la diferencia.`
      : `Clasificaste bien ${correct} de ${items.length}.`;
    return (
      <View style={styles.center}>
        <FeedbackPanel correct message={message} onContinue={() => onComplete(score.result())} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <ProgressRing value={remaining / content.seconds} size={84} strokeWidth={9} color={remaining <= 10 ? colors.danger : tone.base}>
          <AppText variant="subtitle" accessibilityLabel={`Quedan ${remaining} segundos`}>
            00:{String(remaining).padStart(2, '0')}
          </AppText>
        </ProgressRing>
        <AppText variant="caption" tone="muted">
          {index + 1} / {items.length}
        </AppText>
      </View>
      <Animated.View key={index} entering={ZoomIn.duration(180)} style={[styles.card, { backgroundColor: colors.surface, borderColor: tone.base }]}>
        <AppText variant="heading" align="center" accessibilityLiveRegion="polite">
          {items[index].text}
        </AppText>
      </Animated.View>
      {flash !== null ? (
        <Animated.View entering={FadeIn} key={`f${index}`}>
          <AppText variant="bodyStrong" align="center" tone={flash ? 'success' : 'danger'}>
            {flash ? '¡Bien!' : 'Esa era del otro lado'}
          </AppText>
        </Animated.View>
      ) : null}
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button3D label={content.left} tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => classify('left')} />
        </View>
        <View style={styles.button}>
          <Button3D label={content.right} variant="outline" onPress={() => classify('right')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.lg, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: spacing.lg },
  top: { alignItems: 'center', gap: spacing.xs },
  card: { minHeight: 150, borderRadius: radius.xxl, borderWidth: 3, padding: spacing.xl, justifyContent: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1 },
});
