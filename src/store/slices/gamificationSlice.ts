import type { StateCreator } from 'zustand';

import { addPracticeMinutes } from '@/lib/gamification/daily';
import { registerActivity } from '@/lib/streak';
import type { AppState, GamificationActions } from '@/store/types';

export const createGamificationSlice: StateCreator<AppState, [], [], GamificationActions> = (set) => ({
  addXp: (amount) =>
    set((current) => ({ xp: current.xp + (Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0) })),
  registerPractice: (minutes) =>
    set((current) => ({
      today: addPracticeMinutes(current.today, minutes),
      streak: registerActivity(current.streak),
    })),
  setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
  earnReward: (badge) =>
    set((current) => ({
      goldenKeys: current.goldenKeys + 1,
      chestsOpened: current.chestsOpened + 1,
      badges: badge && !current.badges.includes(badge) ? [...current.badges, badge] : current.badges,
    })),
});
