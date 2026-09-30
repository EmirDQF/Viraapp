import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ProgressRing } from '@/components/ui/ProgressRing';
import type { SimProps } from '@/features/game/mechanics/SimulatorMechanic';
import { haptic } from '@/lib/haptics';
import { radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

/** En el simulador, 20 minutos reales se representan con 20 segundos. */
const IMPULSE_SECONDS = 20;
const PAUSE_SECONDS = 10;
const BREATH_MS = 2500;

function useCountdown(seconds: number, running: boolean): number {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return remaining;
}

function Field({ value, onChange, placeholder, label }: { readonly value: string; readonly onChange: (v: string) => void; readonly placeholder: string; readonly label: string }) {
  const { colors } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={label}
      maxLength={120}
      style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
    />
  );
}

/** Enfriador: anotar el impulso, esperar "20 minutos" y responder "¿Aún lo necesitas?". */
export function ImpulseTimerSim({ content, tone, onDone }: SimProps) {
  const [impulse, setImpulse] = useState('');
  const [running, setRunning] = useState(false);
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const remaining = useCountdown(IMPULSE_SECONDS, running);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };
  const minutesLeft = Math.ceil((remaining / IMPULSE_SECONDS) * 20);

  if (!running) {
    return (
      <View style={styles.root}>
        <Field value={impulse} onChange={setImpulse} placeholder={content.placeholder} label="Impulso que quieres anotar" />
        <Button3D label="Anotar y esperar 20:00" tone={button} disabled={impulse.trim().length < 3} onPress={() => setRunning(true)} />
      </View>
    );
  }
  if (remaining > 0) {
    return (
      <View style={[styles.root, styles.center]}>
        <AppText variant="bodyStrong" align="center">
          {impulse}
        </AppText>
        <ProgressRing value={remaining / IMPULSE_SECONDS} size={170} color={tone.base} accessibilityLabel={`Faltan ${minutesLeft} minutos simulados`}>
          <AppText variant="title">{String(minutesLeft).padStart(2, '0')}:00</AppText>
          <AppText variant="caption" tone="muted">
            de 20:00
          </AppText>
        </ProgressRing>
        <AppText tone="muted" align="center">
          Respira. En el juego, cada segundo cuenta como un minuto.
        </AppText>
      </View>
    );
  }
  return (
    <Animated.View entering={FadeIn} style={[styles.root, styles.center]}>
      <AppText variant="heading" align="center">
        ¿Aún lo necesitas?
      </AppText>
      {answer === null ? (
        <View style={styles.row}>
          <View style={styles.flex}>
            <Button3D label="Sí" variant="outline" onPress={() => setAnswer('yes')} />
          </View>
          <View style={styles.flex}>
            <Button3D label="No" tone={button} onPress={() => setAnswer('no')} haptics="success" />
          </View>
        </View>
      ) : (
        <>
          <AppText tone="muted" align="center">
            {answer === 'no' ? content.closing : 'Perfecto: ahora decides con la cabeza fría, revisando si es necesidad y tu presupuesto.'}
          </AppText>
          <Button3D label="Continuar" tone={button} onPress={onDone} />
        </>
      )}
    </Animated.View>
  );
}

/** Freno de Mano: escribir cómo te sientes y hacer una pausa guiada de 10 segundos. */
export function PauseBreathSim({ content, tone, onDone }: SimProps) {
  const reduceMotion = useReducedMotion();
  const [feeling, setFeeling] = useState('');
  const [running, setRunning] = useState(false);
  const remaining = useCountdown(PAUSE_SECONDS, running);
  const scale = useSharedValue(0.7);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };

  useEffect(() => {
    if (!running || reduceMotion) return;
    scale.set(withRepeat(withTiming(1, { duration: BREATH_MS, easing: Easing.inOut(Easing.sin) }), -1, true));
    return () => cancelAnimation(scale);
  }, [reduceMotion, running, scale]);

  useEffect(() => {
    if (running && remaining === 0) haptic('success');
  }, [remaining, running]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  if (!running) {
    return (
      <View style={styles.root}>
        <Field value={feeling} onChange={setFeeling} placeholder={content.placeholder} label="Cómo te sientes" />
        <Button3D label="Activar freno de mano" tone={button} disabled={feeling.trim().length < 3} onPress={() => setRunning(true)} />
      </View>
    );
  }
  return (
    <View style={[styles.root, styles.center]}>
      <View style={styles.breathBox} accessible accessibilityLabel={remaining > 0 ? `Respira. Quedan ${remaining} segundos` : 'Pausa completada'}>
        <Animated.View style={[styles.breath, { backgroundColor: tone.base }, circle]} />
        <AppText variant="title" color={tone.on} style={styles.breathText}>
          {remaining > 0 ? remaining : '✓'}
        </AppText>
      </View>
      <AppText variant="bodyStrong" align="center">
        {remaining > 0 ? 'Inhala… exhala… La pantalla está en pausa.' : content.closing}
      </AppText>
      {remaining === 0 ? <Button3D label="Continuar" tone={button} onPress={onDone} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: spacing.md, alignSelf: 'stretch' },
  flex: { flex: 1 },
  input: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.semibold, fontSize: 16, minHeight: 54 },
  breathBox: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
  breath: { position: 'absolute', width: 200, height: 200, borderRadius: 100, opacity: 0.9 },
  breathText: { fontSize: 44, lineHeight: 52 },
});
