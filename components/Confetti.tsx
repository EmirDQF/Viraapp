import { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { palette } from '../theme/tokens';

const PIECES = 36;
const COLORS = [palette.amber, palette.phoenix, palette.victory, palette.sageLight, '#F7A8C0', '#60A5FA'];

interface PieceSpec {
  readonly x: number;
  readonly delay: number;
  readonly duration: number;
  readonly color: string;
  readonly width: number;
  readonly spin: number;
  readonly drift: number;
}

function ConfettiPiece({ spec, height }: { readonly spec: PieceSpec; readonly height: number }) {
  const fall = useSharedValue(0);

  useEffect(() => {
    fall.value = withDelay(spec.delay, withTiming(1, { duration: spec.duration, easing: Easing.in(Easing.quad) }));
  }, [fall, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - fall.value * 0.3,
    transform: [
      { translateY: -40 + fall.value * (height + 80) },
      { translateX: Math.sin(fall.value * Math.PI * 2) * spec.drift },
      { rotate: `${fall.value * spec.spin}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[styles.piece, { left: spec.x, width: spec.width, height: spec.width * 1.6, backgroundColor: spec.color }, style]}
    />
  );
}

export function Confetti() {
  const { width, height } = useWindowDimensions();
  const pieces = useMemo<readonly PieceSpec[]>(
    () =>
      Array.from({ length: PIECES }, (_, index) => ({
        x: Math.random() * width,
        delay: Math.random() * 500,
        duration: 1800 + Math.random() * 1400,
        color: COLORS[index % COLORS.length],
        width: 6 + Math.random() * 6,
        spin: 360 + Math.random() * 720,
        drift: 10 + Math.random() * 30,
      })),
    [width],
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((spec, index) => (
        <ConfettiPiece key={index} spec={spec} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, borderRadius: 2 },
});
