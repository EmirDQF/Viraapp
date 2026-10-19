import type { StateCreator } from 'zustand';

import { withEvent } from '@/store/timelineEvents';
import type { AppState, TimelineActions } from '@/store/types';

/** Cronología "Mi camino": eventos sueltos (ánimo, SOS, técnicas) y la etapa de Regi ya celebrada. */
export const createTimelineSlice: StateCreator<AppState, [], [], TimelineActions> = (set) => ({
  logEvent: (event) => set((current) => ({ timeline: withEvent(current.timeline, event) })),
  markRegiStageSeen: (stage) => set({ regiStageSeen: stage }),
});
