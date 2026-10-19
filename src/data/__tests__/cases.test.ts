import { CASES, CASE_QUESTION_TITLES, getCase, validateCases } from '@/data/cases';

describe('Laboratorio de casos', () => {
  test('tiene entre 6 y 8 casos con ids únicos', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(6);
    expect(CASES.length).toBeLessThanOrEqual(8);
    expect(new Set(CASES.map((study) => study.id)).size).toBe(CASES.length);
  });

  test('cada caso responde las 4 preguntas del curso, en orden', () => {
    CASES.forEach((study) => {
      expect(study.questions.map((question) => question.prompt)).toEqual([...CASE_QUESTION_TITLES]);
    });
  });

  test('todas las respuestas correctas existen entre las opciones', () => {
    CASES.flatMap((study) => study.questions).forEach((question) => {
      expect(question.options[question.answer]).toBeDefined();
    });
  });

  test('la respuesta correcta no queda siempre en la misma posición', () => {
    const positions = new Set(CASES.flatMap((study) => study.questions.map((question) => question.answer)));
    expect(positions.size).toBeGreaterThan(1);
  });

  test('cada caso trae retroalimentación de Regi y un mini reto', () => {
    CASES.forEach((study) => {
      expect(study.feedback.length).toBeGreaterThan(20);
      expect(study.challenge.length).toBeGreaterThan(20);
    });
  });

  test('getCase busca por id y devuelve undefined si no existe', () => {
    expect(getCase(CASES[0].id)).toBe(CASES[0]);
    expect(getCase('no-existe')).toBeUndefined();
  });

  test('validateCases rechaza un caso mal formado', () => {
    expect(() => validateCases([{ ...CASES[0], id: 'Con Espacios' }])).toThrow(/inválido/);
  });
});
