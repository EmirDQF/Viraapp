import { CRUCIBLES } from '../../data/crucibles';
import { griefCrucible } from '../../data/crucibles/grief';
import { buildActionPlan, formatPlanDate, formatPlanText } from '../plan';

const start = new Date(2026, 8, 22); // martes 22 sep 2026

describe('formatPlanDate', () => {
  it('formatea en español', () => {
    expect(formatPlanDate(start)).toBe('Mar 22 sep');
  });
});

describe('buildActionPlan', () => {
  it('usa mantra, reglas y micro-acción del usuario', () => {
    const plan = buildActionPlan(
      griefCrucible,
      {
        completedModules: [],
        mantra: 'Las olas pasan; yo me quedo.',
        microAction: { challengeId: 'gmc2', commitment: 'Escribirle a mi hermana' },
        ruleIds: ['gr2', 'gr5', 'gr6'],
      },
      start,
    );
    expect(plan.mantra).toBe('Las olas pasan; yo me quedo.');
    expect(plan.rules).toEqual([
      'No escribo mensajes importantes después de las 11 p.m.',
      'Me permito llorar sin pedirme perdón.',
      'No tomo decisiones definitivas en la peor noche.',
    ]);
    expect(plan.schedule).toHaveLength(7);
    expect(plan.schedule[0].action).toBe('Mensaje de conexión: Escribirle a mi hermana');
    expect(plan.schedule[6].dateLabel).toBe('Lun 28 sep');
  });

  it('aplica valores por defecto si faltan respuestas', () => {
    const plan = buildActionPlan(griefCrucible, { completedModules: [] }, start);
    expect(plan.mantra).toBe(griefCrucible.content.mantras[0]);
    expect(plan.rules).toHaveLength(3);
    expect(plan.schedule[0].action).toBe(griefCrucible.content.weeklyActions[0]);
  });
});

describe('formatPlanText', () => {
  it('incluye mantra, reglas numeradas y los 7 días', () => {
    const plan = buildActionPlan(griefCrucible, { completedModules: [], reframe: 'La relación terminó...' }, start);
    const text = formatPlanText(plan, 'Alex');
    expect(text).toContain('Alex · Duelo & Quiebre Emocional');
    expect(text).toContain(`MANTRA: "${griefCrucible.content.mantras[0]}"`);
    expect(text).toContain('PENSAMIENTO REALISTA: La relación terminó...');
    expect(text).toContain('1. ');
    expect(text.match(/^• /gm)).toHaveLength(7);
  });
});

describe('integridad del contenido', () => {
  it.each(CRUCIBLES.map((c) => [c.id, c] as const))('%s tiene contenido completo', (_, crucible) => {
    const { content } = crucible;
    expect(content.sortCards.length).toBeGreaterThanOrEqual(6);
    expect(content.distortions.length).toBeGreaterThanOrEqual(2);
    content.distortions.forEach((d) => expect(d.options).toContain(d.correct));
    const blockIds = content.reframe.blocks.map((b) => b.id);
    content.reframe.correctOrder.forEach((id) => expect(blockIds).toContain(id));
    expect(content.mantras.length).toBeGreaterThanOrEqual(3);
    expect(content.microChallenges.length).toBeGreaterThanOrEqual(3);
    expect(content.rules.length).toBeGreaterThanOrEqual(3);
    expect(content.weeklyActions).toHaveLength(7);
  });
});
