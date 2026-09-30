import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { ACTION_NOT_NEEDED, ACTION_STILL_NEED, configureNotifications, notificationsSupported } from '@/lib/notifications';
import { useAppStore } from '@/store/useAppStore';

/** Datos de una notificación de VIRA: vienen del sistema, así que se validan antes de usarlos. */
function readData(data: unknown): { kind: string; impulseId?: string } | null {
  if (typeof data !== 'object' || data === null) return null;
  const record = data as Record<string, unknown>;
  if (typeof record.kind !== 'string') return null;
  return { kind: record.kind, impulseId: typeof record.impulseId === 'string' ? record.impulseId : undefined };
}

/** Configura las notificaciones y reacciona a sus botones ("¿Aún lo necesitas?") y toques. */
export function useNotificationRouting(): void {
  useEffect(() => {
    if (!notificationsSupported) return;
    void configureNotifications();
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = readData(response.notification.request.content.data);
      if (!data) return;
      if (data.kind === 'impulse' && data.impulseId) {
        const { resolveImpulse } = useAppStore.getState();
        if (response.actionIdentifier === ACTION_NOT_NEEDED) resolveImpulse(data.impulseId, 'resisted');
        else if (response.actionIdentifier === ACTION_STILL_NEED) resolveImpulse(data.impulseId, 'gave_in');
        else router.push('/impulses');
        return;
      }
      if (data.kind === 'anchor') router.push('/anchor');
      else router.push('/(tabs)');
    });
    return () => subscription.remove();
  }, []);
}
