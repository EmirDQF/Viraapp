import { shuffleQuestion } from '@/lib/quiz';

const question = { prompt: '¿Cuál?', options: ['correcta', 'b', 'c'], answer: 0, why: 'porque' };

describe('shuffleQuestion', () => {
  test('la respuesta sigue apuntando a la opción correcta', () => {
    const shuffled = shuffleQuestion(question, 'semilla');
    expect(shuffled.options[shuffled.answer]).toBe('correcta');
    expect([...shuffled.options].sort()).toEqual([...question.options].sort());
  });

  test('es determinista para la misma semilla y no muta la original', () => {
    expect(shuffleQuestion(question, 'x')).toEqual(shuffleQuestion(question, 'x'));
    expect(question.options).toEqual(['correcta', 'b', 'c']);
    expect(question.answer).toBe(0);
  });

  test('reparte la posición de la respuesta entre semillas distintas', () => {
    const positions = new Set(Array.from({ length: 30 }, (_, index) => shuffleQuestion(question, `s${index}`).answer));
    expect(positions.size).toBeGreaterThan(1);
  });
});
