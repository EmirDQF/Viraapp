import { seedFrom, seededRandom } from '@/lib/random';
import { shuffle } from '@/lib/shuffle';
import type { QuizQuestion } from '@/types/content';

/**
 * Mezcla las opciones de una pregunta de forma determinista (misma semilla → mismo orden) y recoloca el
 * índice de la respuesta correcta. Evita que la correcta quede siempre en la misma letra.
 */
export function shuffleQuestion(question: QuizQuestion, seedKey: string): QuizQuestion {
  const order = shuffle(
    question.options.map((_, index) => index),
    seededRandom(seedFrom(seedKey)),
  );
  return {
    ...question,
    options: order.map((index) => question.options[index]),
    answer: order.indexOf(question.answer),
  };
}
