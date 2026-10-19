import {
  MAX_TIMELINE,
  appendEvent,
  groupByDay,
  journeySections,
  lowMoodStreak,
  milestones,
  regiStageFor,
  weekSummary,
  weeklyTrend,
  type TimelineEvent,
} from '@/lib/timeline';

/** Fecha local a mediodía, para que los tests no dependan de la zona horaria. */
const day = (d: number, hour = 12): string => new Date(2026, 9, d, hour, 0, 0).toISOString();
const NOW = new Date(2026, 9, 19, 18, 0, 0);

let counter = 0;
const lesson = (at: string, minutes = 2): TimelineEvent => ({ id: `l${(counter += 1)}`, at, kind: 'lesson', moduleId: 'freno', stage: 0, minutes, score: 1 });
const resisted = (at: string): TimelineEvent => ({ id: `i${(counter += 1)}`, at, kind: 'impulse', status: 'resisted', label: 'Comprar' });
const mood = (at: string, value: 1 | 2 | 3 | 4 | 5): TimelineEvent => ({ id: `m${(counter += 1)}`, at, kind: 'mood', value });

describe('appendEvent', () => {
  test('agrega al final sin mutar la lista original', () => {
    const list: readonly TimelineEvent[] = [lesson(day(1))];
    const next = appendEvent(list, lesson(day(2)));
    expect(next).toHaveLength(2);
    expect(list).toHaveLength(1);
  });

  test(`conserva como máximo ${MAX_TIMELINE} eventos, descartando los más antiguos`, () => {
    const full = Array.from({ length: MAX_TIMELINE }, (_, index) => ({ ...lesson(day(1)), id: `old-${index}` }));
    const next = appendEvent(full, { ...lesson(day(2)), id: 'nuevo' });
    expect(next).toHaveLength(MAX_TIMELINE);
    expect(next[0].id).toBe('old-1');
    expect(next[next.length - 1].id).toBe('nuevo');
  });
});

describe('groupByDay', () => {
  test('agrupa por día local, del más reciente al más antiguo', () => {
    const groups = groupByDay([lesson(day(10, 9)), lesson(day(12, 9)), lesson(day(10, 20))]);
    expect(groups.map((group) => group.day)).toEqual(['2026-10-12', '2026-10-10']);
    expect(groups[1].events).toHaveLength(2);
    // Dentro del día, el evento más reciente primero.
    expect(new Date(groups[1].events[0].at).getHours()).toBe(20);
  });

  test('sin eventos devuelve una lista vacía', () => {
    expect(groupByDay([])).toEqual([]);
  });
});

describe('milestones', () => {
  test('detecta la primera lección', () => {
    expect(milestones([lesson(day(1))]).map((item) => item.id)).toContain('first-lesson');
  });

  test('detecta "¡Primera semana!" con 7 días activos distintos', () => {
    const events = [1, 2, 3, 5, 8, 9, 11].map((d) => lesson(day(d)));
    const found = milestones(events).find((item) => item.id === 'first-week');
    expect(found?.at).toBe(events[6].at);
  });

  test('detecta 10 impulsos frenados en el momento del décimo', () => {
    const events = Array.from({ length: 10 }, (_, index) => resisted(day(index + 1)));
    const found = milestones(events).find((item) => item.id === 'resisted-10');
    expect(found?.at).toBe(events[9].at);
  });

  test('detecta una racha de 3 días seguidos', () => {
    expect(milestones([lesson(day(4)), lesson(day(5)), lesson(day(6))]).map((item) => item.id)).toContain('streak-3');
    expect(milestones([lesson(day(4)), lesson(day(6)), lesson(day(8))]).map((item) => item.id)).not.toContain('streak-3');
  });

  test('sin eventos no hay hitos', () => {
    expect(milestones([])).toEqual([]);
  });
});

describe('weekSummary', () => {
  test('suma minutos, impulsos frenados y promedia el ánimo de los últimos 7 días', () => {
    const events = [lesson(day(18), 3), lesson(day(19), 2), resisted(day(17)), mood(day(16), 2), mood(day(18), 4), lesson(day(5), 30)];
    const summary = weekSummary(events, NOW);
    expect(summary.minutes).toBe(5);
    expect(summary.impulsesResisted).toBe(1);
    expect(summary.moodAverage).toBe(3);
    expect(summary.days).toHaveLength(7);
    expect(summary.days[6].day).toBe('2026-10-19');
    expect(summary.days[6].minutes).toBe(2);
  });

  test('sin ánimo registrado el promedio es null', () => {
    expect(weekSummary([], NOW).moodAverage).toBeNull();
  });
});

describe('weeklyTrend', () => {
  test('"new" si no hay actividad en ninguna de las dos semanas', () => {
    expect(weeklyTrend([], NOW)).toBe('new');
  });

  test('"up" si esta semana practicó más que la anterior', () => {
    expect(weeklyTrend([lesson(day(18), 10), lesson(day(10), 2)], NOW)).toBe('up');
  });

  test('"down" si esta semana practicó bastante menos', () => {
    expect(weeklyTrend([lesson(day(18), 2), lesson(day(10), 20)], NOW)).toBe('down');
  });

  test('"steady" si practicó parecido', () => {
    expect(weeklyTrend([lesson(day(18), 10), lesson(day(10), 10)], NOW)).toBe('steady');
  });
});

describe('lowMoodStreak', () => {
  test('cuenta los días seguidos (hasta hoy) con ánimo bajo', () => {
    const events = [mood(day(17), 2), mood(day(18), 1), mood(day(19), 2)];
    expect(lowMoodStreak(events, NOW)).toBe(3);
  });

  test('un día con buen ánimo corta la racha', () => {
    expect(lowMoodStreak([mood(day(17), 1), mood(day(18), 4), mood(day(19), 2)], NOW)).toBe(1);
  });

  test('usa el último registro de cada día', () => {
    expect(lowMoodStreak([mood(day(19, 9), 1), mood(day(19, 17), 5)], NOW)).toBe(0);
  });
});

describe('regiStageFor', () => {
  test('evoluciona por XP: cría, juvenil, adulto y sabio', () => {
    expect(regiStageFor(0)).toBe('cria');
    expect(regiStageFor(199)).toBe('cria');
    expect(regiStageFor(200)).toBe('juvenil');
    expect(regiStageFor(800)).toBe('adulto');
    expect(regiStageFor(2000)).toBe('sabio');
    expect(regiStageFor(Number.NaN)).toBe('cria');
  });
});

describe('journeySections', () => {
  test('mezcla eventos e hitos por día, del más reciente al más antiguo', () => {
    const sections = journeySections([lesson(day(3)), lesson(day(5))]);
    expect(sections.map((section) => section.day)).toEqual(['2026-10-05', '2026-10-03']);
    const firstDay = sections[1].data.map((item) => item.type);
    expect(firstDay).toContain('milestone');
    expect(firstDay).toContain('event');
  });

  test('sin eventos no hay secciones', () => {
    expect(journeySections([])).toEqual([]);
  });
});
