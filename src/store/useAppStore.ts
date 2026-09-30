import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_PERSISTED, STORE_VERSION, migrateState } from '@/store/migrations';
import { createGamificationSlice } from '@/store/slices/gamificationSlice';
import { createProgressSlice } from '@/store/slices/progressSlice';
import { createSettingsSlice } from '@/store/slices/settingsSlice';
import { createUserSlice } from '@/store/slices/userSlice';
import type { AppState, PersistedState } from '@/store/types';

/**
 * Store único de VIRA (zustand + persist en AsyncStorage), dividido en slices.
 * Todo queda en el teléfono: nada de esto se envía a ningún servidor.
 */
export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      ...DEFAULT_PERSISTED,
      ...createUserSlice(...args),
      ...createProgressSlice(...args),
      ...createGamificationSlice(...args),
      ...createSettingsSlice(...args),
      resetAll: () => args[0]({ ...DEFAULT_PERSISTED }),
    }),
    {
      // Se conserva el nombre antiguo a propósito: es la clave en AsyncStorage. Renombrarla a "vira-…"
      // haría que la app no encontrara el progreso guardado y lo perdiera.
      name: 'tenaz-resilience-store',
      version: STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted, version) => migrateState(persisted, version),
      partialize: (state): PersistedState => ({
        user: state.user,
        onboarding: state.onboarding,
        modules: state.modules,
        lastPlayed: state.lastPlayed,
        xp: state.xp,
        streak: state.streak,
        dailyGoalMinutes: state.dailyGoalMinutes,
        today: state.today,
        goldenKeys: state.goldenKeys,
        chestsOpened: state.chestsOpened,
        badges: state.badges,
        settings: state.settings,
        legacy: state.legacy,
      }),
    },
  ),
);

/** true cuando el estado persistido ya se cargó desde AsyncStorage. */
export function useStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
