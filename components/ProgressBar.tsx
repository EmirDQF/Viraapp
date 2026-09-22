import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { radius } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

interface ProgressBarProps {
  readonly value: number; // 0..1
  readonly color?: string;
  readonly height?: number;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ProgressBar({ value, color, height = 16 }: ProgressBarProps) {
  const { colors } = useTheme();
  const progress = useSharedValue(clamp(value));

  useEffect(() => {
    progress.value = withTiming(clamp(value), { duration: 450, easing: Easing.out(Easing.cubic) });
  }, [progress, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamp(value) * 100) }}
      style={[styles.track, { height, backgroundColor: colors.border }]}
    >
      <Animated.View style={[styles.fill, { backgroundColor: color ?? colors.success }, fillStyle]}>
        <View style={styles.shine} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, justifyContent: 'flex-start', paddingTop: 3, paddingHorizontal: 8 },
  shine: { height: 4, borderRadius: radius.pill, backgroundColor: 'rgba(255,255,255,0.35)' },
});
