import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useReduceMotion } from '@/theme/useReduceMotion';

/** Colores de ilustración del cofre (constante de ilustración, como REGI y LOGO). */
const CHEST = {
  wood: '#B87444',
  woodLight: '#D8955E',
  woodDark: '#7A4A2A',
  band: '#F2C14E',
  bandDark: '#C8932A',
  glow: '#FFE08A',
  gem: '#7CC4E8',
  coin: '#FFD34D',
  shine: '#FFFFFF',
  shadow: '#3A2600',
} as const;

/** Resorte de la tapa: sube con un pequeño rebote. */
const LID_SPRING = { damping: 9, stiffness: 120, mass: 0.9 } as const;
const OPEN_DELAY_MS = 250;

interface TreasureChestProps {
  readonly open: boolean;
  readonly size?: number;
}

/** Cofre animado: la tapa se abre con un resorte y aparece un resplandor dorado con monedas y una gema. */
export function TreasureChest({ open, size = 180 }: TreasureChestProps) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = open ? 1 : 0;
    progress.set(reduceMotion ? target : withDelay(OPEN_DELAY_MS, withSpring(target, LID_SPRING)));
  }, [open, progress, reduceMotion]);

  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.get() * size * 0.16 }, { rotate: `${-progress.get() * 16}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.get()),
    transform: [{ scale: 0.6 + Math.min(1.1, progress.get()) * 0.5 }],
  }));

  const height = size * 0.8;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={open ? 'Cofre abierto con tu recompensa' : 'Cofre cerrado'}
      style={{ width: size, height }}
    >
      <Svg width={size} height={height} viewBox="0 0 160 128" style={StyleSheet.absoluteFill}>
        <Ellipse cx={80} cy={122} rx={62} ry={6} fill={CHEST.shadow} opacity={0.18} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <Svg width={size} height={height} viewBox="0 0 160 128">
          <Defs>
            <RadialGradient id="chestGlow" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={CHEST.glow} stopOpacity={0.95} />
              <Stop offset="0.6" stopColor={CHEST.glow} stopOpacity={0.35} />
              <Stop offset="1" stopColor={CHEST.glow} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={80} cy={56} r={62} fill="url(#chestGlow)" />
          <Circle cx={62} cy={54} r={7} fill={CHEST.coin} />
          <Circle cx={98} cy={50} r={6} fill={CHEST.coin} />
          <Path d="M80 38 L88 48 L80 58 L72 48 Z" fill={CHEST.gem} />
        </Svg>
      </Animated.View>
      <Svg width={size} height={height} viewBox="0 0 160 128" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="chestWood" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={CHEST.woodLight} />
            <Stop offset="1" stopColor={CHEST.wood} />
          </LinearGradient>
        </Defs>
        <Rect x={20} y={62} width={120} height={58} rx={10} fill="url(#chestWood)" />
        <Rect x={20} y={62} width={120} height={10} fill={CHEST.woodDark} />
        <Rect x={36} y={62} width={10} height={58} fill={CHEST.band} />
        <Rect x={114} y={62} width={10} height={58} fill={CHEST.band} />
        <Rect x={69} y={70} width={22} height={24} rx={5} fill={CHEST.bandDark} />
        <Circle cx={80} cy={80} r={3.5} fill={CHEST.woodDark} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, lidStyle]}>
        <Svg width={size} height={height} viewBox="0 0 160 128">
          <Path d="M18 64 C18 36 36 26 80 26 C124 26 142 36 142 64 Z" fill={CHEST.woodLight} />
          <Path d="M34 64 C34 38 40 30 44 29 L46 64 Z" fill={CHEST.band} />
          <Path d="M126 64 C126 38 120 30 116 29 L114 64 Z" fill={CHEST.band} />
          <Rect x={18} y={58} width={124} height={8} rx={3} fill={CHEST.woodDark} />
          <Path d="M40 36 C52 30 66 29 80 29" stroke={CHEST.shine} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
        </Svg>
      </Animated.View>
    </View>
  );
}
