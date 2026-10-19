import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { RegiMascot, type RegiPose } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { TAP_LINES } from '@/data/regiLines';
import { haptic } from '@/lib/haptics';
import { radius, spacing } from '@/theme/tokens';
import { useReduceMotion } from '@/theme/useReduceMotion';
import { useTheme } from '@/theme/useTheme';

/** Cuánto sigue Regi al dedo al arrastrarlo (se resiste un poco) y el tope del desplazamiento. */
const DRAG_FOLLOW = 0.45;
const DRAG_MAX = 60;
const BOUNCE_BACK = { damping: 7, stiffness: 180, mass: 0.7 } as const;
const BUBBLE_MS = 2600;

interface InteractiveRegiProps {
  readonly pose?: RegiPose;
  readonly size?: number;
  readonly glow?: number;
  readonly glowColor?: string;
  /** Frases que dice al tocarlo, en orden (por defecto, las de TAP_LINES). */
  readonly lines?: readonly string[];
}

const clamp = (value: number): number => {
  'worklet';
  return Math.max(-DRAG_MAX, Math.min(DRAG_MAX, value));
};

/** Regi que responde al tacto: al tocarlo se ríe y dice una frase; al arrastrarlo, rebota a su sitio. */
export function InteractiveRegi({ pose = 'calm', size = 160, glow, glowColor, lines = TAP_LINES }: InteractiveRegiProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const [taps, setTaps] = useState(0);
  const [line, setLine] = useState<string | null>(null);
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const onTap = () => {
    const next = taps + 1;
    setTaps(next);
    setLine(lines[(next - 1) % lines.length] ?? TAP_LINES[0]);
    haptic('light');
  };

  useEffect(() => {
    if (!line) return;
    const timer = setTimeout(() => setLine(null), BUBBLE_MS);
    return () => clearTimeout(timer);
  }, [line, taps]);

  const tap = Gesture.Tap().runOnJS(true).onEnd(onTap);
  const pan = Gesture.Pan()
    .enabled(!reduceMotion)
    .onUpdate((event) => {
      x.value = clamp(event.translationX * DRAG_FOLLOW);
      y.value = clamp(event.translationY * DRAG_FOLLOW);
    })
    .onEnd(() => {
      x.value = withSpring(0, BOUNCE_BACK);
      y.value = withSpring(0, BOUNCE_BACK);
    });
  const drag = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { translateY: y.value }] }));

  return (
    <View style={styles.root}>
      {line ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(220)}
          accessibilityLiveRegion="polite"
          style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <AppText variant="bodyStrong" align="center">
            {line}
          </AppText>
        </Animated.View>
      ) : null}
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <Animated.View
          accessible
          accessibilityRole="button"
          accessibilityLabel="Regi"
          accessibilityHint="Tócalo para que te diga algo"
          onAccessibilityTap={onTap}
          style={drag}
        >
          <RegiMascot pose={taps > 0 && line ? 'growth' : pose} size={size} glow={glow} glowColor={glowColor} reaction="laugh" reactionKey={taps} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center' },
  bubble: {
    position: 'absolute',
    top: -spacing.lg,
    zIndex: 2,
    maxWidth: 240,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
});
