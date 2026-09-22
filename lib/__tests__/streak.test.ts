import { registerActivity, visibleStreak } from '../streak';

const day = (d: number) => new Date(2026, 8, d);

describe('registerActivity', () => {
  it('inicia la racha en 1 la primera vez', () => {
    expect(registerActivity({ count: 0, lastActiveDate: null }, day(10))).toEqual({
      count: 1,
      lastActiveDate: '2026-09-10',
    });
  });

  it('no duplica actividad el mismo día', () => {
    const streak = { count: 3, lastActiveDate: '2026-09-10' };
    expect(registerActivity(streak, day(10))).toBe(streak);
  });

  it('suma 1 si la última actividad fue ayer', () => {
    expect(registerActivity({ count: 3, lastActiveDate: '2026-09-09' }, day(10)).count).toBe(4);
  });

  it('reinicia a 1 tras un día perdido', () => {
    expect(registerActivity({ count: 7, lastActiveDate: '2026-09-07' }, day(10)).count).toBe(1);
  });

  it('funciona al cruzar de mes', () => {
    expect(registerActivity({ count: 2, lastActiveDate: '2026-08-31' }, new Date(2026, 8, 1)).count).toBe(3);
  });
});

describe('visibleStreak', () => {
  it('muestra 0 si la racha se rompió', () => {
    expect(visibleStreak({ count: 5, lastActiveDate: '2026-09-07' }, day(10))).toBe(0);
  });

  it('mantiene la racha si la última actividad fue ayer', () => {
    expect(visibleStreak({ count: 5, lastActiveDate: '2026-09-09' }, day(10))).toBe(5);
  });
});
