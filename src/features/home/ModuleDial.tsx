import { ChevronLeft, ChevronRight, Lock } from 'lucide-react-native';
import { memo, useCallback, useEffect, useId, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { MODULES } from '@/data/modules/catalog';
import { angleFromPoint, indexForRotation, rotationForIndex, shortestDelta, snapRotation, wedgePath } from '@/features/home/dial';
import { darken, lighten } from '@/lib/color';
import { haptic } from '@/lib/haptics';
import { brand, gradients, MIN_TOUCH, MODULE_COLORS, radius } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';
import type { ModuleId, UnlockStatus } from '@/types/game';

const SPRING = { damping: 16, stiffness: 140 } as const;
const WEDGE_GAP_DEG = 1.4;
/** Grosor del aro metálico y del brillo neón que lo rodea. */
const RIM = 12;
const NEON = 10;
/** Cuánto sobresale el gajo seleccionado ("se eleva"). */
const LIFT = 8;
const LOCKED_OPACITY = 0.45;
const ICON_TILE = 38;
const ARROW_WIDTH = MIN_TOUCH - 12;

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
  /** Color del nombre en gajos bloqueados: el gajo es translúcido, así que se usa el texto del tema. */
  readonly lockedText: string;
}

/** Ícono "3D" (squircle con degradado y brillo) y nombre del módulo, girados con su gajo. */
const WedgeLabel = memo(function WedgeLabel({ id, angle, size, midRadius, locked, lockedText }: WedgeLabelProps) {
  const tone = MODULE_COLORS[id];
  const width = midRadius * 0.95;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${angle}deg` }] }]}>
      <View
        style={[
          styles.label,
          { width, left: size / 2 - width / 2, top: size / 2 - midRadius - 36 },
        ]}
      >
        <IconTile color={tone.base} gradient={[lighten(tone.base, 0.45), tone.base, tone.deep]} size={ICON_TILE}>
          {locked ? (
            <Lock color={tone.on} size={18} strokeWidth={ICON_STROKE} />
          ) : (
            <ModuleIcon id={id} color={tone.on} size={20} strokeWidth={ICON_STROKE} />
          )}
        </IconTile>
        <AppText variant="overline" color={locked ? lockedText : tone.on} align="center" numberOfLines={2} style={styles.labelText}>
          {MODULES[id].name}
        </AppText>
      </View>
    </View>
  );
});

interface WheelArtProps {
  readonly modules: readonly ModuleId[];
  readonly statuses: Readonly<Record<ModuleId, UnlockStatus>>;
  readonly size: number;
  readonly outer: number;
  readonly inner: number;
  readonly idPrefix: string;
}

/** Gajos con degradado radial del color de su módulo (claro fuera, profundo hacia el centro). */
const WheelArt = memo(function WheelArt({ modules, statuses, size, outer, inner, idPrefix }: WheelArtProps) {
  const center = size / 2;
  const segment = 360 / modules.length;
  return (
    <Svg width={size} height={size}>
      <Defs>
        {modules.map((id) => {
          const tone = MODULE_COLORS[id];
          return (
            <RadialGradient key={id} id={`${idPrefix}-${id}`} cx={center} cy={center} r={outer} gradientUnits="userSpaceOnUse">
              {/* El nombre del módulo va sobre el gajo: ninguna parada puede bajar del contraste de `base`. */}
              <Stop offset={inner / outer} stopColor={tone.on === brand.ink ? tone.base : tone.deep} />
              <Stop offset="0.7" stopColor={tone.base} />
              <Stop offset="1" stopColor={tone.on === brand.ink ? lighten(tone.base, 0.25) : tone.base} />
            </RadialGradient>
          );
        })}
      </Defs>
      {modules.map((id, index) => (
        <Path
          key={id}
          d={wedgePath(
            center,
            center,
            outer,
            inner,
            index * segment - segment / 2 + WEDGE_GAP_DEG,
            index * segment + segment / 2 - WEDGE_GAP_DEG,
          )}
          fill={`url(#${idPrefix}-${id})`}
          opacity={statuses[id] === 'locked' ? LOCKED_OPACITY : 1}
        />
      ))}
    </Svg>
  );
});

interface RimProps {
  readonly size: number;
  readonly outer: number;
  readonly idPrefix: string;
  readonly isDark: boolean;
}

