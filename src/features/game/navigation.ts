import { router } from 'expo-router';

import type { ModuleId, StagePointer } from '@/types/game';

export function openModule(id: ModuleId): void {
  router.push({ pathname: '/module/[id]', params: { id } });
}

export function openStage({ moduleId, stage }: StagePointer): void {
  router.push({ pathname: '/module/[id]/stage/[stage]', params: { id: moduleId, stage: String(stage) } });
}

/** Vuelve atrás si hay historial; si no (p. ej. se abrió por un enlace), va a las pestañas. */
export function goBackOrHome(): void {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(tabs)');
  }
}
