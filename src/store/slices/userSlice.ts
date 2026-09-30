import type { StateCreator } from 'zustand';

import type { AppState, PersistedState, UserActions } from '@/store/types';

type UserData = Pick<PersistedState, 'user' | 'onboarding'>;

export const createUserSlice: StateCreator<AppState, [], [], UserActions> = (set) => ({
  setUser: (name, birthDate) =>
    set({ user: { name: name.trim(), birthDate, createdAt: new Date().toISOString() } } satisfies Partial<UserData>),
  setPermission: (key, state) =>
    set((current) => ({
      onboarding: { ...current.onboarding, permissions: { ...current.onboarding.permissions, [key]: state } },
    })),
  completeOnboarding: (firstModule) =>
    set((current) => ({ onboarding: { ...current.onboarding, completed: true, firstModule } })),
});
