import type { StateCreator } from 'zustand';

import { withEvent } from '@/store/timelineEvents';
import { OWN_CASE_FIELD_MAX, OWN_CASE_TITLE_MAX, type AppState, type CasesActions, type OwnCaseDraft } from '@/store/types';

/** XP por resolver un caso del Laboratorio por primera vez. */
export const CASE_SOLVED_XP = 15;

const newId = (): string => `case-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function clean(draft: OwnCaseDraft): OwnCaseDraft {
  const field = (value: string) => value.trim().slice(0, OWN_CASE_FIELD_MAX);
  return {
    title: draft.title.trim().slice(0, OWN_CASE_TITLE_MAX) || 'Mi caso',
    impulses: field(draft.impulses),
    thoughts: field(draft.thoughts),
    frustration: field(draft.frustration),
    technique: field(draft.technique),
  };
}

/** Laboratorio de casos: casos resueltos y casos propios. Todo queda en el teléfono. */
export const createCasesSlice: StateCreator<AppState, [], [], CasesActions> = (set) => ({
  solveCase: (id) =>
    set((current) =>
      current.solvedCases.includes(id)
        ? {}
        : {
            solvedCases: [...current.solvedCases, id],
            xp: current.xp + CASE_SOLVED_XP,
            timeline: withEvent(current.timeline, { kind: 'case', caseId: id }),
          },
    ),
  addOwnCase: (draft) =>
    set((current) => ({ ownCases: [{ ...clean(draft), id: newId(), createdAt: new Date().toISOString() }, ...current.ownCases] })),
  removeOwnCase: (id) => set((current) => ({ ownCases: current.ownCases.filter((item) => item.id !== id) })),
});
