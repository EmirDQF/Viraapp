import { TECHNIQUES, isTechniqueId } from '@/data/techniques';
import { recommendTechnique, type RecommendInput } from '@/lib/recommend';

const base: RecommendInput = { need: null, mood: null, recentImpulses: 0, focusAreas: [], hour: 15, intensity: null };

describe('recommendTechnique', () => {
  test('siempre devuelve una técnica válida con su motivo', () => {
    const result = recommendTechnique(base);
    expect(isTechniqueId(result.technique)).toBe(true);
    expect(result.reason.length).toBeGreaterThan(10);
  });

  test('ante un impulso intenso sugiere una técnica para frenar impulsos', () => {
    const result = recommendTechnique({ ...base, need: 'impulso', intensity: 9 });
    expect(TECHNIQUES[result.technique].needs).toContain('impulso');
  });

  test('con ansiedad sugiere una técnica de calma', () => {
    const result = recommendTechnique({ ...base, need: 'ansiedad' });
    expect(TECHNIQUES[result.technique].needs).toContain('ansiedad');
  });

  test('con mucha intensidad prioriza técnicas cortas de cuerpo (respiración o STOP) sobre las de pensar', () => {
    const result = recommendTechnique({ ...base, need: 'pensamientos', intensity: 10 });
    expect(['stop', 'respiracion-478', 'respiracion-cuadrada', 'grounding', 'contar-10']).toContain(result.technique);
  });

  test('con ánimo bajo y sin necesidad declarada sugiere algo amable para la tristeza', () => {
    const result = recommendTechnique({ ...base, mood: 1 });
    expect(TECHNIQUES[result.technique].needs).toContain('tristeza');
  });

  test('si hubo varios impulsos recientes, el foco pasa a frenar impulsos', () => {
    const result = recommendTechnique({ ...base, recentImpulses: 4 });
    expect(TECHNIQUES[result.technique].needs).toContain('impulso');
  });

  test('de noche evita técnicas largas de resolver problemas', () => {
    const result = recommendTechnique({ ...base, need: 'frustracion', hour: 23 });
    expect(result.technique).not.toBe('problemas');
  });

  test('usa el foco del usuario cuando no hay otra señal', () => {
    const result = recommendTechnique({ ...base, focusAreas: ['relaciones'] });
    expect(TECHNIQUES[result.technique].needs).toContain('conflicto');
  });

  test('es determinista', () => {
    const input = { ...base, need: 'enojo' as const, intensity: 6 };
    expect(recommendTechnique(input)).toEqual(recommendTechnique(input));
  });
});
