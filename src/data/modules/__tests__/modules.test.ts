import { MODULE_ORDER } from '@/data/modules/catalog';
import { getModuleContent } from '@/data/modules';
import { ROUND_TARGET, fillRound } from '@/data/modules/legacyQuestions';
import { moduleContentSchema } from '@/data/modules/schema';
import { generateWordSearch } from '@/lib/wordsearch';

describe('contenido de los 6 módulos', () => {
  test.each(MODULE_ORDER)('%s es válido según el esquema', (id) => {
    expect(moduleContentSchema.safeParse(getModuleContent(id)).success).toBe(true);
  });

  test.each(MODULE_ORDER)('%s tiene ~10 preguntas en cada ronda', (id) => {
    getModuleContent(id).rounds.forEach((round) => expect(round.length).toBeGreaterThanOrEqual(ROUND_TARGET));
  });

  test.each(MODULE_ORDER)('%s tiene 8 palabras buenas y 8 malas en la lluvia', (id) => {
    const { wordRain } = getModuleContent(id);
    expect(wordRain.good).toHaveLength(8);
    expect(wordRain.bad).toHaveLength(8);
  });

  test.each(MODULE_ORDER)('%s genera un pupiletras 10×10 con sus 6 palabras', (id) => {
    const words = getModuleContent(id).wordSearch.words.map((item) => item.word);
    expect(generateWordSearch(words, 10, 1).placements).toHaveLength(6);
  });

  test('El Descarga tiene 30 preguntas propias (módulo completo)', () => {
    expect(getModuleContent('descarga').rounds.flat()).toHaveLength(30);
  });

  test('cada pregunta tiene su respuesta dentro de las opciones', () => {
    MODULE_ORDER.flatMap((id) => getModuleContent(id).rounds.flat()).forEach((question) => {
      expect(question.answer).toBeLessThan(question.options.length);
    });
  });
});

describe('fillRound', () => {
  const authored = [{ prompt: 'A', options: ['x', 'y'], answer: 0, why: 'w' }];
  const pool = Array.from({ length: 20 }, (_, index) => ({ prompt: `P${index}`, options: ['x', 'y'], answer: 1, why: 'w' }));

  test('completa hasta el objetivo sin repetir y conserva las propias primero', () => {
    const round = fillRound(authored, pool, 'seed');
    expect(round).toHaveLength(10);
    expect(round[0]).toBe(authored[0]);
    expect(new Set(round.map((question) => question.prompt)).size).toBe(10);
  });

  test('es determinista para la misma semilla', () => {
    expect(fillRound(authored, pool, 'seed')).toEqual(fillRound(authored, pool, 'seed'));
  });

  test('no toca una ronda que ya tiene suficientes preguntas', () => {
    const full = pool.slice(0, 10);
    expect(fillRound(full, pool, 'seed')).toBe(full);
  });
});
