import { Pause, Play, SkipForward } from 'lucide-react-native';
import { useEffect, useReducer, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ProgressBar } from '@/components/ProgressBar';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { breathPhase, TECHNIQUES, type TechniqueId, type TechniqueStep } from '@/data/techniques';
import { haptic } from '@/lib/haptics';
import { MIN_TOUCH, brand, radius, spacing } from '@/theme/tokens';
import { useReduceMotion } from '@/theme/useReduceMotion';
import { useTheme } from '@/theme/useTheme';

const TICK_MS = 1000;
const CIRCLE = 200;
const SCALE_IN = 1;
const SCALE_OUT = 0.6;

interface TechniqueRunnerProps {
  readonly technique: TechniqueId;
  readonly onDone: () => void;
}

interface TimerState {
  readonly index: number;
  readonly left: number;
  readonly finished: boolean;
}

type TimerAction = { readonly type: 'tick' } | { readonly type: 'skip' };

/** Reductor puro del temporizador: resta un segundo o salta de paso; al pasar el último, termina. */
function timerReducer(steps: readonly TechniqueStep[]) {
  return (state: TimerState, action: TimerAction): TimerState => {
    if (state.finished) return state;
    if (action.type === 'tick' && state.left > 1) return { ...state, left: state.left - 1 };
    const index = state.index + 1;
    return index >= steps.length ? { ...state, left: 0, finished: true } : { index, left: steps[index].seconds, finished: false };
  };
}

/** Cuenta atrás por paso; al llegar a 0 pasa al siguiente con una vibración suave y al final avisa con `onDone`. */
function useStepTimer(technique: TechniqueId, onDone: () => void) {
  const steps = TECHNIQUES[technique].steps;
  const [state, dispatch] = useReducer(timerReducer(steps), { index: 0, left: steps[0].seconds, finished: false });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || state.finished) return;
    const timer = setInterval(() => dispatch({ type: 'tick' }), TICK_MS);
    return () => clearInterval(timer);
  }, [paused, state.finished]);

  useEffect(() => {
    if (state.index > 0) haptic('light');
  }, [state.index]);

  // Una sola vez aunque el padre se vuelva a renderizar con otro onDone.
  const notified = useRef(false);
  useEffect(() => {
    if (!state.finished || notified.current) return;
    notified.current = true;
    haptic('success');
    onDone();
  }, [onDone, state.finished]);

  return { steps, index: state.index, left: state.left, paused, setPaused, next: () => dispatch({ type: 'skip' }) };
}

/** Círculo que crece al inhalar, se queda al sostener y se encoge al exhalar. Quieto con movimiento reducido. */
function BreathCircle({ text, seconds }: { readonly text: string; readonly seconds: number }) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(0.8);
  const phase = breathPhase(text);
  useEffect(() => {
    if (reduceMotion || phase === null || phase === 'hold') return;
    scale.value = withTiming(phase === 'in' ? SCALE_IN : SCALE_OUT, { duration: seconds * 1000, easing: Easing.inOut(Easing.sin) });
  }, [phase, reduceMotion, scale, seconds, text]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={[styles.circle, { backgroundColor: brand.sage }, style]} />;
}

/** Técnica guiada a pantalla completa: un paso a la vez, con temporizador, vibración y controles. */
export function TechniqueRunner({ technique, onDone }: TechniqueRunnerProps) {
  const { colors } = useTheme();
  const { steps, index, left, paused, setPaused, next } = useStepTimer(technique, onDone);
  const step = steps[index];
  const PauseIcon = paused ? Play : Pause;
  return (
    <View style={styles.root}>
      <AppText variant="title" align="center" accessibilityRole="header">
        {TECHNIQUES[technique].name}
      </AppText>
      <ProgressBar value={(index + 1) / steps.length} color={colors.highlight} height={8} />
      <View style={styles.center}>
        <BreathCircle key={index} text={step.text} seconds={step.seconds} />
        <AppText variant="display" align="center" style={styles.count} accessibilityLabel={`${left} segundos`}>
          {left}
        </AppText>
      </View>
      <AppText variant="heading" align="center" accessibilityLiveRegion="polite">
        {step.text}
      </AppText>
      <View style={styles.controls}>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={paused ? 'Reanudar' : 'Pausar'}
          onPress={() => setPaused(!paused)}
          style={[styles.control, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <PauseIcon color={colors.text} size={22} />
        </AnimatedPressable>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel="Siguiente paso"
          onPress={next}
          style={[styles.control, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <SkipForward color={colors.text} size={22} />
        </AnimatedPressable>
      </View>
      <Button3D label="Ya terminé" variant="outline" onPress={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.lg, justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center', height: CIRCLE },
  circle: { position: 'absolute', width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2, opacity: 0.45 },
  count: { fontVariant: ['tabular-nums'] },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: spacing.md },
  control: { width: MIN_TOUCH + 12, height: MIN_TOUCH + 12, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
