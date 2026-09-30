/** Esquema zod del contenido de un módulo: se valida al cargarlo para detectar datos mal formados. */
import { z } from 'zod';

import { MODULE_ORDER } from '@/data/modules/catalog';

const text = z.string().trim().min(1);

export const quizQuestionSchema = z
  .object({ prompt: text, options: z.array(text).min(2).max(4), answer: z.number().int().min(0), why: text })
  .refine((question) => question.answer < question.options.length, { message: 'La respuesta debe ser una de las opciones' });

const decisionOption = z.object({ label: text, outcome: text, good: z.boolean(), learning: text });
const decisionScene = z
  .object({ title: text, situation: text, options: z.tuple([decisionOption, decisionOption]) })
  .refine((scene) => scene.options.some((option) => option.good) && scene.options.some((option) => !option.good), {
    message: 'Una decisión necesita una opción buena y otra impulsiva',
  });

const side = z.enum(['left', 'right']);

export const moduleContentSchema = z.object({
  id: z.enum(MODULE_ORDER as [string, ...string[]]),
  context: decisionScene,
  conflict: decisionScene,
  rounds: z.tuple([z.array(quizQuestionSchema).min(1), z.array(quizQuestionSchema).min(1), z.array(quizQuestionSchema).min(1)]),
  puzzle: z.object({ prompt: text, steps: z.array(text).min(3).max(5), insight: text }),
  swipe: z.object({
    prompt: text,
    left: text,
    right: text,
    cards: z.array(z.object({ text, answer: side, why: text })).min(4),
  }),
  wordRain: z.object({ good: z.array(text).length(8), bad: z.array(text).length(8), phrase: text }),
  simulator: z.object({
    kind: z.enum(['journal', 'impulse-timer', 'pause-breath', 'micro-steps', 'support-message', 'evidence-log']),
    title: text,
    intro: text,
    placeholder: z.string(),
    options: z.array(z.object({ label: text, detail: text })),
    closing: text,
  }),
  wordSearch: z.object({
    words: z
      .array(z.object({ word: z.string().regex(/^[A-ZÑ]{3,10}$/, 'Palabra de 3 a 10 letras en mayúsculas'), clue: text }))
      .length(6),
  }),
  trap: z.object({
    belief: text,
    turns: z
      .array(
        z.object({
          challenge: text,
          options: z.array(z.object({ text, strength: z.enum(['strong', 'weak', 'agree']), reply: text })).min(2),
        }),
      )
      .min(2),
    closing: text,
  }),
  boss: z.object({
    prompt: text,
    left: text,
    right: text,
    seconds: z.number().int().min(15).max(120),
    items: z.array(z.object({ text, answer: side })).min(6),
  }),
  rewind: z.object({ summary: z.array(text).min(2), reward: text }),
});
