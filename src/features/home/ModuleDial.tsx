import { ChevronLeft, ChevronRight, Lock } from 'lucide-react-native';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { MODULES } from '@/data/modules/catalog';
import { angleFromPoint, indexForRotation, rotationForIndex, shortestDelta, snapRotation, wedgePath } from '@/features/home/dial';
import { haptic } from '@/lib/haptics';
import { MIN_TOUCH, MODULE_COLORS, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId, UnlockStatus } from '@/types/game';

const SPRING = { damping: 16, stiffness: 140 } as const;
const WEDGE_GAP_DEG = 1.2;
const STATUS_LABEL: Readonly<Record<UnlockStatus, string>> = {
  completed: 'completado',
  unlocked: 'disponible',
  locked: 'bloqueado',
};

interface ModuleDialProps {
  /** Módulos en el orden en que aparecen en la ruleta (en sentido horario desde arriba). */
  readonly modules: readonly ModuleId[];
  readonly selected: ModuleId;
  readonly statuses: Readonly<Record<ModuleId, UnlockStatus>>;
  readonly onSelect: (id: ModuleId) => void;
  readonly size?: number;
}

interface WedgeLabelProps {
  readonly id: ModuleId;
  readonly angle: number;
  readonly size: number;
  readonly midRadius: number;
  readonly locked: boolean;
}

const WedgeLabel = memo(function WedgeLabel({ id, angle, size, midRadius, locked }: WedgeLabelProps) {
  const tone = MODULE_COLORS[id];
  const width = midRadius * 0.95;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${angle}deg` }] }]}>
      <View style={[styles.label, { width, left: size / 2 - width / 2, top: size / 2 - midRadius - 34 }]}>
        {locked ? <Lock color={tone.on} size={20} /> : <ModuleIcon id={id} color={tone.on} size={26} />}
        <AppText variant="overline" color={tone.on} align="center" numberOfLines={2} style={styles.labelText}>
          {MODULES[id].name}
        </AppText>
      </View>
    </View>
  );
});

/** Ruleta "Mente Resiliente": gira con el dedo, encaja en el gajo y lo marca arriba. */
export function ModuleDial({ modules, selected, statuses, onSelect, size = 300 }: ModuleDialProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const count = modules.length;
  const segment = 360 / count;
  const center = size / 2;
  const outer = center - 10;
  const inner = outer * 0.26;
  const midRadius = (outer + inner) / 2;
  const selectedIndex = Math.max(0, modules.indexOf(selected));

  const rotation = useSharedValue(-selectedIndex * segment);
  const lastIndex = useSharedValue(selectedIndex);
  const prevAngle = useSharedValue(0);

  const selectIndex = useCallback((index: number) => onSelect(modules[index]), [modules, onSelect]);
  const tick = useCallback(() => haptic('selection'), []);

  useEffect(() => {
    const target = rotationForIndex(selectedIndex, rotation.get(), count);
    rotation.set(reduceMotion ? target : withSpring(target, SPRING));
    lastIndex.set(selectedIndex);
  }, [count, lastIndex, reduceMotion, rotation, selectedIndex]);

  // Se usa .get()/.set() en los shared values: es la API compatible con React Compiler.
  const gesture = useMemo(() => {
    const pan = Gesture.Pan()
      .onBegin((event) => {
        prevAngle.set(angleFromPoint(event.x, event.y, center, center));
      })
      .onUpdate((event) => {
        const angle = angleFromPoint(event.x, event.y, center, center);
        rotation.set(rotation.get() + shortestDelta(prevAngle.get(), angle));
        prevAngle.set(angle);
        const index = indexForRotation(rotation.get(), count);
        if (index !== lastIndex.get()) {
          lastIndex.set(index);
          scheduleOnRN(tick);
        }
      })
      .onEnd(() => {
        const snapped = snapRotation(rotation.get(), count);
        rotation.set(withSpring(snapped, SPRING));
        scheduleOnRN(selectIndex, indexForRotation(snapped, count));
      });
    const tap = Gesture.Tap().onEnd((event) => {
      const angle = angleFromPoint(event.x, event.y, center, center);
      scheduleOnRN(selectIndex, indexForRotation(rotation.get() - angle, count));
    });
    return Gesture.Race(pan, tap);
  }, [center, count, lastIndex, prevAngle, rotation, selectIndex, tick]);

  const wheelStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.get()}deg` }] }));

  const step = (delta: number) => {
    haptic('selection');
    selectIndex((selectedIndex + delta + count) % count);
  };
  const current = MODULES[modules[selectedIndex]];

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Módulo anterior"
        onPress={() => step(-1)}
        hitSlop={8}
        style={[styles.arrow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <ChevronLeft color={colors.text} size={22} />
      </Pressable>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Dial de módulos Mente Resiliente"
        accessibilityValue={{ text: `${current.name}, ${STATUS_LABEL[statuses[current.id]]}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => step(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
        style={{ width: size, height: size }}
      >
        <GestureDetector gesture={gesture}>
          <Animated.View style={[StyleSheet.absoluteFill, wheelStyle]}>
            <Svg width={size} height={size}>
              <Circle cx={center} cy={center} r={outer + 6} fill={colors.surfaceAlt} stroke={colors.border} strokeWidth={4} />
              {modules.map((id, index) => (
                <Path
                  key={id}
                  d={wedgePath(center, center, outer, inner, index * segment - segment / 2 + WEDGE_GAP_DEG, index * segment + segment / 2 - WEDGE_GAP_DEG)}
                  fill={MODULE_COLORS[id].base}
                  opacity={statuses[id] === 'locked' ? 0.55 : 1}
                />
              ))}
            </Svg>
            {modules.map((id, index) => (
              <WedgeLabel key={id} id={id} angle={index * segment} size={size} midRadius={midRadius} locked={statuses[id] === 'locked'} />
            ))}
          </Animated.View>
        </GestureDetector>
        <Svg width={size} height={size} pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Path
            d={wedgePath(center, center, outer + 2, inner - 2, -segment / 2, segment / 2)}
            fill="none"
            stroke={colors.onColor}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          <Path d={`M ${center - 12} 0 L ${center + 12} 0 L ${center} 16 Z`} fill={colors.accent} />
          <Circle cx={center} cy={center} r={inner - 6} fill={colors.surface} stroke={colors.border} strokeWidth={2} />
        </Svg>
        <View pointerEvents="none" style={[styles.hub, { top: center - 16, left: center - 16 }]}>
          <ModuleIcon id={current.id} color={MODULE_COLORS[current.id].base} size={32} />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Módulo siguiente"
        onPress={() => step(1)}
        hitSlop={8}
        style={[styles.arrow, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <ChevronRight color={colors.text} size={22} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  arrow: {
    width: MIN_TOUCH - 8,
    height: MIN_TOUCH,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { position: 'absolute', alignItems: 'center', gap: 2, height: 68, justifyContent: 'flex-start', paddingTop: 2 },
  labelText: { fontSize: 10, lineHeight: 12, letterSpacing: 0.6 },
  hub: { position: 'absolute', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
