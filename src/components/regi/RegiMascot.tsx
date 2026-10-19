import { memo, useEffect, useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { G } from 'react-native-svg';

import { AppText } from '@/components/ui/AppText';
import { ContactShadow, Head, Tail, Torso } from '@/components/regi/Body';
import { EmpatheticAura, GlowHalo, TensionOutline } from '@/components/regi/Extras';
import { Face, OpenEyes } from '@/components/regi/Face';
import { Gills } from '@/components/regi/Gills';
import { Hands } from '@/components/regi/Hands';
import { useRegiMotion, type RegiReaction } from '@/components/regi/useRegiMotion';
import { REGI, clampGlow, regiAccessibilityLabel, regiPalette, type RegiColors, type RegiPose } from '@/lib/regi';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

export type { RegiPose } from '@/lib/regi';
export type { RegiReaction } from '@/components/regi/useRegiMotion';

const HALO_MS = 2400;
const POSE_FADE_MS = 260;
/** Puntos de giro (en % del lienzo 200×200): centro de la cabeza para branquias y ojos, base para respirar. */
const HEAD_ORIGIN = '50% 35%';
const EYES_ORIGIN = '50% 35.5%';
const FEET_ORIGIN = '50% 92%';

interface RegiMascotProps {
  readonly pose?: RegiPose;
  readonly size?: number;
  /** Espejo emocional: -1 (tenso, desaturado) a 1 (brilla con el color del módulo). */
  readonly glow?: number;
  /** Color del halo cuando glow > 0 (normalmente el color del módulo). */
  readonly glowColor?: string;
  /** Reacción que se reproduce cada vez que cambia `reactionKey` (salto, inclinar, baile, risa). */
  readonly reaction?: RegiReaction | null;
  readonly reactionKey?: number;
  /** Sin animaciones de reposo (avatares en listas largas, como el chat): ahorra un temporizador y bucles por instancia. */
  readonly still?: boolean;
}

interface LayerProps {
  readonly colors: RegiColors;
}

/** Cuerpo, cola, manos y boca: lo que cambia con la pose. Los ojos abiertos van en su propia capa. */
const RegiFigure = memo(function RegiFigure({ pose, colors, idPrefix }: LayerProps & { readonly pose: RegiPose; readonly idPrefix: string }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <G>
        <ContactShadow colors={colors} />
        <Tail colors={colors} pose={pose} />
        <Torso colors={colors} />
        <Head colors={colors} idPrefix={idPrefix} />
        <Face colors={colors} pose={pose} openEyes={false} />
        <Hands colors={colors} pose={pose} />
      </G>
    </Svg>
  );
});

const GillLayer = memo(function GillLayer({ colors, side }: LayerProps & { readonly side: 'left' | 'right' }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Gills colors={colors} side={side} />
    </Svg>
  );
});

const EyesLayer = memo(function EyesLayer({ colors }: LayerProps) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <OpenEyes colors={colors} />
    </Svg>
  );
});

interface BackdropProps extends LayerProps {
  readonly pose: RegiPose;
  readonly glow: number;
  readonly glowColor: string;
  readonly gradientId: string;
}

const RegiBackdrop = memo(function RegiBackdrop({ pose, glow, glowColor, colors, gradientId }: BackdropProps) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      {glow > 0 ? <GlowHalo id={gradientId} color={glowColor} intensity={glow} /> : null}
      {glow < 0 ? <TensionOutline id={`${gradientId}-tension`} colors={colors} intensity={-glow} /> : null}
      {pose === 'empathetic' ? <EmpatheticAura colors={colors} /> : null}
    </Svg>
  );
});

/** Pulso suave del halo (solo si hay halo que mostrar). */
function useHaloPulse(active: boolean, reduceMotion: boolean) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!active || reduceMotion) {
      cancelAnimation(pulse);
      pulse.value = 0;
      return;
    }
    pulse.value = withRepeat(withTiming(1, { duration: HALO_MS, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(pulse);
  }, [active, pulse, reduceMotion]);
  return useAnimatedStyle(() => ({ opacity: 0.85 + pulse.value * 0.15, transform: [{ scale: 1 + pulse.value * 0.03 }] }));
}

