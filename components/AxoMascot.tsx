import { Sparkles } from 'lucide-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { palette, radius, spacing, typography } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export type AxoMood = 'neutral' | 'celebrating' | 'thinking' | 'supportive';

const AXO = {
  body: '#F7A8C0',
  shade: '#E88AA8',
  belly: '#FCD9E3',
  gill: '#E0607E',
  cheek: '#F9739A',
  ink: '#1E293B',
  mouth: '#9F1239',
  heart: '#F43F5E',
  thought: '#CBD5E1',
} as const;

const MOOD_LABEL: Record<AxoMood, string> = {
  neutral: 'curioso y atento',
  celebrating: 'celebrando',
  thinking: 'pensativo',
  supportive: 'empático',
};

function Eyes({ mood }: { readonly mood: AxoMood }) {
  if (mood === 'celebrating') {
    return (
      <G stroke={AXO.ink} strokeWidth={4} strokeLinecap="round" fill="none">
        <Path d="M70 82 Q78 72 86 82" />
        <Path d="M114 82 Q122 72 130 82" />
      </G>
    );
  }
  if (mood === 'supportive') {
    return (
      <G stroke={AXO.ink} strokeWidth={4} strokeLinecap="round" fill="none">
        <Path d="M70 79 Q78 86 86 79" />
        <Path d="M114 79 Q122 86 130 79" />
      </G>
    );
  }
  const offset = mood === 'thinking' ? { x: 3, y: -4 } : { x: 0, y: 0 };
  return (
    <G>
      <Circle cx={78 + offset.x} cy={80 + offset.y} r={8} fill={AXO.ink} />
      <Circle cx={122 + offset.x} cy={80 + offset.y} r={8} fill={AXO.ink} />
      <Circle cx={81 + offset.x} cy={77 + offset.y} r={3} fill={palette.white} />
      <Circle cx={125 + offset.x} cy={77 + offset.y} r={3} fill={palette.white} />
    </G>
  );
}

