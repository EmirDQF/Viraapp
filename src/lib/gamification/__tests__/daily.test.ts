import { addPracticeMinutes, dailyGoalProgress, minutesToday } from '@/lib/gamification/daily';

const today = new Date(2026, 8, 29, 18, 0);

describe('meta diaria', () => {
  test('suma minutos al mismo día', () => {
    const next = addPracticeMinutes({ date: '2026-09-29', minutes: 4 }, 3, today);
    expect(next).toEqual({ date: '2026-09-29', minutes: 7 });
  });

  test('reinicia el contador al cambiar de día', () => {
    const next = addPracticeMinutes({ date: '2026-09-28', minutes: 12 }, 2, today);
    expect(next).toEqual({ date: '2026-09-29', minutes: 2 });
  });

  test('ignora minutos negativos o inválidos', () => {
    expect(addPracticeMinutes({ date: null, minutes: 0 }, -5, today)).toEqual({ date: '2026-09-29', minutes: 0 });
    expect(addPracticeMinutes({ date: null, minutes: 0 }, Number.NaN, today)).toEqual({ date: '2026-09-29', minutes: 0 });
  });

  test('los minutos de otro día cuentan como 0 hoy', () => {
    expect(minutesToday({ date: '2026-09-28', minutes: 9 }, today)).toBe(0);
    expect(minutesToday({ date: '2026-09-29', minutes: 9 }, today)).toBe(9);
  });

  test('el progreso de la meta se limita a 1', () => {
    expect(dailyGoalProgress({ date: '2026-09-29', minutes: 5 }, 10, today)).toBe(0.5);
    expect(dailyGoalProgress({ date: '2026-09-29', minutes: 30 }, 10, today)).toBe(1);
  });
});
