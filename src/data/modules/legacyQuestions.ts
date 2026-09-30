/**
 * Preguntas derivadas del contenido heredado de TENAZ (tarjetas control/no-control y distorsiones de los
 * 5 crisoles). Completan las rondas hasta ~10 preguntas sin perder ese contenido.
 */
import { CRUCIBLES } from '@/data/legacy/crucibles';
import { DISTORTIONS } from '@/data/legacy/distortions';
import { seedFrom, seededRandom } from '@/lib/random';
import { shuffle } from '@/lib/shuffle';
import type { QuizQuestion } from '@/types/content';

export const ROUND_TARGET = 10;

const CONTROL_OPTIONS = ['Sí, depende de mí', 'No, está fuera de mi control'] as const;

function controlQuestions(): readonly QuizQuestion[] {
  return CRUCIBLES.flatMap((crucible) =>
    crucible.content.sortCards.map((card) => ({
      prompt: `«${card.text}». ¿Esto depende de ti?`,
      options: CONTROL_OPTIONS,
      answer: card.zone === 'control' ? 0 : 1,
      why: card.explanation,
    })),
  );
}

function distortionQuestions(): readonly QuizQuestion[] {
  return CRUCIBLES.flatMap((crucible) =>
    crucible.content.distortions.map((item) => ({
      prompt: `Piensas: «${item.thought}» ¿Qué trampa mental hay aquí?`,
      options: item.options.map((option) => DISTORTIONS[option].label),
      answer: item.options.indexOf(item.correct),
      why: item.explanation,
    })),
  );
}

/** Banco de preguntas heredadas, según el tipo de habilidad que trabaja el módulo. */
const CONTROL = controlQuestions();
const DISTORTIONS_POOL = distortionQuestions();

export const LEGACY_POOLS = {
  control: CONTROL,
  distortions: DISTORTIONS_POOL,
  /** Mezcla ambos bancos para dar variedad entre las tres rondas de un módulo. */
  mixed: [...DISTORTIONS_POOL, ...CONTROL],
} as const;

export type LegacyPool = keyof typeof LEGACY_POOLS;

/** Completa una ronda hasta `target` preguntas con preguntas heredadas, de forma determinista. */
export function fillRound(
  authored: readonly QuizQuestion[],
  pool: readonly QuizQuestion[],
  seedKey: string,
  target: number = ROUND_TARGET,
): readonly QuizQuestion[] {
  if (authored.length >= target) return authored;
  const used = new Set(authored.map((question) => question.prompt));
  const extra = shuffle(
    pool.filter((question) => !used.has(question.prompt)),
    seededRandom(seedFrom(seedKey)),
  ).slice(0, target - authored.length);
  return [...authored, ...extra];
}
