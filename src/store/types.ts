import type { Impulse, ImpulseStatus } from '@/lib/impulses';
import type { TrustedContact } from '@/lib/support';
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
  /** Aviso a las 20:00 si hay racha y aún no practicaste hoy (opcional, apagado por defecto). */
  readonly streakRisk: boolean;
}

export interface ChatMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly text: string;
  /** Marca de tiempo ISO. */
  readonly createdAt: string;
}

export const EVIDENCE_ICONS = ['trophy', 'mountain', 'lightbulb', 'handshake', 'heart', 'compass', 'star', 'sun', 'medal', 'book'] as const;
export type EvidenceIcon = (typeof EVIDENCE_ICONS)[number];

export interface EvidenceItem {
  readonly id: string;
  readonly title: string;
  readonly icon: EvidenceIcon;
  /** Día del logro (yyyy-mm-dd). */
  readonly date: string;
  readonly source: 'manual' | 'game';
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
  readonly impulses: readonly Impulse[];
  readonly evidence: readonly EvidenceItem[];
  readonly contacts: readonly TrustedContact[];
  /** Foto feliz elegida para la Pantalla Ancla (URI local; nunca sale del teléfono). */
  readonly anchorPhotoUri: string | null;
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

export interface WellbeingActions {
  addImpulse: (impulse: Impulse) => void;
  setImpulseNotification: (id: string, notificationId: string | null) => void;
  resolveImpulse: (id: string, status: Exclude<ImpulseStatus, 'waiting'>) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id'>) => void;
  removeEvidence: (id: string) => void;
  addContact: (contact: TrustedContact) => void;
  removeContact: (id: string) => void;
  setAnchorPhoto: (uri: string | null) => void;
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
  WellbeingActions &
  RootActions;
