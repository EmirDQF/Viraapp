import type { StateCreator } from 'zustand';

import { toIsoDate } from '@/lib/age';
import { resolveImpulse } from '@/lib/impulses';
import { MAX_CONTACTS } from '@/lib/support';
import type { AppState, WellbeingActions } from '@/store/types';

/** XP por resistir un impulso: la herramienta real también cuenta como práctica. */
export const IMPULSE_RESISTED_XP = 10;

const newId = (prefix: string): string => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Impulsos, Muro de Evidencia, Apoyo Cercano y foto ancla. Todo queda en el teléfono. */
export const createWellbeingSlice: StateCreator<AppState, [], [], WellbeingActions> = (set) => ({
  addImpulse: (impulse) => set((current) => ({ impulses: [impulse, ...current.impulses] })),
  setImpulseNotification: (id, notificationId) =>
    set((current) => ({ impulses: current.impulses.map((item) => (item.id === id ? { ...item, notificationId } : item)) })),
  resolveImpulse: (id, status) =>
    set((current) => {
      const target = current.impulses.find((item) => item.id === id);
      if (!target || target.status !== 'waiting') return {};
      const impulses = current.impulses.map((item) => (item.id === id ? resolveImpulse(item, status) : item));
      if (status !== 'resisted') return { impulses };
      // Cada impulso resistido suma XP y queda como evidencia en el Muro.
      const evidence = [
        { id: newId('ev'), title: `Resististe: ${target.title}`, icon: 'medal' as const, date: toIsoDate(new Date()), source: 'game' as const },
        ...current.evidence,
      ];
      return { impulses, evidence, xp: current.xp + IMPULSE_RESISTED_XP };
    }),
  addEvidence: (item) => set((current) => ({ evidence: [{ ...item, id: newId('ev') }, ...current.evidence] })),
  removeEvidence: (id) => set((current) => ({ evidence: current.evidence.filter((item) => item.id !== id) })),
  addContact: (contact) =>
    set((current) => (current.contacts.length >= MAX_CONTACTS ? {} : { contacts: [...current.contacts, contact] })),
  removeContact: (id) => set((current) => ({ contacts: current.contacts.filter((item) => item.id !== id) })),
  setAnchorPhoto: (uri) => set({ anchorPhotoUri: uri }),
});
