import { createImpulse, formatCountdown, impulseStats, isDue, remainingMs, resolveImpulse } from '@/lib/impulses';

const now = new Date('2026-09-30T10:00:00.000Z');

describe('buzón de impulsos', () => {
  test('crea un impulso con su hora de fin', () => {
    const impulse = createImpulse('i1', '  Comprar zapatillas ', 20, now);
    expect(impulse).toEqual({
      id: 'i1',
      title: 'Comprar zapatillas',
      minutes: 20,
      createdAt: '2026-09-30T10:00:00.000Z',
      endsAt: '2026-09-30T10:20:00.000Z',
      status: 'waiting',
      resolvedAt: null,
      notificationId: null,
    });
  });

  test('limita los minutos a un rango razonable', () => {
    expect(createImpulse('a', 'x', 0, now).minutes).toBe(1);
    expect(createImpulse('a', 'x', 999, now).minutes).toBe(120);
  });

  test('calcula el tiempo restante y cuándo vence', () => {
    const impulse = createImpulse('i1', 'x', 20, now);
    expect(remainingMs(impulse, new Date('2026-09-30T10:05:00.000Z'))).toBe(15 * 60 * 1000);
    expect(remainingMs(impulse, new Date('2026-09-30T11:00:00.000Z'))).toBe(0);
    expect(isDue(impulse, new Date('2026-09-30T10:20:00.000Z'))).toBe(true);
  });

  test('formatea la cuenta regresiva en mm:ss', () => {
    expect(formatCountdown(19 * 60 * 1000 + 42 * 1000)).toBe('19:42');
    expect(formatCountdown(0)).toBe('00:00');
    expect(formatCountdown(-5)).toBe('00:00');
  });

  test('resolver no muta y registra la fecha', () => {
    const impulse = createImpulse('i1', 'x', 20, now);
    const resolved = resolveImpulse(impulse, 'resisted', now);
    expect(impulse.status).toBe('waiting');
    expect(resolved.status).toBe('resisted');
    expect(resolved.resolvedAt).toBe(now.toISOString());
  });

  test('estadísticas del historial', () => {
    const base = createImpulse('a', 'x', 5, now);
    const list = [
      resolveImpulse(base, 'resisted', now),
      resolveImpulse({ ...base, id: 'b' }, 'resisted', now),
      resolveImpulse({ ...base, id: 'c' }, 'gave_in', now),
      { ...base, id: 'd' },
    ];
    expect(impulseStats(list)).toEqual({ total: 4, waiting: 1, resisted: 2, gaveIn: 1, discarded: 0, resistRate: 2 / 3 });
    expect(impulseStats([]).resistRate).toBe(0);
  });
});