interface PoseLayers {
  readonly current: RegiPose;
  readonly previous: RegiPose | null;
}

/**
 * Transición suave entre poses: la anterior se desvanece mientras aparece la nueva. La pose mostrada se
 * deriva de la prop durante el render (sin efecto extra); el efecto solo anima y limpia la capa saliente.
 */
function usePoseCrossfade(pose: RegiPose, reduceMotion: boolean) {
  const [shown, setShown] = useState<PoseLayers>({ current: pose, previous: null });
  if (shown.current !== pose) setShown({ current: pose, previous: reduceMotion ? null : shown.current });
  const fade = useSharedValue(1);
  const { previous } = shown;
  useEffect(() => {
    if (previous === null) return;
    fade.value = 0;
    fade.value = withTiming(1, { duration: POSE_FADE_MS });
    const timer = setTimeout(() => setShown((value) => ({ current: value.current, previous: null })), POSE_FADE_MS + 40);
    return () => clearTimeout(timer);
  }, [fade, previous]);
  const incoming = useAnimatedStyle(() => ({ opacity: fade.value }));
  const outgoing = useAnimatedStyle(() => ({ opacity: 1 - fade.value }));
  return { ...shown, incoming, outgoing };
}

/** Regi, el ajolote guía de VIRA: respira, flota, parpadea, mueve las branquias y reacciona. */
export function RegiMascot({ pose = 'calm', size = 160, glow = 0, glowColor = REGI.leafHalo, reaction = null, reactionKey = 0, still = false }: RegiMascotProps) {
  const reduceMotion = useReduceMotion() || still;
  const value = clampGlow(glow);
  // Id único por instancia: en web los <defs> de SVG son globales y colisionarían entre varios Regi.
  const gradientId = `regiGlow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const colors = regiPalette(value);
  const hasBackdrop = value !== 0 || pose === 'empathetic';
  const haloStyle = useHaloPulse(hasBackdrop, reduceMotion);
  const motion = useRegiMotion(size, reaction, reactionKey, reduceMotion);
  const poses = usePoseCrossfade(pose, reduceMotion);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={regiAccessibilityLabel(pose, value)} style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, haloStyle]}>
        {hasBackdrop ? <RegiBackdrop pose={pose} glow={value} glowColor={glowColor} colors={colors} gradientId={gradientId} /> : null}
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.sparkle, { backgroundColor: glowColor, borderRadius: size / 2 }, motion.sparkle]} />
      <Animated.View style={[StyleSheet.absoluteFill, styles.feet, motion.body]}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.head, motion.gillLeft]}>
          <GillLayer colors={colors} side="left" />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, styles.head, motion.gillRight]}>
          <GillLayer colors={colors} side="right" />
        </Animated.View>
        {poses.previous ? (
          <Animated.View style={[StyleSheet.absoluteFill, poses.outgoing]}>
            <RegiFigure pose={poses.previous} colors={colors} idPrefix={`${gradientId}-prev`} />
          </Animated.View>
        ) : null}
        <Animated.View style={[StyleSheet.absoluteFill, poses.incoming]}>
          <RegiFigure pose={poses.current} colors={colors} idPrefix={gradientId} />
        </Animated.View>
        {poses.current === 'empathetic' ? null : (
          <Animated.View style={[StyleSheet.absoluteFill, styles.eyes, motion.eyes]}>
            <EyesLayer colors={colors} />
          </Animated.View>
        )}
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
  sparkle: { position: 'absolute', top: '12%', left: '12%', right: '12%', bottom: '12%' },
  feet: { transformOrigin: FEET_ORIGIN },
  head: { transformOrigin: HEAD_ORIGIN },
  eyes: { transformOrigin: EYES_ORIGIN },
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
