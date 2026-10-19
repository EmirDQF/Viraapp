import { REGI_LINES, TAP_LINES, TREND_LINES, allRegiLines, blinkDelay, pickRegiLine } from '@/data/regiLines';

describe('banco de frases de Regi', () => {
  test('tiene al menos 40 frases distintas', () => {
    const lines = allRegiLines();
    expect(lines.length).toBeGreaterThanOrEqual(40);
    expect(new Set(lines).size).toBe(lines.length);
  });

  test('hay frases para cada momento del día, racha y tendencia', () => {
    expect(REGI_LINES.morning.length).toBeGreaterThan(0);
    expect(REGI_LINES.afternoon.length).toBeGreaterThan(0);
    expect(REGI_LINES.night.length).toBeGreaterThan(0);
    expect(REGI_LINES.streak.length).toBeGreaterThan(0);
    expect(TAP_LINES.length).toBeGreaterThanOrEqual(5);
    expect(Object.keys(TREND_LINES)).toEqual(['new', 'up', 'steady', 'down']);
  });
});

describe('pickRegiLine', () => {
  test('es determinista para la misma semilla', () => {
    const input = { hour: 9, streak: 0, focusAreas: [], seed: 3 };
    expect(pickRegiLine(input)).toBe(pickRegiLine(input));
  });

  test('de noche nunca elige frases de la mañana', () => {
    Array.from({ length: 20 }, (_, seed) => pickRegiLine({ hour: 23, streak: 0, focusAreas: [], seed })).forEach((line) => {
      expect(REGI_LINES.morning).not.toContain(line);
    });
  });

  test('con racha puede mencionar los días de racha', () => {
    const lines = Array.from({ length: 40 }, (_, seed) => pickRegiLine({ hour: 15, streak: 5, focusAreas: [], seed }));
    expect(lines.some((line) => line.includes('5 días'))).toBe(true);
  });

  test('con foco puede elegir una frase de su área', () => {
    const lines = Array.from({ length: 40 }, (_, seed) => pickRegiLine({ hour: 15, streak: 0, focusAreas: ['ansiedad'], seed }));
    expect(lines.some((line) => REGI_LINES.focus.ansiedad.includes(line))).toBe(true);
  });
});

describe('blinkDelay', () => {
  test('siempre entre 3 y 6 segundos', () => {
    [0, 0.25, 0.5, 0.999, 1.5, -1].forEach((value) => {
      const delay = blinkDelay(() => value);
      expect(delay).toBeGreaterThanOrEqual(3000);
      expect(delay).toBeLessThanOrEqual(6000);
    });
  });
});
