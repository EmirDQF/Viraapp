import * as Notifications from 'expo-notifications';

import { createImpulse } from '@/lib/impulses';
import {
  cancelAllNotifications,
  cancelDailyReminder,
  cancelNotification,
  cancelStreakRisk,
  configureNotifications,
  scheduleAnchorNudge,
  scheduleDailyReminder,
  scheduleImpulseEnd,
  scheduleStreakRisk,
} from '@/lib/notifications';

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve(null)),
  setNotificationCategoryAsync: jest.fn(() => Promise.resolve(null)),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notif-1')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),
  AndroidImportance: { DEFAULT: 3 },
  SchedulableTriggerInputTypes: { DATE: 'date', DAILY: 'daily', TIME_INTERVAL: 'timeInterval' },
}));

const schedule = jest.mocked(Notifications.scheduleNotificationAsync);

describe('notificaciones locales', () => {
  beforeEach(() => jest.clearAllMocks());

  test('configura cómo se muestran y los botones del impulso', async () => {
    await configureNotifications();
    expect(Notifications.setNotificationHandler).toHaveBeenCalled();
    expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith('impulse', expect.any(Array));
  });

  test('programa el fin del impulso para la hora de término', async () => {
    const impulse = createImpulse('i1', 'Comprar', 20, new Date('2026-09-30T10:00:00.000Z'));
    await expect(scheduleImpulseEnd(impulse)).resolves.toBe('notif-1');
    const request = schedule.mock.calls[0][0];
    expect(request.content.data).toEqual({ kind: 'impulse', impulseId: 'i1' });
    expect(request.trigger).toMatchObject({ type: 'date', date: new Date(impulse.endsAt) });
  });

  test('el recordatorio diario reemplaza al anterior', async () => {
    await scheduleDailyReminder(8, 30);
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('vira-daily-reminder');
    expect(schedule.mock.calls[0][0].trigger).toMatchObject({ type: 'daily', hour: 8, minute: 30 });
    await cancelDailyReminder();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(2);
  });

  test('la racha en riesgo solo se programa si aún no son las 20:00', async () => {
    await expect(scheduleStreakRisk(new Date(2026, 8, 30, 21, 0))).resolves.toBeNull();
    await expect(scheduleStreakRisk(new Date(2026, 8, 30, 9, 0))).resolves.toBe('notif-1');
    await cancelStreakRisk();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('vira-streak-risk');
  });

  test('la pantalla ancla espera al menos un minuto', async () => {
    await scheduleAnchorNudge(0);
    expect(schedule.mock.calls[0][0].trigger).toMatchObject({ type: 'timeInterval', seconds: 60 });
  });

  test('cancelar sin id no hace nada y cancelar todo limpia los avisos', async () => {
    await cancelNotification(null);
    expect(Notifications.cancelScheduledNotificationAsync).not.toHaveBeenCalled();
    await cancelAllNotifications();
    expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
  });

  test('si el sistema falla devuelve null sin romper', async () => {
    schedule.mockRejectedValueOnce(new Error('sin permiso'));
    await expect(scheduleAnchorNudge(5)).resolves.toBeNull();
  });
});
