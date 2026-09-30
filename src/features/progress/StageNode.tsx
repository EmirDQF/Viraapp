import { LinearGradient } from 'expo-linear-gradient';
import { Check, Lock } from 'lucide-react-native';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MechanicIcon } from '@/components/game/ModuleIcon';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { lighten, withAlpha } from '@/lib/color';
import { brand, MODULE_COLORS, radius, spacing, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';
import type { ModuleId, StageDef, UnlockStatus } from '@/types/game';

const NODE = 68;
const LIP = 6;
const PULSE_MS = 1100;
const GLOSS_ALPHA = 0.4;
const REGI_SIZE = 64;
/** Separación entre el nodo actual y Regi, que se coloca del lado contrario al zigzag. */
const REGI_GAP = 10;

const STATUS_LABEL: Readonly<Record<UnlockStatus, string>> = {
  completed: 'completada',
  unlocked: 'disponible',
  locked: 'bloqueada',
};

interface StageNodeProps {
  readonly moduleId: ModuleId;
  readonly stage: StageDef;
  readonly status: UnlockStatus;
  readonly isCurrent: boolean;
  readonly offset: number;
  readonly onPress: (stage: number) => void;
}

function PulseRing({ tone }: { readonly tone: ModuleTone }) {
  const reduceMotion = useReduceMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.set(withRepeat(withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.sin) }), -1, true));
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.get() * 0.45,
    transform: [{ scale: 1 + pulse.get() * 0.1 }],
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.ring, { borderColor: tone.base, backgroundColor: withAlpha(tone.base, 0.12) }, style]}
    />
  );
}

/**
 * Nodo del camino tipo Duolingo: esfera 3D (degradado del módulo, brillo y labio inferior) con candado, check
 * o el ícono de la mecánica. El nodo actual pulsa y Regi lo acompaña.
 */
export const StageNode = memo(function StageNode({ moduleId, stage, status, isCurrent, offset, onPress }: StageNodeProps) {
  const { colors } = useTheme();
  const tone = MODULE_COLORS[moduleId];
  const locked = status === 'locked';
  const lip = locked ? colors.disabledShadow : tone.deep;
  const iconColor = locked ? colors.textMuted : tone.on;
  const regiSide = offset > 0 ? styles.regiLeft : styles.regiRight;

  return (
    <View style={[styles.wrap, { transform: [{ translateX: offset }] }]}>
      {isCurrent ? <PulseRing tone={tone} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Etapa ${stage.index + 1}: ${stage.title}, ${STATUS_LABEL[status]}${isCurrent ? ', siguiente' : ''}`}
        accessibilityState={{ disabled: locked }}
        onPress={() => onPress(stage.index)}
        style={({ pressed }) => [
          styles.node,
          { backgroundColor: locked ? colors.disabled : tone.base, borderBottomColor: lip },
          pressed && !locked && styles.pressed,
        ]}
      >
        {locked ? null : (
          <LinearGradient
            colors={[lighten(tone.base, 0.25), tone.base]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.round]}
          />
        )}
        <View style={[styles.gloss, { backgroundColor: withAlpha(brand.white, locked ? 0.2 : GLOSS_ALPHA) }]} />
        {/* En web, lo posicionado (degradado) se pinta sobre lo estático: el ícono va en su propia capa. */}
        <View style={styles.icon}>
          {status === 'completed' ? (
            <Check color={iconColor} size={30} strokeWidth={3.2} />
          ) : locked ? (
            <Lock color={iconColor} size={24} strokeWidth={ICON_STROKE} />
          ) : (
            <MechanicIcon kind={stage.kind} color={iconColor} size={28} strokeWidth={ICON_STROKE} />
          )}
        </View>
      </Pressable>
      {isCurrent ? (
        <>
          <View pointerEvents="none" style={styles.flagSlot}>
            <View style={[styles.flag, { backgroundColor: tone.base, borderColor: tone.deep }]}>
              <AppText variant="overline" color={tone.on} uppercase numberOfLines={1}>
                Empieza aquí
              </AppText>
            </View>
          </View>
          <View pointerEvents="none" style={[styles.regi, regiSide]}>
            <RegiMascot pose="growth" size={REGI_SIZE} />
          </View>
        </>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: NODE + 24, height: NODE + 28 },
  ring: { position: 'absolute', width: NODE + 20, height: NODE + 20, borderRadius: NODE, borderWidth: 4 },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderBottomWidth: LIP,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  round: { borderRadius: NODE / 2 },
  gloss: {
    position: 'absolute',
    top: 6,
    left: NODE * 0.22,
    width: NODE * 0.5,
    height: NODE * 0.2,
    borderRadius: radius.pill,
  },
  pressed: { transform: [{ translateY: LIP - 2 }], borderBottomWidth: 2 },
  icon: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  flagSlot: { position: 'absolute', top: -18, left: -60, right: -60, alignItems: 'center' },
  flag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  regi: { position: 'absolute', top: (NODE + 28 - REGI_SIZE) / 2 },
  regiLeft: { right: NODE + 24 + REGI_GAP },
  regiRight: { left: NODE + 24 + REGI_GAP },
});
