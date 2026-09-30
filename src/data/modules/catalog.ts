import type { ModuleId, ModuleMeta } from '@/types/game';

/**
 * Orden de desbloqueo: el de los sectores de la guía del juego
 * (Factores → Impulsos → Estrategia → Resiliencia).
 */
export const MODULE_ORDER: readonly ModuleId[] = ['descarga', 'enfriador', 'freno', 'hoy', 'ancla', 'muro'];

export const MODULES: Readonly<Record<ModuleId, ModuleMeta>> = {
  descarga: {
    id: 'descarga',
    order: 1,
    name: 'El Descarga',
    track: 'Sector 1 · Factores',
    tagline: 'Saca lo que tienes en la cabeza y recupera energía.',
    focus: 'Apoyo emocional, desahogo y frenar el sobrepensamiento.',
    idea: 'Sacar lo que tengo en la cabeza me devuelve energía; darle vueltas me la quita.',
    phrase: 'Lo que sale de mi cabeza deja de pesar.',
  },
  enfriador: {
    id: 'enfriador',
    order: 2,
    name: 'Enfriador de Dopamina',
    track: 'Sector 2 · Impulsos',
    tagline: 'Un impulso no es una necesidad: espera y decide.',
    focus: 'Impulsividad, postergar la gratificación, compras impulsivas y escapismo.',
    idea: 'Un impulso no es una necesidad: si espero 20 minutos, casi siempre baja.',
    phrase: 'El impulso pasa; mi decisión se queda.',
  },
  freno: {
    id: 'freno',
    order: 3,
    name: 'Freno de Mano',
    track: 'Sector 2 · Impulsos',
    tagline: 'Entre lo que sientes y lo que haces cabe una pausa.',
    focus: 'Control de impulsos, pausa táctica y reactividad emocional.',
    idea: 'Antes de responder en caliente, pauso; la decisión mejora cuando baja la emoción.',
    phrase: 'Entre lo que siento y lo que hago, cabe una pausa.',
  },
  hoy: {
    id: 'hoy',
    order: 4,
    name: 'Hoy en Fácil',
    track: 'Sector 3 · Estrategia',
    tagline: 'Pequeñas victorias para empezar el día con alegría.',
    focus: 'Organización, menos carga cognitiva y dividir metas.',
    idea: 'Tres tareas bien elegidas y divididas en micropasos rinden más que quince a la vez.',
    phrase: 'Lo pequeño que empiezo vale más que lo grande que espero.',
  },
  ancla: {
    id: 'ancla',
    order: 5,
    name: 'Círculo Ancla',
    track: 'Sector 4 · Resiliencia',
    tagline: 'Pedir ayuda a tiempo también es fuerza.',
    focus: 'Red de apoyo, pedir ayuda y desescalamiento social.',
    idea: 'Pedir ayuda a tiempo y sin dramatismo es una fortaleza.',
    phrase: 'Pedir ayuda a tiempo también es fuerza.',
  },
  muro: {
    id: 'muro',
    order: 6,
    name: 'Muro de Evidencia',
    track: 'Sector 4 · Resiliencia',
    tagline: 'Ya superaste cosas difíciles: esa evidencia te sostiene.',
    focus: 'Resiliencia, autoeficacia y memoria de superación.',
    idea: 'Ya salí de cosas difíciles antes; esa evidencia me sostiene hoy.',
    phrase: 'Ya lo superé antes; hoy también puedo.',
  },
};

const MODULE_IDS: readonly string[] = MODULE_ORDER;

export function isModuleId(value: unknown): value is ModuleId {
  return typeof value === 'string' && MODULE_IDS.includes(value);
}

export function getModule(id: ModuleId): ModuleMeta {
  return MODULES[id];
}