function Mouth({ mood }: { readonly mood: AxoMood }) {
  switch (mood) {
    case 'celebrating':
      return (
        <G>
          <Path d="M86 99 Q100 122 114 99 Z" fill={AXO.mouth} />
          <Ellipse cx={100} cy={110} rx={6} ry={3.5} fill={AXO.heart} />
        </G>
      );
    case 'thinking':
      return <Path d="M94 106 Q101 103 109 104" stroke={AXO.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
    case 'supportive':
      return <Path d="M88 101 Q100 112 112 101" stroke={AXO.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
    case 'neutral':
      return <Path d="M91 102 Q100 109 109 102" stroke={AXO.ink} strokeWidth={3.5} strokeLinecap="round" fill="none" />;
  }
}

function Arms({ mood }: { readonly mood: AxoMood }) {
  switch (mood) {
    case 'celebrating':
      return (
        <G fill={AXO.shade}>
          <Ellipse cx={50} cy={116} rx={14} ry={8} transform="rotate(-45 50 116)" />
          <Ellipse cx={150} cy={116} rx={14} ry={8} transform="rotate(45 150 116)" />
        </G>
      );
    case 'thinking':
      return (
        <G fill={AXO.shade}>
          <Ellipse cx={60} cy={142} rx={13} ry={8} transform="rotate(25 60 142)" />
          <Ellipse cx={112} cy={117} rx={11} ry={8} transform="rotate(-20 112 117)" />
        </G>
      );
    case 'supportive':
      return (
        <G>
          <Path
            d="M100 150 C 86 138, 84 124, 94 122 C 98 121, 100 125, 100 127 C 100 125, 102 121, 106 122 C 116 124, 114 138, 100 150 Z"
            fill={AXO.heart}
          />
          <Ellipse cx={84} cy={136} rx={10} ry={7} fill={AXO.shade} />
          <Ellipse cx={116} cy={136} rx={10} ry={7} fill={AXO.shade} />
        </G>
      );
    case 'neutral':
      return (
        <G fill={AXO.shade}>
          <Ellipse cx={60} cy={142} rx={13} ry={8} transform="rotate(25 60 142)" />
          <Ellipse cx={140} cy={142} rx={13} ry={8} transform="rotate(-25 140 142)" />
        </G>
      );
  }
}

function AxoFigure({ mood }: { readonly mood: AxoMood }) {
  return (
    <Svg viewBox="0 0 200 200" width="100%" height="100%">
      <Path d="M132 150 Q176 146 188 118 Q176 154 136 166 Z" fill={AXO.shade} />
      <Ellipse cx={100} cy={146} rx={46} ry={35} fill={AXO.body} />
      <Ellipse cx={100} cy={153} rx={28} ry={22} fill={AXO.belly} />
      <Ellipse cx={76} cy={178} rx={11} ry={6} fill={AXO.shade} />
      <Ellipse cx={124} cy={178} rx={11} ry={6} fill={AXO.shade} />
      <G fill={AXO.gill}>
        <Ellipse cx={40} cy={55} rx={19} ry={7} transform="rotate(-35 40 55)" />
        <Ellipse cx={31} cy={76} rx={19} ry={7} transform="rotate(-5 31 76)" />
        <Ellipse cx={38} cy={97} rx={19} ry={7} transform="rotate(25 38 97)" />
        <Ellipse cx={160} cy={55} rx={19} ry={7} transform="rotate(35 160 55)" />
        <Ellipse cx={169} cy={76} rx={19} ry={7} transform="rotate(5 169 76)" />
        <Ellipse cx={162} cy={97} rx={19} ry={7} transform="rotate(-25 162 97)" />
      </G>
      <Ellipse cx={100} cy={80} rx={58} ry={48} fill={AXO.body} />
      {/* Grieta kintsugi: la cicatriz dorada de lo que se reconstruyó */}
      <Path d="M80 36 L87 48 L82 57 L91 66" stroke={palette.amber} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Ellipse cx={66} cy={96} rx={9} ry={5} fill={AXO.cheek} opacity={0.55} />
      <Ellipse cx={134} cy={96} rx={9} ry={5} fill={AXO.cheek} opacity={0.55} />
      <Eyes mood={mood} />
      <Mouth mood={mood} />
      <Arms mood={mood} />
      {mood === 'thinking' ? (
        <G fill={AXO.thought}>
          <Circle cx={152} cy={30} r={4} />
          <Circle cx={165} cy={19} r={6} />
          <Circle cx={182} cy={9} r={8} />
        </G>
      ) : null}
    </Svg>
  );
}

interface AxoMascotProps {
  readonly mood?: AxoMood;
  readonly size?: number;
}

export function AxoMascot({ mood = 'neutral', size = 160 }: AxoMascotProps) {
  const bob = useSharedValue(0);
  const tilt = useSharedValue(0);
  const sparkle = useSharedValue(0);
  const isCelebrating = mood === 'celebrating';

  useEffect(() => {
    const lift = isCelebrating ? -14 : -6;
    const duration = isCelebrating ? 320 : 1100;
    bob.value = withRepeat(
      withSequence(
        withTiming(lift, { duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
    tilt.value = isCelebrating
      ? withRepeat(withSequence(withTiming(-6, { duration: 220 }), withTiming(6, { duration: 220 })), -1, true)
      : withTiming(mood === 'thinking' ? -4 : 0, { duration: 300 });
    sparkle.value = isCelebrating ? withRepeat(withTiming(1, { duration: 700 }), -1, true) : withTiming(0);
    return () => {
      cancelAnimation(bob);
      cancelAnimation(tilt);
      cancelAnimation(sparkle);
    };
  }, [bob, tilt, sparkle, isCelebrating, mood]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }, { rotate: `${tilt.value}deg` }],
  }));
  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
    transform: [{ scale: 0.6 + sparkle.value * 0.5 }],
  }));

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Axo, el ajolote guía, ${MOOD_LABEL[mood]}`}
      style={{ width: size, height: size }}
    >
      <Animated.View style={[StyleSheet.absoluteFill, bodyStyle]}>
        <AxoFigure mood={mood} />
      </Animated.View>
      {isCelebrating ? (
        <>
          <Animated.View style={[styles.sparkle, { top: 0, left: 0 }, sparkleStyle]}>
            <Sparkles color={palette.amber} size={size * 0.2} />
          </Animated.View>
          <Animated.View style={[styles.sparkle, { top: size * 0.1, right: 0 }, sparkleStyle]}>
            <Sparkles color={palette.phoenix} size={size * 0.16} />
          </Animated.View>
          <Animated.View style={[styles.sparkle, { bottom: size * 0.15, left: size * 0.02 }, sparkleStyle]}>
            <Sparkles color={palette.victory} size={size * 0.14} />
          </Animated.View>
        </>
      ) : null}
    </View>
  );
}

interface AxoSaysProps {
  readonly mood?: AxoMood;
  readonly message: string;
  readonly size?: number;
}

export function AxoSays({ mood = 'neutral', message, size = 96 }: AxoSaysProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.saysRow}>
      <AxoMascot mood={mood} size={size} />
      <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.bubbleText, { color: colors.text }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sparkle: { position: 'absolute' },
  saysRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bubble: {
    flex: 1,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bubbleText: { ...typography.body },
});
