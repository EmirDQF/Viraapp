import type { StateCreator } from 'zustand';

import { stageAt } from '@/data/stages';
import { completeStage } from '@/lib/gamification/progress';
import { withEvent } from '@/store/timelineEvents';
import type { AppState, ProgressActions } from '@/store/types';

export const createProgressSlice: StateCreator<AppState, [], [], ProgressActions> = (set) => ({
  recordStage: (pointer, score) =>
    set((current) => ({
      modules: completeStage(current.modules, pointer.moduleId, pointer.stage, score),
      lastPlayed: pointer,
      timeline: withEvent(current.timeline, {
        kind: 'lesson',
        moduleId: pointer.moduleId,
        stage: pointer.stage,
        minutes: stageAt(pointer.stage)?.minutes ?? 1,
        score: Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : 0,
      }),
    })),
  setLastPlayed: (pointer) => set({ lastPlayed: pointer }),
});
