import { NAME_MAX, validateName } from '@/lib/validation';

describe('validateName', () => {
  test('acepta nombres y alias normales, con tildes y espacios', () => {
    expect(validateName('Ana')).toBeNull();
    expect(validateName('  José Luis  ')).toBeNull();
    expect(validateName('Mar_07')).toBeNull();
  });

  test('pide al menos 2 caracteres', () => {
    expect(validateName(' a ')).toBe('Escribe al menos 2 caracteres.');
  });

  test('limita la longitud', () => {
    expect(validateName('a'.repeat(NAME_MAX + 1))).toBe(`Máximo ${NAME_MAX} caracteres.`);
  });

  test('rechaza símbolos que podrían inyectar marcado', () => {
    expect(validateName('<script>')).toBe('Usa solo letras, números y espacios.');
    expect(validateName('ana@mail')).toBe('Usa solo letras, números y espacios.');
  });
});
