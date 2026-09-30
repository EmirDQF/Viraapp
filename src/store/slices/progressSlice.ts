import type { StateCreator } from 'zustand';

import { completeStage } from '@/lib/gamification/progress';
import type { AppState, ProgressActions } from '@/store/types';

export const createProgressSlice: StateCreator<AppState, [], [], ProgressActions> = (set) => ({
  recordStage: (pointer, score) =>
    set((current) => ({
      modules: completeStage(current.modules, pointer.moduleId, pointer.stage, score),
      lastPlayed: pointer,
    })),
  setLastPlayed: (pointer) => set({ lastPlayed: pointer }),
});
