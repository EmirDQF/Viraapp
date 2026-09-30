import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeInUp,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import type { ChatMessage } from '@/store/types';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

function TypingDots() {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const pulse = useSharedValue(0.4);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(withRepeat(withTiming(1, { duration: 600 }), -1, true));
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);
  const style = useAnimatedStyle(() => ({ opacity: pulse.get() }));
  return (
    <Animated.View style={[styles.dots, style]} accessibilityLabel="Regi está escribiendo">
      {[0, 1, 2].map((dot) => (
        <View key={dot} style={[styles.dot, { backgroundColor: colors.textMuted }]} />
      ))}
    </Animated.View>
  );
}

/** Burbuja de chat: Regi a la izquierda con su avatar, el usuario a la derecha. */
export const MessageBubble = memo(function MessageBubble({ message, typing }: { readonly message: ChatMessage; readonly typing: boolean }) {
  const { colors } = useTheme();
  const mine = message.role === 'user';
  return (
    <Animated.View entering={FadeInUp.duration(220)} style={[styles.row, mine && styles.rowMine]}>
      {!mine ? <RegiMascot pose="calm" size={40} /> : null}
      <View
        accessible
        accessibilityLabel={`${mine ? 'Tú' : 'Regi'}: ${message.text || 'escribiendo'}`}
        style={[
          styles.bubble,
          mine
            ? [styles.mine, { backgroundColor: colors.primary }]
            : [styles.theirs, { backgroundColor: colors.surface, borderColor: colors.border }],
        ]}
      >
        {typing && !message.text ? <TypingDots /> : <AppText color={mine ? colors.onPrimary : colors.text}>{message.text}</AppText>}
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs, marginVertical: spacing.xs },
  rowMine: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  mine: { borderBottomRightRadius: 6 },
  theirs: { borderWidth: 1, borderBottomLeftRadius: 6 },
  dots: { flexDirection: 'row', gap: 5, paddingVertical: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
