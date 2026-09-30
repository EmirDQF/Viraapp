import { formatHour, reminderPlan, type ReminderInput } from '@/lib/reminders';

const now = new Date(2026, 8, 30, 10, 0, 0);
const base: ReminderInput = {
  dailyReminder: { enabled: false, hour: 19, minute: 0 },
  streakRisk: false,
  streak: { count: 3, lastActiveDate: '2026-09-29' },
  lastPracticeDate: '2026-09-29',
};

describe('plan de recordatorios', () => {
  test('sin ajustes activos no programa nada', () => {
    expect(reminderPlan(base, now)).toEqual({ daily: null, streakRisk: false });
  });

  test('programa el recordatorio diario a la hora elegida', () => {
    const plan = reminderPlan({ ...base, dailyReminder: { enabled: true, hour: 8, minute: 30 } }, now);
    expect(plan.daily).toEqual({ hour: 8, minute: 30 });
  });

  test('avisa de racha en riesgo si hay racha y hoy no practicaste', () => {
    expect(reminderPlan({ ...base, streakRisk: true }, now).streakRisk).toBe(true);
  });

  test('no avisa si ya practicaste hoy', () => {
    expect(reminderPlan({ ...base, streakRisk: true, lastPracticeDate: '2026-09-30' }, now).streakRisk).toBe(false);
  });

  test('no avisa si la racha ya se perdió', () => {
    const lost = { ...base, streakRisk: true, streak: { count: 5, lastActiveDate: '2026-09-20' } };
    expect(reminderPlan(lost, now).streakRisk).toBe(false);
  });

  test('formatea la hora con dos dígitos', () => {
    expect(formatHour(8)).toBe('08:00');
    expect(formatHour(21, 5)).toBe('21:05');
  });
});
