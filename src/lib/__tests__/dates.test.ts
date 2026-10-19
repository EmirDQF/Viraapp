import { dayTitle, timeOf, weekdayInitial } from '@/lib/dates';

const NOW = new Date(2026, 9, 19, 18, 0, 0);

describe('fechas en español', () => {
  test('hoy, ayer y fechas largas', () => {
    expect(dayTitle('2026-10-19', NOW)).toBe('Hoy');
    expect(dayTitle('2026-10-18', NOW)).toBe('Ayer');
    expect(dayTitle('2026-10-12', NOW)).toBe('lunes 12 de octubre');
  });

  test('inicial del día de la semana', () => {
    expect(weekdayInitial('2026-10-19')).toBe('L');
    expect(weekdayInitial('2026-10-21')).toBe('X');
  });

  test('hora local con dos dígitos', () => {
    expect(timeOf(new Date(2026, 9, 19, 8, 5).toISOString())).toBe('08:05');
  });
});
