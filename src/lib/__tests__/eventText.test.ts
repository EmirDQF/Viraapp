import { describeEvent } from '@/lib/eventText';
import type { TimelineEvent } from '@/lib/timeline';

const base = { id: 'x', at: '2026-10-19T10:00:00.000Z' };

describe('describeEvent', () => {
  test('lección: nombre del módulo y de la etapa', () => {
    const text = describeEvent({ ...base, kind: 'lesson', moduleId: 'freno', stage: 0, minutes: 2, score: 1 });
    expect(text.title).toContain('Freno de Mano');
    expect(text.detail).toContain('Etapa 1');
  });

  test('impulso frenado y cedido usan un tono distinto y amable', () => {
    expect(describeEvent({ ...base, kind: 'impulse', status: 'resisted', label: 'Comprar' }).title).toMatch(/Frenaste/);
    expect(describeEvent({ ...base, kind: 'impulse', status: 'gave_in', label: 'Comprar' }).detail).toMatch(/aprende/i);
  });

  test('SOS muestra cuánto bajó la intensidad', () => {
    const text = describeEvent({ ...base, kind: 'sos', technique: 'stop', before: 8, after: 4 });
    expect(text.detail).toBe('Bajaste de 8 a 4');
  });

  test('ánimo, técnica, insignia y caso', () => {
    expect(describeEvent({ ...base, kind: 'mood', value: 4 }).title).toContain('Bien');
    expect(describeEvent({ ...base, kind: 'technique', technique: 'grounding', minutes: 1 }).title).toContain('Grounding');
    expect(describeEvent({ ...base, kind: 'badge', label: 'module:freno' }).title).toContain('Freno de Mano');
    expect(describeEvent({ ...base, kind: 'case', caseId: 'coco-miguel' }).title).toContain('Miguel');
  });

  test('datos desconocidos no rompen la descripción', () => {
    expect(describeEvent({ ...base, kind: 'case', caseId: 'borrado' } as TimelineEvent).title).toBe('Caso resuelto');
    expect(describeEvent({ ...base, kind: 'badge', label: 'rara' }).title).toBe('Nueva insignia');
  });
});
