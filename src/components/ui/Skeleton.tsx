import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View, type DimensionValue, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { withAlpha } from '@/lib/color';
import { duration } from '@/theme/motion';
import { brand, radius as radii } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const SHINE_ALPHA_LIGHT = 0.6;
const SHINE_ALPHA_DARK = 0.08;

interface SkeletonProps {
  readonly width?: DimensionValue;
  readonly height?: DimensionValue;
  readonly radius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

/** Bloque de carga con un brillo que lo recorre (sin brillo si se reduce el movimiento). */
export function Skeleton({ width = '100%', height = 16, radius = radii.sm, style }: SkeletonProps) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const [boxWidth, setBoxWidth] = useState(0);
  const t = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion || boxWidth === 0) {
      return;
    }
    t.value = withRepeat(withTiming(1, { duration: duration.shimmer, easing: Easing.inOut(Easing.quad) }), -1, false);
    return () => cancelAnimation(t);
  }, [boxWidth, reduceMotion, t]);

  const shineStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -boxWidth + t.value * boxWidth * 2 }],
  }));

  const onLayout = (event: LayoutChangeEvent) => setBoxWidth(event.nativeEvent.layout.width);
  const shine = withAlpha(brand.white, isDark ? SHINE_ALPHA_DARK : SHINE_ALPHA_LIGHT);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={onLayout}
      style={[styles.box, { width, height, borderRadius: radius, backgroundColor: colors.surfaceAlt }, style]}
    >
      {reduceMotion ? null : (
        <Animated.View style={[StyleSheet.absoluteFill, shineStyle]}>
          <LinearGradient
            colors={[withAlpha(brand.white, 0), shine, withAlpha(brand.white, 0)]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden' },
});
