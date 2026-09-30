/**
 * Notificaciones locales (siempre opcionales): recordatorio diario, racha en riesgo, fin del temporizador de
 * impulsos y pantalla ancla. En web no existen: todas las funciones devuelven null sin romper nada.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Impulse } from '@/lib/impulses';

export const IMPULSE_CATEGORY = 'impulse';
export const ACTION_STILL_NEED = 'impulse-yes';
export const ACTION_NOT_NEEDED = 'impulse-no';
const CHANNEL_ID = 'vira';
const DAILY_ID = 'vira-daily-reminder';
const STREAK_ID = 'vira-streak-risk';
const STREAK_HOUR = 20;

export type NotificationKind = 'impulse' | 'daily' | 'streak' | 'anchor';

export const notificationsSupported = Platform.OS !== 'web';

async function safely<T>(run: () => Promise<T>): Promise<T | null> {
  if (!notificationsSupported) return null;
  try {
    return await run();
  } catch {
    return null;
  }
}

/** Configuración inicial: cómo se muestran, canal de Android y botones "Sí / No" del impulso. */
export async function configureNotifications(): Promise<void> {
  await safely(async () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, { name: 'VIRA', importance: Notifications.AndroidImportance.DEFAULT });
    }
    await Notifications.setNotificationCategoryAsync(IMPULSE_CATEGORY, [
      { identifier: ACTION_STILL_NEED, buttonTitle: 'Sí, aún lo necesito' },
      { identifier: ACTION_NOT_NEEDED, buttonTitle: 'No, ya pasó' },
    ]);
  });
}

export async function scheduleImpulseEnd(impulse: Impulse): Promise<string | null> {
  return safely(() =>
    Notifications.scheduleNotificationAsync({
      content: {
        title: '¿Aún lo necesitas?',
        body: `Pasaron ${impulse.minutes} minutos: "${impulse.title}". Decide con calma.`,
        categoryIdentifier: IMPULSE_CATEGORY,
        data: { kind: 'impulse', impulseId: impulse.id },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(impulse.endsAt), channelId: CHANNEL_ID },
    }),
  );
}

export async function cancelNotification(id: string | null): Promise<void> {
  if (!id) return;
  await safely(() => Notifications.cancelScheduledNotificationAsync(id));
}

/** Recordatorio diario a la hora elegida (reemplaza el anterior). */
export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  await cancelNotification(DAILY_ID);
  return safely(() =>
    Notifications.scheduleNotificationAsync({
      identifier: DAILY_ID,
      content: { title: 'Regi te espera', body: 'Unos minutos hoy también cuentan. ¿Seguimos?', data: { kind: 'daily' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: CHANNEL_ID },
    }),
  );
}

export async function cancelDailyReminder(): Promise<void> {
  await cancelNotification(DAILY_ID);
}

/** Aviso de racha en riesgo hoy a las 20:00 si aún no practicaste (se cancela al practicar). */
export async function scheduleStreakRisk(now: Date = new Date()): Promise<string | null> {
  await cancelNotification(STREAK_ID);
  const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), STREAK_HOUR, 0, 0);
  if (at.getTime() <= now.getTime()) return null;
  return safely(() =>
    Notifications.scheduleNotificationAsync({
      identifier: STREAK_ID,
      content: { title: 'Tu racha te extraña', body: 'Una etapa corta mantiene tu racha. Sin presión.', data: { kind: 'streak' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL_ID },
    }),
  );
}

export async function cancelStreakRisk(): Promise<void> {
  await cancelNotification(STREAK_ID);
}

/** Pantalla ancla: una invitación a mirar tu foto feliz dentro de unos minutos. */
export async function scheduleAnchorNudge(minutes: number): Promise<string | null> {
  return safely(() =>
    Notifications.scheduleNotificationAsync({
      content: { title: '¿Qué momento feliz te ancla hoy?', body: 'Tómate 10 segundos con tu foto.', data: { kind: 'anchor' } },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: Math.max(60, minutes * 60), channelId: CHANNEL_ID },
    }),
  );
}
