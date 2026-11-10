import { router, type Href } from 'expo-router';
import { useCallback } from 'react';

import { getActivity } from '@/data/caminos/activities';
import type { Pa3ModuleId } from '@/data/caminos/types';
import { useAppStore } from '@/store/useAppStore';

export function moduleHref(id: Pa3ModuleId): Href {
  return { pathname: '/camino/modulo/[id]', params: { id } };
}

export function activityHref(id: string): Href {
  return { pathname: '/camino/actividad/[id]', params: { id } };
}

/**
 * Abre una actividad: las que se juegan en VIRA van a su pantalla; las que usan una pantalla existente (muro,
 * SOS, técnicas…) quedan "en curso" y se abren directo; las propuestas llevan a su módulo.
 */
export function useOpenActivity(): (activityId: string) => void {
  const pauseActivity = useAppStore((state) => state.pauseActivity);
  return useCallback(
    (activityId: string) => {
      const activity = getActivity(activityId);
      if (!activity) return;
      const { content } = activity;
      if (content.kind === 'flow') {
        router.push(activityHref(activity.id));
        return;
      }
      if (content.kind === 'link') {
        const already = useAppStore.getState().caminoActivities[activity.id];
        if (!already) pauseActivity(activity.id, 0, []);
        router.push(content.href as Href);
        return;
      }
      router.push(moduleHref(activity.moduleId));
    },
    [pauseActivity],
  );
}
