import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { goBackOrHome } from '@/features/game/navigation';
import { haptic } from '@/lib/haptics';
import { DEFAULT_TIMER, IMPULSE_PRESETS, IMPULSE_TITLE_MAX, TIMER_OPTIONS, createImpulse } from '@/lib/impulses';
import { notificationsSupported, scheduleImpulseEnd } from '@/lib/notifications';
import { requestPermission } from '@/lib/permissions';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

const TONE = MODULE_COLORS.enfriador;

/** Anotar un impulso con un temporizador personalizado; al vencer llega "¿Aún lo necesitas?". */
export function NewImpulseScreen() {
  const { colors } = useTheme();
  const addImpulse = useAppStore((state) => state.addImpulse);
  const setImpulseNotification = useAppStore((state) => state.setImpulseNotification);
  const notificationsPermission = useAppStore((state) => state.onboarding.permissions.notifications);
  const setPermission = useAppStore((state) => state.setPermission);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(DEFAULT_TIMER);
  const valid = title.trim().length >= 3;

  const save = async () => {
    if (!valid) return;
    const impulse = createImpulse(`imp-${Date.now().toString(36)}`, title, minutes);
    addImpulse(impulse);
    haptic('success');
    router.replace('/impulses');
    if (!notificationsSupported) return;
    // El permiso se pide solo si hace falta y en este momento (cuando la persona pide el aviso).
    let permission = notificationsPermission;
    if (permission !== 'granted') {
      permission = await requestPermission('notifications');
      setPermission('notifications', permission);
    }
    if (permission === 'granted') setImpulseNotification(impulse.id, await scheduleImpulseEnd(impulse));
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar" onPress={goBackOrHome} hitSlop={10} style={styles.close}>
            <X color={colors.textMuted} size={26} />
          </Pressable>
          <AppText variant="heading" accessibilityRole="header">
            Nuevo impulso
          </AppText>
        </View>
        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <RegiSays pose="calm" message="Un impulso no es una necesidad. Anótalo y date unos minutos antes de decidir." />
          <View style={styles.chips}>
            {IMPULSE_PRESETS.map((preset) => (
              <Pressable
                key={preset.title}
                accessibilityRole="button"
                accessibilityLabel={`Usar: ${preset.title}`}
                accessibilityState={{ selected: title === preset.title }}
                onPress={() => setTitle(preset.title)}
                style={[styles.chip, { borderColor: title === preset.title ? TONE.base : colors.border, backgroundColor: title === preset.title ? TONE.soft : colors.surface }]}
              >
                <AppText variant="caption">{preset.title}</AppText>
              </Pressable>
            ))}
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="¿Qué quieres hacer ahora mismo?"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Impulso"
            maxLength={IMPULSE_TITLE_MAX}
            style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          />
          <AppText variant="subtitle">¿Cuánto quieres esperar?</AppText>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {TIMER_OPTIONS.map((option) => (
              <Pressable
                key={option}
                accessibilityRole="radio"
                accessibilityState={{ checked: minutes === option }}
                aria-checked={minutes === option}
                accessibilityLabel={`${option} minutos`}
                onPress={() => setMinutes(option)}
                style={[styles.timer, { backgroundColor: minutes === option ? TONE.base : colors.surface, borderColor: minutes === option ? TONE.base : colors.border }]}
              >
                <AppText variant="bodyStrong" color={minutes === option ? TONE.on : colors.text}>
                  {option} min
                </AppText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button3D label={`Esperar ${minutes} minutos`} disabled={!valid} tone={{ face: TONE.base, shadow: TONE.deep, text: TONE.on }} onPress={() => void save()} />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH, justifyContent: 'center' },
  input: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.semibold, fontSize: 16, minHeight: 54 },
  timer: { borderWidth: 2, borderRadius: radius.lg, paddingHorizontal: spacing.lg, minHeight: MIN_TOUCH, justifyContent: 'center' },
  footer: { padding: spacing.lg },
});
