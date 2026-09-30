import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

/** Colores de ilustración del cofre (constante de ilustración, como REGI y LOGO). */
const CHEST = {
  wood: '#A0643B',
  woodDark: '#7A4A2A',
  band: '#E3B341',
  lock: '#B8860B',
  glow: '#FFE9A8',
  gem: '#7CC4E8',
} as const;

interface TreasureChestProps {
  readonly open: boolean;
  readonly size?: number;
}

/** Cofre animado: la tapa se levanta y aparece un brillo dorado suave. */
export function TreasureChest({ open, size = 180 }: TreasureChestProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    const target = open ? 1 : 0;
    progress.set(reduceMotion ? target : withDelay(250, withTiming(target, { duration: 700, easing: Easing.out(Easing.back(1.6)) })));
  }, [open, progress, reduceMotion]);

  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -progress.get() * size * 0.16 }, { rotate: `${-progress.get() * 16}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: progress.get(), transform: [{ scale: 0.6 + progress.get() * 0.5 }] }));

  const height = size * 0.8;
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={open ? 'Cofre abierto con tu recompensa' : 'Cofre cerrado'} style={{ width: size, height }}>
      <Animated.View style={[StyleSheet.absoluteFill, glowStyle]}>
        <Svg width={size} height={height} viewBox="0 0 160 128">
          <Circle cx={80} cy={58} r={56} fill={CHEST.glow} opacity={0.55} />
          <Circle cx={62} cy={52} r={6} fill={CHEST.gem} />
          <Circle cx={96} cy={48} r={5} fill={CHEST.band} />
        </Svg>
      </Animated.View>
      <Svg width={size} height={height} viewBox="0 0 160 128" style={StyleSheet.absoluteFill}>
        <Rect x={20} y={62} width={120} height={58} rx={8} fill={CHEST.wood} />
        <Rect x={20} y={62} width={120} height={10} fill={CHEST.woodDark} />
        <Rect x={36} y={62} width={10} height={58} fill={CHEST.band} />
        <Rect x={114} y={62} width={10} height={58} fill={CHEST.band} />
        <Rect x={70} y={70} width={20} height={22} rx={4} fill={CHEST.lock} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, lidStyle]}>
        <Svg width={size} height={height} viewBox="0 0 160 128">
          <Path d="M18 64 C18 36 36 26 80 26 C124 26 142 36 142 64 Z" fill={CHEST.wood} />
          <Path d="M34 64 C34 38 40 30 44 29 L46 64 Z" fill={CHEST.band} />
          <Path d="M126 64 C126 38 120 30 116 29 L114 64 Z" fill={CHEST.band} />
          <Rect x={18} y={58} width={124} height={8} rx={3} fill={CHEST.woodDark} />
        </Svg>
      </Animated.View>
    </View>
  );
}
