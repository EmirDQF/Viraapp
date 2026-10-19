import { TECHNIQUE_IDS, TECHNIQUES, breathPhase, isTechniqueId, techniqueSeconds } from '@/data/techniques';

describe('técnicas guiadas', () => {
  test.each(TECHNIQUE_IDS)('%s tiene pasos con duración y al menos una necesidad', (id) => {
    const technique = TECHNIQUES[id];
    expect(technique.id).toBe(id);
    expect(technique.steps.length).toBeGreaterThan(0);
    technique.steps.forEach((step) => expect(step.seconds).toBeGreaterThan(0));
    expect(technique.needs.length).toBeGreaterThan(0);
    expect(techniqueSeconds(id)).toBeLessThanOrEqual(120);
  });

  test('isTechniqueId valida ids', () => {
    expect(isTechniqueId('stop')).toBe(true);
    expect(isTechniqueId('inventada')).toBe(false);
  });

  test('breathPhase reconoce inhalar, sostener y exhalar', () => {
    expect(breathPhase('Inhala por la nariz')).toBe('in');
    expect(breathPhase('Sostén el aire')).toBe('hold');
    expect(breathPhase('Exhala despacio')).toBe('out');
    expect(breathPhase('Nombra 5 cosas')).toBeNull();
  });
});
