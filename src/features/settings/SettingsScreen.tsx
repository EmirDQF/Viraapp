import { router } from 'expo-router';
import { ArrowLeft, Info, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Sheet } from '@/components/ui/Sheet';
import { goBackOrHome } from '@/features/game/navigation';
import { MenuRow } from '@/features/profile/MenuRow';
import { ChoiceGroup, SettingSection, SettingSwitch } from '@/features/settings/SettingControls';
import { cancelAllNotifications, notificationsSupported } from '@/lib/notifications';
import { requestPermission } from '@/lib/permissions';
import { REMINDER_HOURS, formatHour } from '@/lib/reminders';
import { useAppStore } from '@/store/useAppStore';
import type { DailyGoalMinutes, ThemePreference } from '@/store/types';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

const THEME_OPTIONS: readonly { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'Sistema' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
];
const GOAL_OPTIONS: readonly { value: DailyGoalMinutes; label: string }[] = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
];
const HOUR_OPTIONS = REMINDER_HOURS.map((hour) => ({ value: hour, label: formatHour(hour) }));

/** Pide permiso de notificaciones solo al activar un aviso; devuelve si se puede programar. */
function useNotificationToggle() {
  const setPermission = useAppStore((state) => state.setPermission);
  const [note, setNote] = useState<string | null>(null);
  const ensurePermission = async (): Promise<boolean> => {
    const result = await requestPermission('notifications');
    setPermission('notifications', result);
    setNote(result === 'granted' ? null : 'Sin permiso de notificaciones. Puedes activarlo en los ajustes del teléfono.');
    return result === 'granted';
  };
  return { note, ensurePermission };
}

function NotificationSettings() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const { note, ensurePermission } = useNotificationToggle();
  const reminder = settings.dailyReminder;

  const toggleReminder = async (enabled: boolean) => {
    if (enabled && !(await ensurePermission())) return;
    updateSettings({ dailyReminder: { ...reminder, enabled } });
  };
  const toggleStreak = async (enabled: boolean) => {
    if (enabled && !(await ensurePermission())) return;
    updateSettings({ streakRisk: enabled });
  };

  return (
    <SettingSection title="Notificaciones">
      {notificationsSupported ? null : (
        <AppText variant="caption" tone="muted">
          Las notificaciones funcionan en la app instalada en tu teléfono, no en la versión web.
        </AppText>
      )}
      <SettingSwitch label="Recordatorio diario" detail="Un aviso amable para practicar unos minutos." value={reminder.enabled} onChange={(value) => void toggleReminder(value)} disabled={!notificationsSupported} />
      {reminder.enabled ? (
        <ChoiceGroup label="Hora del recordatorio" options={HOUR_OPTIONS} value={reminder.hour} onChange={(hour) => updateSettings({ dailyReminder: { ...reminder, hour, minute: 0 } })} />
      ) : null}
      <SettingSwitch label="Racha en riesgo" detail="Aviso a las 20:00 si tienes racha y aún no practicaste." value={settings.streakRisk} onChange={(value) => void toggleStreak(value)} disabled={!notificationsSupported} />
      {note ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {note}
        </AppText>
      ) : null}
    </SettingSection>
  );
}

function DeleteDataSheet({ visible, onClose }: { readonly visible: boolean; readonly onClose: () => void }) {
  const resetAll = useAppStore((state) => state.resetAll);
  const confirm = async () => {
    await cancelAllNotifications();
    resetAll();
    onClose();
    router.replace('/onboarding');
  };
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title="¿Borrar todos tus datos?"
      footer={
        <View style={styles.sheetButtons}>
          <Button3D label="Sí, borrar todo" variant="danger" haptics="warning" onPress={() => void confirm()} />
          <Button3D label="Cancelar" variant="outline" onPress={onClose} />
        </View>
      }
    >
      <AppText>
        Se borran de este teléfono tu perfil, tu progreso, tu racha, tus impulsos, tu Muro de Evidencia, tus contactos de confianza y tus ajustes. No se puede deshacer.
      </AppText>
    </Sheet>
  );
}

/** Ajustes: apariencia, meta diaria, notificaciones, experiencia (sonido, vibración, movimiento) y privacidad. */
export function SettingsScreen() {
  const { colors } = useTheme();
  const settings = useAppStore((state) => state.settings);
  const dailyGoal = useAppStore((state) => state.dailyGoalMinutes);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const setDailyGoal = useAppStore((state) => state.setDailyGoal);
  const [deleting, setDeleting] = useState(false);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
              <ArrowLeft color={colors.text} size={24} />
            </Pressable>
            <AppText variant="title" accessibilityRole="header">
              Ajustes
            </AppText>
          </View>
          <SettingSection title="Apariencia">
            <ChoiceGroup label="Tema" options={THEME_OPTIONS} value={settings.theme} onChange={(theme) => updateSettings({ theme })} />
          </SettingSection>
          <SettingSection title="Tu meta">
            <ChoiceGroup label="Minutos de práctica al día" options={GOAL_OPTIONS} value={dailyGoal} onChange={setDailyGoal} />
          </SettingSection>
          <NotificationSettings />
          <SettingSection title="Experiencia">
            <SettingSwitch label="Sonidos" detail="Efectos al acertar y al completar etapas." value={settings.sounds} onChange={(sounds) => updateSettings({ sounds })} />
            <SettingSwitch label="Vibración" detail="Respuesta táctil al tocar y al acertar." value={settings.haptics} onChange={(haptics) => updateSettings({ haptics })} />
            <SettingSwitch label="Reducir movimiento" detail="Menos animaciones y transiciones más simples." value={settings.reduceMotion} onChange={(reduceMotion) => updateSettings({ reduceMotion })} />
          </SettingSection>
          <SettingSection title="Privacidad">
            <AppText tone="muted">Todo lo que haces en VIRA se guarda solo en este teléfono.</AppText>
            <Button3D label="Borrar mis datos" variant="outline" icon={<Trash2 color={colors.dangerText} size={18} />} onPress={() => setDeleting(true)} />
          </SettingSection>
          <MenuRow icon={Info} title="Sobre VIRA y ayuda profesional" onPress={() => router.push('/about')} />
        </ScrollView>
        <DeleteDataSheet visible={deleting} onClose={() => setDeleting(false)} />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  sheetButtons: { gap: spacing.sm },
});
