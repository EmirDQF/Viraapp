import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { toIsoDate } from '@/lib/age';
import { setHapticsEnabled } from '@/lib/haptics';
import {
  cancelDailyReminder,
  cancelStreakRisk,
  notificationsSupported,
  scheduleDailyReminder,
  scheduleStreakRisk,
} from '@/lib/notifications';
import { reminderPlan } from '@/lib/reminders';
import { useAppStore } from '@/store/useAppStore';

type Task = () => Promise<unknown>;

/**
 * Encadena las tareas de un mismo aviso: cada cambio espera a que termine el anterior, así el aviso que
 * queda programado es siempre el del último ajuste aunque el usuario toque varias opciones seguidas.
 */
function useSerialQueue(): (task: Task) => void {
  const tail = useRef<Promise<unknown>>(Promise.resolve());
  return useCallback((task: Task) => {
    tail.current = tail.current.then(task, task);
  }, []);
}

/** Día actual; cambia cuando la app vuelve a primer plano en otro día (para reprogramar la racha). */
function useForegroundDay(): string {
  const [day, setDay] = useState(() => toIsoDate(new Date()));
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') setDay(toIsoDate(new Date()));
    });
    return () => sub.remove();
  }, []);
  return day;
}

/**
 * Lleva los ajustes guardados a los sistemas externos: el interruptor global de vibración y las
 * notificaciones locales (recordatorio diario y racha en riesgo). Se monta una vez en el layout raíz.
 */
export function usePreferencesSync(): void {
  const haptics = useAppStore((state) => state.settings.haptics);
  const { enabled, hour, minute } = useAppStore((state) => state.settings.dailyReminder);
  const streakRisk = useAppStore((state) => state.settings.streakRisk);
  const streak = useAppStore((state) => state.streak);
  const lastPracticeDate = useAppStore((state) => state.today.date);
  const day = useForegroundDay();
  const enqueueDaily = useSerialQueue();
  const enqueueStreak = useSerialQueue();

  useEffect(() => {
    setHapticsEnabled(haptics);
  }, [haptics]);

  useEffect(() => {
    if (!notificationsSupported) return;
    enqueueDaily(() => (enabled ? scheduleDailyReminder(hour, minute) : cancelDailyReminder()));
  }, [enqueueDaily, enabled, hour, minute]);

  useEffect(() => {
    if (!notificationsSupported) return;
    const plan = reminderPlan({ dailyReminder: { enabled: false, hour: 0, minute: 0 }, streakRisk, streak, lastPracticeDate });
    enqueueStreak(() => (plan.streakRisk ? scheduleStreakRisk() : cancelStreakRisk()));
    // `day` no se lee: solo obliga a reevaluar la racha cuando la app vuelve a primer plano otro día.
  }, [enqueueStreak, day, lastPracticeDate, streak, streakRisk]);
}
