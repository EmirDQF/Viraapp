import { Check, Lock } from 'lucide-react-native';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { MechanicIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { MODULE_COLORS, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId, StageDef, UnlockStatus } from '@/types/game';

const NODE = 66;
const LIP = 6;

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
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1100 }), -1, true);
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);
  const style = useAnimatedStyle(() => ({ opacity: 0.35 + pulse.value * 0.45, transform: [{ scale: 1 + pulse.value * 0.08 }] }));
  return <Animated.View pointerEvents="none" style={[styles.ring, { borderColor: tone.base }, style]} />;
}

/** Nodo del camino tipo Duolingo: un círculo 3D por etapa, con candado, check o estado actual. */
export const StageNode = memo(function StageNode({ moduleId, stage, status, isCurrent, offset, onPress }: StageNodeProps) {
  const { colors } = useTheme();
  const tone = MODULE_COLORS[moduleId];
  const locked = status === 'locked';
  const face = locked ? colors.disabled : tone.base;
  const lip = locked ? colors.disabledShadow : tone.deep;
  const iconColor = locked ? colors.textMuted : tone.on;

  return (
    <View style={[styles.wrap, { transform: [{ translateX: offset }] }]}>
      {isCurrent ? <PulseRing tone={tone} /> : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Etapa ${stage.index + 1}: ${stage.title}, ${STATUS_LABEL[status]}`}
        accessibilityState={{ disabled: locked }}
        onPress={() => onPress(stage.index)}
        style={({ pressed }) => [
          styles.node,
          { backgroundColor: face, borderBottomColor: lip },
          pressed && !locked && styles.pressed,
        ]}
      >
        {status === 'completed' ? (
          <Check color={iconColor} size={30} strokeWidth={3} />
        ) : locked ? (
          <Lock color={iconColor} size={24} />
        ) : (
          <MechanicIcon kind={stage.kind} color={iconColor} size={28} />
        )}
      </Pressable>
      {isCurrent ? (
        <View style={[styles.flag, { backgroundColor: colors.surface, borderColor: tone.base }]}>
          <AppText variant="overline" color={colors.text}>
            Empieza aquí
          </AppText>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: NODE + 24, height: NODE + 24 },
  ring: { position: 'absolute', width: NODE + 18, height: NODE + 18, borderRadius: NODE, borderWidth: 4 },
  node: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    borderBottomWidth: LIP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { transform: [{ translateY: LIP - 2 }], borderBottomWidth: 2 },
  flag: {
    position: 'absolute',
    top: -14,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1.5,
  },
});
