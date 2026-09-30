import { memo, useEffect, useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { Head, Tail, Torso } from '@/components/regi/Body';
import { EmpatheticAura, GlowHalo, TensionOutline } from '@/components/regi/Extras';
import { Face } from '@/components/regi/Face';
import { Gills } from '@/components/regi/Gills';
import { Hands } from '@/components/regi/Hands';
import { REGI, clampGlow, regiAccessibilityLabel, regiPalette, type RegiColors, type RegiPose } from '@/lib/regi';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export type { RegiPose } from '@/lib/regi';

const BREATH_MS = 1600;
const BREATH_LIFT = -3;
const SWAY_DEG = 3;

interface RegiMascotProps {
  readonly pose?: RegiPose;
  readonly size?: number;
  /** Espejo emocional: -1 (tenso, desaturado) a 1 (brilla con el color del módulo). */
  readonly glow?: number;
  /** Color del halo cuando glow > 0 (normalmente el color del módulo). */
  readonly glowColor?: string;
}

const RegiFigure = memo(function RegiFigure({ pose, colors }: { readonly pose: RegiPose; readonly colors: RegiColors }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <G>
        <Tail colors={colors} pose={pose} />
        <Torso colors={colors} />
        <Gills colors={colors} />
        <Head colors={colors} />
        <Face colors={colors} pose={pose} />
        <Hands colors={colors} pose={pose} />
      </G>
    </Svg>
  );
});

const RegiBackdrop = memo(function RegiBackdrop({
  pose,
  glow,
  glowColor,
  colors,
  gradientId,
}: {
  readonly pose: RegiPose;
  readonly glow: number;
  readonly glowColor: string;
  readonly colors: RegiColors;
  readonly gradientId: string;
}) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      {glow > 0 ? <GlowHalo id={gradientId} color={glowColor} intensity={glow} /> : null}
      {glow < 0 ? <TensionOutline colors={colors} intensity={-glow} /> : null}
      {pose === 'empathetic' ? <EmpatheticAura colors={colors} /> : null}
    </Svg>
  );
});

/** Regi, el ajolote guía de VIRA. Respira despacio y respeta "reducir movimiento". */
export function RegiMascot({ pose = 'calm', size = 160, glow = 0, glowColor = REGI.leafHalo }: RegiMascotProps) {
  const reduceMotion = useReducedMotion();
  const value = clampGlow(glow);
  // Id único por instancia: en web los <defs> de SVG son globales y colisionarían entre varios Regi.
  const gradientId = `regiGlow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const colors = regiPalette(value);
  const hasBackdrop = value !== 0 || pose === 'empathetic';
  const breath = useSharedValue(0);
  const pulse = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      breath.value = 0;
      pulse.value = 0;
      sway.value = 0;
      return;
    }
    const ease = Easing.inOut(Easing.sin);
    breath.value = withRepeat(withTiming(1, { duration: BREATH_MS, easing: ease }), -1, true);
    // El pulso solo corre si hay halo o contorno que mostrar (evita trabajo continuo en el hilo de UI).
    pulse.value = hasBackdrop ? withRepeat(withTiming(1, { duration: BREATH_MS * 1.5, easing: ease }), -1, true) : 0;
    sway.value = pose === 'growth' ? withRepeat(withTiming(1, { duration: BREATH_MS, easing: ease }), -1, true) : 0;
    return () => {
      cancelAnimation(breath);
      cancelAnimation(pulse);
      cancelAnimation(sway);
    };
  }, [breath, hasBackdrop, pose, pulse, reduceMotion, sway]);

  const figureStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: breath.value * BREATH_LIFT }, { rotate: `${(sway.value * 2 - 1) * SWAY_DEG * (pose === 'growth' ? 1 : 0)}deg` }],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.85 + pulse.value * 0.15,
    transform: [{ scale: 1 + pulse.value * 0.03 }],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={regiAccessibilityLabel(pose, value)}
      style={{ width: size, height: size }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, haloStyle]}>
        {hasBackdrop ? (
          <RegiBackdrop pose={pose} glow={value} glowColor={glowColor} colors={colors} gradientId={gradientId} />
        ) : null}
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, figureStyle]}>
        <RegiFigure pose={pose} colors={colors} />
      </Animated.View>
    </View>
  );
}

interface RegiSaysProps {
  readonly pose?: RegiPose;
  readonly message: string;
  readonly size?: number;
  readonly glow?: number;
  readonly glowColor?: string;
}

/** Regi con un globo de diálogo a su derecha. */
export function RegiSays({ pose = 'calm', message, size = 96, glow, glowColor }: RegiSaysProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <RegiMascot pose={pose} size={size} glow={glow} glowColor={glowColor} />
      <View
        accessibilityLiveRegion="polite"
        style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={[styles.tail, { backgroundColor: colors.surface, borderColor: colors.border }]} />
        <AppText variant="body">{message}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bubble: { flex: 1, borderWidth: 1.5, borderRadius: radius.xl, padding: spacing.md },
  tail: {
    position: 'absolute',
    left: -7,
    top: '50%',
    width: 12,
    height: 12,
    marginTop: -6,
    borderLeftWidth: 1.5,
    borderBottomWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
});
