import type { ModuleId, ModulesProgress, StagePointer } from '@/types/game';
import type { Streak, User } from '@/types/user';

export type PermissionKey = 'calendar' | 'notifications' | 'photos' | 'news';
export type PermissionState = 'granted' | 'denied' | 'skipped' | 'unknown';

export interface OnboardingState {
  readonly completed: boolean;
  readonly firstModule: ModuleId | null;
  readonly permissions: Readonly<Record<PermissionKey, PermissionState>>;
}

export type DailyGoalMinutes = 5 | 10 | 15;
export type ThemePreference = 'system' | 'light' | 'dark';

export interface DailyPractice {
  /** Día (yyyy-mm-dd) al que corresponden los minutos, o null si nunca practicó. */
  readonly date: string | null;
  readonly minutes: number;
}

export interface Settings {
  readonly theme: ThemePreference;
  readonly reduceMotion: boolean;
  readonly sounds: boolean;
  readonly haptics: boolean;
  readonly dailyReminder: { readonly enabled: boolean; readonly hour: number; readonly minute: number };
}

export interface ChatMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly text: string;
  /** Marca de tiempo ISO. */
  readonly createdAt: string;
}

export interface LegacyData {
  readonly activeCrucible: string | null;
  readonly crucibleProgress: unknown;
}

/** Forma de los datos persistidos en AsyncStorage (versión 2). */
export interface PersistedState {
  readonly user: User | null;
  readonly onboarding: OnboardingState;
  readonly modules: ModulesProgress;
  readonly lastPlayed: StagePointer | null;
  readonly xp: number;
  readonly streak: Streak;
  readonly dailyGoalMinutes: DailyGoalMinutes;
  readonly today: DailyPractice;
  readonly goldenKeys: number;
  readonly chestsOpened: number;
  readonly badges: readonly string[];
  readonly settings: Settings;
  readonly legacy: LegacyData | null;
  /** Conversación con Regi: solo en memoria (no se persiste); se borra con "Borrón y cuenta nueva". */
  readonly chatMessages: readonly ChatMessage[];
}

export interface UserActions {
  setUser: (name: string, birthDate: string) => void;
  setPermission: (key: PermissionKey, state: PermissionState) => void;
  completeOnboarding: (firstModule: ModuleId | null) => void;
}

export interface ProgressActions {
  recordStage: (pointer: StagePointer, score: number) => void;
  setLastPlayed: (pointer: StagePointer) => void;
}

export interface GamificationActions {
  addXp: (amount: number) => void;
  registerPractice: (minutes: number) => void;
  setDailyGoal: (minutes: DailyGoalMinutes) => void;
  earnReward: (badge: string | null) => void;
}

export interface ChatActions {
  addChatMessage: (message: ChatMessage) => void;
  appendToChatMessage: (id: string, text: string) => void;
  replaceChatMessage: (id: string, text: string) => void;
  clearChat: () => void;
}

export interface SettingsActions {
  updateSettings: (patch: Partial<Settings>) => void;
}

export interface RootActions {
  /** Borra todos los datos del usuario ("Borrar mis datos"). */
  resetAll: () => void;
}

export type AppState = PersistedState &
  UserActions &
  ProgressActions &
  GamificationActions &
  SettingsActions &
  ChatActions &
  RootActions;
