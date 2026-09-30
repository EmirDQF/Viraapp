import { LinearGradient } from 'expo-linear-gradient';
import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { withAlpha } from '@/lib/color';
import { spring } from '@/theme/motion';
import { brand, gradients, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const PARTICLES = 22;
const PARTICLE_MS = 1600;
const RISE = 180;
const OVERLAY_ALPHA = 0.94;
const TITLE_MAX_WIDTH = 320;

interface ParticleSpec {
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly delay: number;
  readonly color: string;
}

/** Partícula que sube y se disuelve: los mensajes "se deshacen" en luz. */
const Particle = memo(function Particle({ spec }: { readonly spec: ParticleSpec }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withDelay(spec.delay, withTiming(1, { duration: PARTICLE_MS, easing: Easing.out(Easing.quad) })));
  }, [spec.delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.get() < 0.2 ? t.get() * 5 : 1 - (t.get() - 0.2) / 0.8,
    transform: [{ translateY: -t.get() * RISE }, { scale: 1 - t.get() * 0.5 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        { left: spec.x, top: spec.y, width: spec.size, height: spec.size, backgroundColor: spec.color },
        style,
      ]}
    />
  );
});

/** Posiciones deterministas (sin aleatoriedad en el render) repartidas por la zona central de la pantalla. */
function particleSpecs(width: number, height: number): readonly ParticleSpec[] {
  const palette = [brand.lilacLight, brand.sage, brand.white, brand.lilac];
  return Array.from({ length: PARTICLES }, (_, index) => {
    const column = (index * 37) % 100;
    const row = (index * 53) % 100;
    return {
      x: (column / 100) * width,
      y: height * 0.25 + (row / 100) * height * 0.5,
      size: 4 + (index % 4) * 2,
      delay: (index % 7) * 90,
      color: palette[index % palette.length],
    };
  });
}

/**
 * "Borrón y cuenta nueva" (maqueta 5): los mensajes se desvanecen en partículas de luz que suben y aparece
 * "Un mal día no te define". Con movimiento reducido solo hay un fundido.
 */
export function ResetOverlay() {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const { width, height } = useWindowDimensions();
  const specs = useMemo(() => particleSpecs(width, height), [height, width]);
  const [regiStart, regiEnd] = gradients.regi;
  const entering = reduceMotion ? FadeIn : ZoomIn.delay(150).springify().damping(spring.gentle.damping);

  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      exiting={FadeOut.duration(450)}
      accessibilityLiveRegion="assertive"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={[withAlpha(regiEnd, OVERLAY_ALPHA), withAlpha(colors.background, 0.97), withAlpha(regiStart, 0.5)]}
        style={StyleSheet.absoluteFill}
      />
      {reduceMotion ? null : specs.map((spec) => <Particle key={`${spec.x}-${spec.y}`} spec={spec} />)}
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Animated.View entering={entering} style={styles.content}>
          <RegiMascot pose="resilient" size={120} glow={0.7} glowColor={brand.lilacLight} />
          <AppText variant="display" align="center" style={styles.title}>
            Un mal día no te define
          </AppText>
          <AppText variant="bodyStrong" align="center" tone="muted">
            Reiniciando para un nuevo comienzo…
          </AppText>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  content: { alignItems: 'center', gap: spacing.md },
  title: { maxWidth: TITLE_MAX_WIDTH },
  particle: { position: 'absolute', borderRadius: 999 },
});
