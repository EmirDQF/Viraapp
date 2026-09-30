/**
 * Migraciones del store persistido. Todo lo que viene de AsyncStorage se considera dato externo: se valida
 * con zod y, si algo está corrupto, se usa el valor por defecto en lugar de romper la app.
 */
import { z } from 'zod';

import { MODULE_ORDER } from '@/data/modules/catalog';
import type { PersistedState, Settings } from '@/store/types';

export const STORE_VERSION = 2;

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  reduceMotion: false,
  sounds: true,
  haptics: true,
  dailyReminder: { enabled: false, hour: 19, minute: 0 },
};

export const DEFAULT_PERSISTED: PersistedState = {
  user: null,
  onboarding: {
    completed: false,
    firstModule: null,
    permissions: { calendar: 'unknown', notifications: 'unknown', photos: 'unknown', news: 'unknown' },
  },
  modules: {},
  lastPlayed: null,
  xp: 0,
  streak: { count: 0, lastActiveDate: null },
  dailyGoalMinutes: 10,
  today: { date: null, minutes: 0 },
  goldenKeys: 0,
  chestsOpened: 0,
  badges: [],
  settings: DEFAULT_SETTINGS,
  legacy: null,
  chatMessages: [],
};

/** Máximo de mensajes de chat guardados en el teléfono. */
export const MAX_CHAT_MESSAGES = 100;

const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const moduleId = z.enum(MODULE_ORDER as [string, ...string[]]);
const permission = z.enum(['granted', 'denied', 'skipped', 'unknown']);

const userSchema = z.object({ name: z.string().min(1).max(40), birthDate: isoDay, createdAt: z.string() });
const chatMessageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  text: z.string().max(8000),
  createdAt: z.string(),
});
const streakSchema = z.object({ count: z.number().int().min(0), lastActiveDate: isoDay.nullable() });
const moduleProgressSchema = z.object({
  // Se eliminan duplicados: datos corruptos como [0,0,0…] no deben contar como módulo completo.
  completedStages: z
    .array(z.number().int().min(0).max(12))
    .transform((stages) => [...new Set(stages)].sort((a, b) => a - b)),
  bestScores: z.record(z.string(), z.number().min(0).max(1)),
  completedAt: z.string().nullable(),
});

/** Aplica un esquema y devuelve el valor por defecto si no valida. */
function safe<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const result = schema.safeParse(value);
  return result.success ? result.data : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readModules(value: unknown): PersistedState['modules'] {
  const entries = Object.entries(asRecord(value)).flatMap(([key, progress]) => {
    const parsed = moduleProgressSchema.safeParse(progress);
    // Se guarda el valor ya normalizado por el esquema (p. ej. sin etapas duplicadas).
    return moduleId.safeParse(key).success && parsed.success ? [[key, parsed.data] as const] : [];
  });
  return Object.fromEntries(entries) as PersistedState['modules'];
}

function readSettings(value: unknown): Settings {
  const raw = asRecord(value);
  const reminder = asRecord(raw.dailyReminder);
  return {
    theme: safe(z.enum(['system', 'light', 'dark']), raw.theme, DEFAULT_SETTINGS.theme),
    reduceMotion: safe(z.boolean(), raw.reduceMotion, DEFAULT_SETTINGS.reduceMotion),
    sounds: safe(z.boolean(), raw.sounds, DEFAULT_SETTINGS.sounds),
    haptics: safe(z.boolean(), raw.haptics, DEFAULT_SETTINGS.haptics),
    dailyReminder: {
      enabled: safe(z.boolean(), reminder.enabled, DEFAULT_SETTINGS.dailyReminder.enabled),
      hour: safe(z.number().int().min(0).max(23), reminder.hour, DEFAULT_SETTINGS.dailyReminder.hour),
      minute: safe(z.number().int().min(0).max(59), reminder.minute, DEFAULT_SETTINGS.dailyReminder.minute),
    },
  };
}

function readOnboarding(value: unknown, hasUser: boolean): PersistedState['onboarding'] {
  const raw = asRecord(value);
  const perms = asRecord(raw.permissions);
  const defaults = DEFAULT_PERSISTED.onboarding.permissions;
  return {
    completed: safe(z.boolean(), raw.completed, hasUser),
    firstModule: safe(moduleId.nullable(), raw.firstModule, null) as PersistedState['onboarding']['firstModule'],
    permissions: {
      calendar: safe(permission, perms.calendar, defaults.calendar),
      notifications: safe(permission, perms.notifications, defaults.notifications),
      photos: safe(permission, perms.photos, defaults.photos),
      news: safe(permission, perms.news, defaults.news),
    },
  };
}

/** Normaliza un estado v2 (o parcialmente válido) campo por campo. */
function readV2(raw: Record<string, unknown>): PersistedState {
  const user = safe(userSchema.nullable(), raw.user, null);
  const lastPlayed = safe(z.object({ moduleId, stage: z.number().int().min(0).max(12) }).nullable(), raw.lastPlayed, null);
  const legacy = raw.legacy === undefined || raw.legacy === null ? null : (raw.legacy as PersistedState['legacy']);
  return {
    user,
    onboarding: readOnboarding(raw.onboarding, user !== null),
    modules: readModules(raw.modules),
    lastPlayed: lastPlayed as PersistedState['lastPlayed'],
    xp: safe(z.number().int().min(0), raw.xp, 0),
    streak: safe(streakSchema, raw.streak, DEFAULT_PERSISTED.streak),
    dailyGoalMinutes: safe(z.union([z.literal(5), z.literal(10), z.literal(15)]), raw.dailyGoalMinutes, 10),
    today: safe(z.object({ date: isoDay.nullable(), minutes: z.number().min(0) }), raw.today, DEFAULT_PERSISTED.today),
    goldenKeys: safe(z.number().int().min(0), raw.goldenKeys, 0),
    chestsOpened: safe(z.number().int().min(0), raw.chestsOpened, 0),
    badges: safe(z.array(z.string()), raw.badges, []),
    settings: readSettings(raw.settings),
    legacy,
    chatMessages: safe(z.array(chatMessageSchema), raw.chatMessages, []).slice(-MAX_CHAT_MESSAGES),
  };
}

/** v1 (TENAZ): conserva usuario, XP y racha; guarda los crisoles como legado; descarta la energía. */
function fromV1(raw: Record<string, unknown>): PersistedState {
  const base = readV2({ user: raw.user, xp: raw.xp, streak: raw.streak });
  const hasLegacy = raw.activeCrucible !== undefined || raw.progress !== undefined;
  return {
    ...base,
    legacy: hasLegacy
      ? { activeCrucible: typeof raw.activeCrucible === 'string' ? raw.activeCrucible : null, crucibleProgress: raw.progress ?? {} }
      : null,
  };
}

export function migrateState(persisted: unknown, version: number): PersistedState {
  if (typeof persisted !== 'object' || persisted === null || Array.isArray(persisted)) {
    return DEFAULT_PERSISTED;
  }
  const raw = asRecord(persisted);
  return version < 2 ? fromV1(raw) : readV2(raw);
}
