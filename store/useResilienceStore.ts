import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { EMPTY_PROGRESS, applyRecord, markCompleted, refillEnergy, spendEnergy } from '../lib/progress';
import { registerActivity } from '../lib/streak';
import type { CrucibleId, CrucibleProgress, Energy, ModuleId, ModuleRecord, Streak, User } from '../types';

const MAX_ENERGY = 5;

interface ResilienceData {
  readonly user: User | null;
  readonly activeCrucible: CrucibleId | null;
  readonly progress: Partial<Record<CrucibleId, CrucibleProgress>>;
  readonly xp: number;
  readonly streak: Streak;
  readonly energy: Energy;
}

interface ResilienceActions {
  setUser: (name: string, birthDate: string) => void;
  selectCrucible: (id: CrucibleId) => void;
  saveRecord: (record: ModuleRecord) => void;
  completeModule: (moduleId: ModuleId, xpEarned: number) => void;
  loseEnergy: () => void;
  restoreEnergy: () => void;
  resetAll: () => void;
}

export type ResilienceState = ResilienceData & ResilienceActions;

const INITIAL_DATA: ResilienceData = {
  user: null,
  activeCrucible: null,
  progress: {},
  xp: 0,
  streak: { count: 0, lastActiveDate: null },
  energy: { current: MAX_ENERGY, max: MAX_ENERGY },
};

function updateActiveProgress(
  state: ResilienceData,
  update: (progress: CrucibleProgress) => CrucibleProgress,
): Partial<ResilienceData> {
  const crucible = state.activeCrucible;
  if (!crucible) {
    return {};
  }
  const current = state.progress[crucible] ?? EMPTY_PROGRESS;
  return { progress: { ...state.progress, [crucible]: update(current) } };
}

export const useResilienceStore = create<ResilienceState>()(
  persist(
    (set) => ({
      ...INITIAL_DATA,
      setUser: (name, birthDate) =>
        set({ user: { name: name.trim(), birthDate, createdAt: new Date().toISOString() } }),
      selectCrucible: (id) =>
        set((state) => ({
          activeCrucible: id,
          progress: state.progress[id] ? state.progress : { ...state.progress, [id]: EMPTY_PROGRESS },
        })),
      saveRecord: (record) => set((state) => updateActiveProgress(state, (progress) => applyRecord(progress, record))),
      completeModule: (moduleId, xpEarned) =>
        set((state) => ({
          ...updateActiveProgress(state, (progress) => markCompleted(progress, moduleId)),
          xp: state.xp + xpEarned,
          streak: registerActivity(state.streak),
        })),
      loseEnergy: () => set((state) => ({ energy: spendEnergy(state.energy) })),
      restoreEnergy: () => set((state) => ({ energy: refillEnergy(state.energy) })),
      resetAll: () => set({ ...INITIAL_DATA }),
    }),
    {
      name: 'tenaz-resilience-store',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state): ResilienceData => ({
        user: state.user,
        activeCrucible: state.activeCrucible,
        progress: state.progress,
        xp: state.xp,
        streak: state.streak,
        energy: state.energy,
      }),
    },
  ),
);

export function useActiveProgress(): CrucibleProgress {
  return useResilienceStore((state) =>
    state.activeCrucible ? state.progress[state.activeCrucible] ?? EMPTY_PROGRESS : EMPTY_PROGRESS,
  );
}

/** true cuando el estado persistido ya se cargó desde AsyncStorage. */
export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useResilienceStore.persist.hasHydrated());
  useEffect(() => {
    const unsubscribe = useResilienceStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useResilienceStore.persist.hasHydrated());
    return unsubscribe;
  }, []);
  return hydrated;
}
