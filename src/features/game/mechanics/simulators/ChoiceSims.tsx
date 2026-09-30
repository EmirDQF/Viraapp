import { Check, Medal, Send } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import type { SimProps } from '@/features/game/mechanics/SimulatorMechanic';
import { haptic } from '@/lib/haptics';
import { MIN_TOUCH, feedback, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

const TASKS_TO_PICK = 3;
const MAX_CONTACTS = 2;

function Toggle({ label, detail, selected, onPress }: { readonly label: string; readonly detail?: string; readonly selected: boolean; readonly onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.toggle, { borderColor: selected ? colors.highlight : colors.border, backgroundColor: selected ? colors.surfaceAlt : colors.surface }]}
    >
      <View style={[styles.box, { borderColor: colors.highlight, backgroundColor: selected ? colors.highlight : 'transparent' }]}>
        {selected ? <Check color={colors.background} size={16} strokeWidth={3} /> : null}
      </View>
      <View style={styles.flex}>
        <AppText variant="bodyStrong">{label}</AppText>
        {detail ? <AppText variant="caption" tone="muted">{detail}</AppText> : null}
      </View>
    </Pressable>
  );
}

function toggleIn(list: readonly string[], item: string, max: number): readonly string[] {
  if (list.includes(item)) return list.filter((value) => value !== item);
  return list.length >= max ? list : [...list, item];
}

/** Hoy en Fácil: elegir 3 tareas y desglosarlas en micropasos. */
export function MicroStepsSim({ content, tone, onDone }: SimProps) {
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [split, setSplit] = useState(false);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };
  if (!split) {
    return (
      <View style={styles.root}>
        {content.options.map((option) => (
          <Toggle key={option.label} label={option.label} selected={picked.includes(option.label)} onPress={() => setPicked(toggleIn(picked, option.label, TASKS_TO_PICK))} />
        ))}
        <Button3D label={`Desglosar (${picked.length}/${TASKS_TO_PICK})`} tone={button} disabled={picked.length !== TASKS_TO_PICK} onPress={() => setSplit(true)} haptics="medium" />
      </View>
    );
  }
  return (
    <View style={styles.root}>
      {content.options
        .filter((option) => picked.includes(option.label))
        .map((option, index) => (
          <Animated.View key={option.label} entering={FadeIn.delay(index * 200)}>
            <Card>
              <AppText variant="subtitle">{option.label}</AppText>
              {option.detail.split('·').map((step) => (
                <AppText key={step} tone="muted">
                  • {step.trim()}
                </AppText>
              ))}
            </Card>
          </Animated.View>
        ))}
      <AppText variant="bodyStrong" align="center">
        {content.closing}
      </AppText>
      <Button3D label="Continuar" tone={button} onPress={onDone} />
    </View>
  );
}

/** Círculo Ancla: elegir 1 o 2 contactos y "enviar" (simulado) un mensaje de apoyo ya redactado. */
export function SupportSim({ content, tone, onDone }: SimProps) {
  const { colors } = useTheme();
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [message, setMessage] = useState(content.placeholder);
  const [sent, setSent] = useState(false);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };
  if (sent) {
    return (
      <Animated.View entering={ZoomIn} style={[styles.root, styles.center]}>
        <Send color={tone.base} size={42} />
        <AppText variant="heading" align="center">
          {content.closing}
        </AppText>
        <AppText tone="muted" align="center">
          En la vida real, lo puedes enviar desde “Apoyo Cercano” en la pestaña Mi.
        </AppText>
        <Button3D label="Continuar" tone={button} onPress={onDone} />
      </Animated.View>
    );
  }
  return (
    <View style={styles.root}>
      {content.options.map((option) => (
        <Toggle key={option.label} label={option.label} detail={option.detail} selected={picked.includes(option.label)} onPress={() => setPicked(toggleIn(picked, option.label, MAX_CONTACTS))} />
      ))}
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={280}
        accessibilityLabel="Mensaje para tu círculo"
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
      />
      <Button3D
        label="Enviar (simulación)"
        tone={button}
        disabled={picked.length === 0 || message.trim().length < 3}
        onPress={() => {
          haptic('success');
          setSent(true);
        }}
      />
    </View>
  );
}

/** Muro de Evidencia: registrar un logro pasado y convertirlo en medalla. */
export function EvidenceSim({ content, tone, onDone }: SimProps) {
  const { colors } = useTheme();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  const button = { face: tone.base, shadow: tone.deep, text: tone.on };
  if (saved) {
    return (
      <Animated.View entering={ZoomIn} style={[styles.root, styles.center]}>
        <View style={[styles.medal, { backgroundColor: tone.soft, borderColor: feedback.gold }]}>
          <Medal color={feedback.goldDeep} size={48} />
        </View>
        <AppText variant="heading" align="center">
          {saved}
        </AppText>
        <AppText tone="muted" align="center">
          {content.closing}
        </AppText>
        <Button3D label="Continuar" tone={button} onPress={onDone} />
      </Animated.View>
    );
  }
  return (
    <View style={styles.root}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={content.placeholder}
        placeholderTextColor={colors.textMuted}
        maxLength={80}
        accessibilityLabel="Logro que ya superaste"
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
      />
      <Button3D label="Guardar medalla" tone={button} disabled={text.trim().length < 3} onPress={() => setSaved(text.trim())} haptics="success" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.md },
  center: { alignItems: 'center' },
  flex: { flex: 1 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, minHeight: MIN_TOUCH + 8 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.semibold, fontSize: 16, minHeight: 54 },
  medal: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
});
