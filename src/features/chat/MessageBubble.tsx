import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import type { ChatMessage } from '@/store/types';
import { spring } from '@/theme/motion';
import { elevationFor, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const AVATAR = 36;
const DOT_LIFT = -5;
const DOT_MS = 280;
const DOT_STAGGER_MS = 140;

function Dot({ progress }: { readonly progress: SharedValue<number> }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.get() * DOT_LIFT }],
    opacity: 0.45 + progress.get() * 0.55,
  }));
  return <Animated.View style={[styles.dot, { backgroundColor: colors.regi }, style]} />;
}

/** "Escribiendo…": tres puntos que saltan en secuencia. */
function TypingDots() {
  const reduceMotion = useReduceMotion();
  const first = useSharedValue(0);
  const second = useSharedValue(0);
  const third = useSharedValue(0);

  useEffect(() => {
    const dots = [first, second, third];
    if (reduceMotion) {
      dots.forEach((dot) => dot.set(0.6));
      return;
    }
    const bounce = withSequence(withTiming(1, { duration: DOT_MS }), withTiming(0, { duration: DOT_MS }));
    dots.forEach((dot, index) => {
      dot.set(withDelay(index * DOT_STAGGER_MS, withRepeat(bounce, -1, false)));
    });
    return () => dots.forEach((dot) => cancelAnimation(dot));
  }, [first, reduceMotion, second, third]);

  return (
    <View style={styles.dots} accessibilityLabel="Regi está escribiendo">
      <Dot progress={first} />
      <Dot progress={second} />
      <Dot progress={third} />
    </View>
  );
}

/** Burbuja de chat: Regi a la izquierda (vidrio, con avatar), el usuario a la derecha (petróleo). */
export const MessageBubble = memo(function MessageBubble({ message, typing }: { readonly message: ChatMessage; readonly typing: boolean }) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const mine = message.role === 'user';
  const entering = reduceMotion ? FadeIn : FadeInUp.springify().damping(spring.gentle.damping);
  const label = `${mine ? 'Tú' : 'Regi'}: ${message.text || 'escribiendo'}`;
  const content =
    typing && !message.text ? <TypingDots /> : <AppText color={mine ? colors.onPrimary : colors.text}>{message.text}</AppText>;

  return (
    <Animated.View entering={entering} style={[styles.row, mine && styles.rowMine]}>
      {mine ? null : (
        <View style={[styles.avatar, { backgroundColor: colors.regiSoft, borderColor: colors.glassBorder }]}>
          <RegiMascot pose="calm" size={AVATAR} />
        </View>
      )}
      {mine ? (
        <View
          accessible
          accessibilityLabel={label}
          style={[styles.bubble, styles.mine, elevationFor('sm', isDark), { backgroundColor: colors.primary }]}
        >
          {content}
        </View>
      ) : (
        // Sin desenfoque real: en una lista larga se evita anidar blurs (solo tinte de vidrio).
        <GlassCard
          blur={false}
          padded={false}
          radius={radius.lg}
          elevation="sm"
          accessibilityLabel={label}
          style={[styles.bubble, styles.theirs]}
        >
          <View style={styles.bubbleInner}>{content}</View>
        </GlassCard>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginVertical: spacing.xs },
  rowMine: { justifyContent: 'flex-end' },
  avatar: {
    width: AVATAR + 6,
    height: AVATAR + 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bubble: { maxWidth: '78%', borderRadius: radius.lg },
  mine: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomRightRadius: 6 },
  theirs: { borderBottomLeftRadius: 6 },
  bubbleInner: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
