import { calculateAge, validateBirthDate } from '../age';

const today = new Date(2026, 8, 22); // 22 sep 2026

describe('calculateAge', () => {
  it('resta un año si el cumpleaños aún no llegó', () => {
    expect(calculateAge(new Date(2000, 11, 1), today)).toBe(25);
  });

  it('cuenta el año cuando el cumpleaños es hoy', () => {
    expect(calculateAge(new Date(2000, 8, 22), today)).toBe(26);
  });
});

describe('validateBirthDate', () => {
  it('acepta una edad dentro del rango 18-40', () => {
    const result = validateBirthDate({ day: '15', month: '3', year: '1998' }, today);
    expect(result).toEqual({ valid: true, age: 28, isoDate: '1998-03-15' });
  });

  it('rechaza menores de 18', () => {
    const result = validateBirthDate({ day: '23', month: '9', year: '2008' }, today);
    expect(result.valid).toBe(false);
  });

  it('acepta exactamente 18 años el día del cumpleaños', () => {
    expect(validateBirthDate({ day: '22', month: '9', year: '2008' }, today).valid).toBe(true);
  });

  it('rechaza mayores de 40', () => {
    expect(validateBirthDate({ day: '1', month: '1', year: '1980' }, today).valid).toBe(false);
  });

  it('rechaza fechas inexistentes', () => {
    const result = validateBirthDate({ day: '31', month: '2', year: '2000' }, today);
    expect(result).toEqual({ valid: false, reason: 'Esa fecha no existe. Revisa día y mes.' });
  });

  it('pide completar cuando faltan campos', () => {
    expect(validateBirthDate({ day: '', month: '5', year: '2000' }, today).valid).toBe(false);
  });

  it('rechaza fechas futuras', () => {
    expect(validateBirthDate({ day: '1', month: '1', year: '2030' }, today).valid).toBe(false);
  });
});
