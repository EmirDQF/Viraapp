export const MIN_AGE = 18;
export const MAX_AGE = 40;

export interface DateParts {
  readonly day: string;
  readonly month: string;
  readonly year: string;
}

export type AgeValidation =
  | { readonly valid: true; readonly age: number; readonly isoDate: string }
  | { readonly valid: false; readonly reason: string };

const pad = (value: number): string => String(value).padStart(2, '0');

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function calculateAge(birth: Date, today: Date): number {
  const age = today.getFullYear() - birth.getFullYear();
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  return hadBirthday ? age : age - 1;
}

function parseParts(parts: DateParts): Date | null {
  if (!/^\d{1,2}$/.test(parts.day) || !/^\d{1,2}$/.test(parts.month) || !/^\d{4}$/.test(parts.year)) {
    return null;
  }
  const day = Number(parts.day);
  const month = Number(parts.month);
  const year = Number(parts.year);
  const date = new Date(year, month - 1, day);
  const isRealDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate ? date : null;
}

export function validateBirthDate(parts: DateParts, today: Date = new Date()): AgeValidation {
  if (!parts.day || !parts.month || parts.year.length < 4) {
    return { valid: false, reason: 'Completa día, mes y año (AAAA).' };
  }
  const birth = parseParts(parts);
  if (!birth) {
    return { valid: false, reason: 'Esa fecha no existe. Revisa día y mes.' };
  }
  if (birth.getTime() > today.getTime()) {
    return { valid: false, reason: 'La fecha no puede estar en el futuro.' };
  }
  const age = calculateAge(birth, today);
  if (age < MIN_AGE) {
    return { valid: false, reason: `TENAZ está diseñada para personas de ${MIN_AGE} a ${MAX_AGE} años. Tienes ${age}.` };
  }
  if (age > MAX_AGE) {
    return { valid: false, reason: `Este programa está calibrado para ${MIN_AGE}–${MAX_AGE} años. Tienes ${age}.` };
  }
  return { valid: true, age, isoDate: toIsoDate(birth) };
}
