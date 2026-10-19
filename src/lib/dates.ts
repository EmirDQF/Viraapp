/** Nombres de días y meses en español (sin depender de Intl, que varía entre plataformas). */
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const;
const WEEKDAY_INITIALS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'] as const;
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'] as const;

/** Fecha local a partir de "yyyy-mm-dd" (a mediodía, para evitar saltos por zona horaria). */
function fromDay(day: string): Date {
  return new Date(`${day}T12:00:00`);
}

/** "Hoy", "Ayer" o "lunes 19 de octubre". */
export function dayTitle(day: string, now: Date = new Date()): string {
  const date = fromDay(day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const diff = Math.round((today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

/** Inicial del día de la semana ("L", "M", "X"…). */
export function weekdayInitial(day: string): string {
  return WEEKDAY_INITIALS[fromDay(day).getDay()];
}

export function weekdayName(day: string): string {
  return WEEKDAYS[fromDay(day).getDay()];
}

/** "18:05" a partir de una marca ISO, en hora local. */
export function timeOf(iso: string): string {
  const date = new Date(iso);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
