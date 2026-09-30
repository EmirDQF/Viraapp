import type { StateCreator } from 'zustand';

import type { AppState, SettingsActions } from '@/store/types';

export const createSettingsSlice: StateCreator<AppState, [], [], SettingsActions> = (set) => ({
  updateSettings: (patch) => set((current) => ({ settings: { ...current.settings, ...patch } })),
});