/** Aro metálico con brillo neón aurora (fijo: no gira con la ruleta). */
const Rim = memo(function Rim({ size, outer, idPrefix, isDark }: RimProps) {
  const center = size / 2;
  const metalTop = isDark ? lighten(brand.petrolNightAlt, 0.35) : brand.white;
  const metalMid = isDark ? brand.petrolNightSurface : brand.ivoryDeep;
  const metalBottom = isDark ? brand.petrolNight : darken(brand.ivoryDeep, 0.18);
  const neon = `url(#${idPrefix}-neon)`;
  return (
    <Svg width={size} height={size} pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={`${idPrefix}-metal`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={metalTop} />
          <Stop offset="0.5" stopColor={metalMid} />
          <Stop offset="1" stopColor={metalBottom} />
        </LinearGradient>
        <LinearGradient id={`${idPrefix}-neon`} x1="0" y1="0" x2="1" y2="1">
          {gradients.aurora.map((stop, index) => (
            <Stop key={stop} offset={index / (gradients.aurora.length - 1)} stopColor={stop} />
          ))}
        </LinearGradient>
      </Defs>
      <Circle
        cx={center}
        cy={center}
        r={outer + RIM / 2 + 2}
        stroke={neon}
        strokeWidth={RIM + NEON}
        strokeOpacity={isDark ? 0.35 : 0.22}
        fill="none"
      />
      <Circle cx={center} cy={center} r={outer + RIM / 2} stroke={`url(#${idPrefix}-metal)`} strokeWidth={RIM} fill="none" />
      <Circle cx={center} cy={center} r={outer + RIM - 1} stroke={neon} strokeWidth={1.5} strokeOpacity={0.9} fill="none" />
    </Svg>
  );
});

interface ArrowButtonProps {
  readonly direction: 'previous' | 'next';
  readonly onPress: () => void;
}

function ArrowButton({ direction, onPress }: ArrowButtonProps) {
  const { colors } = useTheme();
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={direction === 'previous' ? 'Módulo anterior' : 'Módulo siguiente'}
      haptics="selection"
      onPress={onPress}
      hitSlop={8}
    >
      <GlassCard padded={false} radius={radius.pill} style={styles.arrow}>
        <View style={styles.arrow}>
          <Icon color={colors.text} size={22} strokeWidth={2.5} />
        </View>
      </GlassCard>
    </AnimatedPressable>
  );
}

/** Ruleta "Mente Resiliente": gira con el dedo, encaja en el gajo y lo eleva con brillo bajo el indicador. */
export function ModuleDial({ modules, selected, statuses, onSelect, size = 300 }: ModuleDialProps) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const idPrefix = `dial-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const count = modules.length;
  const segment = 360 / count;
  const center = size / 2;
  const outer = center - RIM - NEON / 2 - 2;
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

  const step = (delta: number) => selectIndex((selectedIndex + delta + count) % count);
  const current = MODULES[modules[selectedIndex]];
  const tone = MODULE_COLORS[current.id];
  const liftedPath = wedgePath(center, center, outer + LIFT, inner - 2, -segment / 2 + 0.5, segment / 2 - 0.5);
  const pointerTop = NEON / 2 - 2;

  return (
    <View style={styles.row}>
      <ArrowButton direction="previous" onPress={() => step(-1)} />
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Dial de módulos Mente Resiliente"
        accessibilityValue={{ text: `${current.name}, ${STATUS_LABEL[statuses[current.id]]}` }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(event) => step(event.nativeEvent.actionName === 'increment' ? 1 : -1)}
        style={{ width: size, height: size }}
      >
        <Rim size={size} outer={outer} idPrefix={idPrefix} isDark={isDark} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[StyleSheet.absoluteFill, wheelStyle]}>
            <WheelArt modules={modules} statuses={statuses} size={size} outer={outer} inner={inner} idPrefix={idPrefix} />
            {modules.map((id, index) => (
              <WedgeLabel key={id} id={id} angle={index * segment} size={size} midRadius={midRadius} locked={statuses[id] === 'locked'} lockedText={colors.text} />
            ))}
          </Animated.View>
        </GestureDetector>
        <Svg width={size} height={size} pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Path d={liftedPath} fill="none" stroke={tone.base} strokeOpacity={0.35} strokeWidth={12} strokeLinejoin="round" />
          <Path d={liftedPath} fill="none" stroke={lighten(tone.base, 0.5)} strokeWidth={3.5} strokeLinejoin="round" />
          <Path
            d={`M ${center - 14} ${pointerTop} L ${center + 14} ${pointerTop} L ${center} ${pointerTop + 18} Z`}
            fill={lighten(tone.base, 0.35)}
            stroke={colors.surface}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Circle cx={center} cy={center} r={inner - 4} fill={colors.surface} stroke={colors.glassBorder} strokeWidth={2} />
          <Circle cx={center} cy={center} r={inner - 10} fill={tone.base} opacity={0.14} />
        </Svg>
        <View pointerEvents="none" style={[styles.hub, { top: center - 16, left: center - 16 }]}>
          <ModuleIcon id={current.id} color={isDark ? lighten(tone.base, 0.3) : tone.deep} size={30} strokeWidth={ICON_STROKE} />
        </View>
      </View>
      <ArrowButton direction="next" onPress={() => step(1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  arrow: { width: ARROW_WIDTH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  label: { position: 'absolute', alignItems: 'center', gap: 3, height: 76, justifyContent: 'flex-start' },
  labelText: { fontSize: 9.5, lineHeight: 11, letterSpacing: 0.5 },
  hub: { position: 'absolute', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
