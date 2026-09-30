import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useId, type ReactNode } from 'react';
import { StyleSheet, useWindowDimensions, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { duration } from '@/theme/motion';
import { backgroundGradients, blobColors, type BackgroundVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

export type { BackgroundVariant } from '@/theme/tokens';

const BLOB_OPACITY_LIGHT = 0.35;
const BLOB_OPACITY_DARK = 0.2;
/** Cuánto se desplaza una mancha en su deriva (fracción de su tamaño). */
const DRIFT = 0.12;
const BLOB_GROWTH = 0.08;

interface BlobProps {
  readonly color: string;
  readonly size: number;
  readonly opacity: number;
  readonly left: number;
  readonly top: number;
  readonly phase: 1 | -1;
  readonly animate: boolean;
}

const Blob = memo(function Blob({ color, size, opacity, left, top, phase, animate }: BlobProps) {
  const id = `blob-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const t = useSharedValue(0);

  useEffect(() => {
    if (!animate) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(withTiming(1, { duration: duration.blobDrift, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(t);
  }, [animate, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: (t.value - 0.5) * size * DRIFT * 2 * phase },
      { translateY: (0.5 - t.value) * size * DRIFT * phase },
      { scale: 1 + t.value * BLOB_GROWTH },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.blob, { width: size, height: size, left, top }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={opacity} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
});

interface ScreenBackgroundProps {
  readonly children?: ReactNode;
  readonly variant?: BackgroundVariant;
  /** Sin manchas (p. ej. pantallas con mucho contenido encima). */
  readonly plain?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Fondo vivo: degradado del tema + 2-3 manchas difusas que derivan muy despacio (24 s). Con "reducir
 * movimiento" las manchas se quedan quietas.
 */
export function ScreenBackground({ children, variant = 'default', plain = false, style }: ScreenBackgroundProps) {
  const { isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const { width, height } = useWindowDimensions();
  const config = backgroundGradients[variant];
  const stops = isDark ? config.dark : config.light;
  const blobs = config.blobs ?? (isDark ? blobColors.dark : blobColors.light);
  const opacity = isDark ? BLOB_OPACITY_DARK : BLOB_OPACITY_LIGHT;
  const big = width * 1.1;
  const animate = !reduceMotion;

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={stops} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {plain ? null : (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip]}>
          <Blob color={blobs[0]} size={big} opacity={opacity} left={-big * 0.45} top={-big * 0.35} phase={1} animate={animate} />
          <Blob
            color={blobs[1]}
            size={big * 0.9}
            opacity={opacity}
            left={width - big * 0.45}
            top={height * 0.35}
            phase={-1}
            animate={animate}
          />
          {blobs[2] ? (
            <Blob
              color={blobs[2]}
              size={big * 0.7}
              opacity={opacity * 0.7}
              left={-big * 0.2}
              top={height * 0.8}
              phase={1}
              animate={animate}
            />
          ) : null}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  clip: { overflow: 'hidden' },
  blob: { position: 'absolute' },
});
