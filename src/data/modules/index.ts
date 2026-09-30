/**
 * Cargador del contenido del juego: valida cada módulo con zod al cargarlo y completa las rondas hasta ~10
 * preguntas con el contenido heredado. Si un módulo estuviera mal formado, falla con un error claro.
 */
import { ancla } from '@/data/modules/ancla';
import { descarga } from '@/data/modules/descarga';
import { enfriador } from '@/data/modules/enfriador';
import { freno } from '@/data/modules/freno';
import { hoy } from '@/data/modules/hoy';
import { LEGACY_POOLS, fillRound, type LegacyPool } from '@/data/modules/legacyQuestions';
import { muro } from '@/data/modules/muro';
import { moduleContentSchema } from '@/data/modules/schema';
import type { ModuleContent } from '@/types/content';
import type { ModuleId } from '@/types/game';

const RAW: Readonly<Record<ModuleId, ModuleContent>> = { descarga, enfriador, freno, hoy, ancla, muro };

/** Banco heredado que mejor encaja con la habilidad de cada módulo. */
const POOL_FOR: Readonly<Record<ModuleId, LegacyPool>> = {
  descarga: 'control',
  enfriador: 'mixed',
  freno: 'mixed',
  hoy: 'control',
  ancla: 'mixed',
  muro: 'mixed',
};

const cache = new Map<ModuleId, ModuleContent>();

function prepare(id: ModuleId): ModuleContent {
  const parsed = moduleContentSchema.safeParse(RAW[id]);
  if (!parsed.success) {
    throw new Error(`Contenido inválido en el módulo "${id}": ${parsed.error.issues[0]?.message ?? 'error desconocido'}`);
  }
  const content = RAW[id];
  const pool = LEGACY_POOLS[POOL_FOR[id]];
  const rounds = content.rounds.map((round, index) => fillRound(round, pool, `${id}-${index}`));
  return { ...content, rounds: [rounds[0], rounds[1], rounds[2]] };
}

export function getModuleContent(id: ModuleId): ModuleContent {
  const cached = cache.get(id);
  if (cached) return cached;
  const content = prepare(id);
  cache.set(id, content);
  return content;
}
