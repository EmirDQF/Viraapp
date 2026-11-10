import type { StateCreator } from 'zustand';

import { getActivity } from '@/data/caminos/activities';
import { ACTIVITY_XP, TENSION_MAX, TENSION_MIN, type ActivityProgress, type ModuleJourney } from '@/lib/caminos';
import type { AppState, CaminosActions } from '@/store/types';

const EMPTY_JOURNEY: ModuleJourney = { before: null, after: null };

const clampTension = (value: number): number => Math.min(TENSION_MAX, Math.max(TENSION_MIN, Math.round(value)));

function progressOf(state: AppState, activityId: string): ActivityProgress {
  return state.caminoActivities[activityId] ?? { completed: false, step: 0, answers: [], updatedAt: new Date().toISOString() };
}

/** Caminos PA3: caso inicial, "Antes y ahora" y avance de las actividades. Todo queda en el teléfono. */
export const createCaminosSlice: StateCreator<AppState, [], [], CaminosActions> = (set) => ({
  saveSituation: (moduleId, phase, answer) =>
    set((current) => {
      const journey = current.caminoJourneys[moduleId] ?? EMPTY_JOURNEY;
      const saved = { ...answer, tension: clampTension(answer.tension), at: new Date().toISOString() };
      return { caminoJourneys: { ...current.caminoJourneys, [moduleId]: { ...journey, [phase]: saved } } };
    }),
  pauseActivity: (activityId, step, answers) =>
    set((current) => {
      if (!getActivity(activityId)) return {};
      const progress = progressOf(current, activityId);
      return {
        caminoActivities: {
          ...current.caminoActivities,
          [activityId]: { ...progress, step: Math.max(0, step), answers: [...answers], updatedAt: new Date().toISOString() },
        },
      };
    }),
  restartActivity: (activityId) =>
    set((current) => {
      if (!current.caminoActivities[activityId]) return {};
      const progress = progressOf(current, activityId);
      return {
        caminoActivities: { ...current.caminoActivities, [activityId]: { ...progress, step: 0, answers: [], updatedAt: new Date().toISOString() } },
      };
    }),
  completeActivity: (activityId) =>
    set((current) => {
      if (!getActivity(activityId)) return {};
      const progress = progressOf(current, activityId);
      return {
        caminoActivities: {
          ...current.caminoActivities,
          [activityId]: { completed: true, step: 0, answers: [], updatedAt: new Date().toISOString() },
        },
        xp: progress.completed ? current.xp : current.xp + ACTIVITY_XP,
      };
    }),
  resetModuleJourney: (moduleId) =>
    set((current) => ({ caminoJourneys: { ...current.caminoJourneys, [moduleId]: EMPTY_JOURNEY } })),
});
