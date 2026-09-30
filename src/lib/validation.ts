/** Validaciones de entrada del usuario (se aplican antes de guardar nada). */

export const NAME_MIN = 2;
export const NAME_MAX = 24;
const FORBIDDEN_NAME_CHARS = /[<>{}[\]\\/@#$%^*=+|~`]/;

/** Devuelve un mensaje de error amable, o null si el nombre es válido. */
export function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < NAME_MIN) return `Escribe al menos ${NAME_MIN} caracteres.`;
  if (trimmed.length > NAME_MAX) return `Máximo ${NAME_MAX} caracteres.`;
  if (FORBIDDEN_NAME_CHARS.test(trimmed)) return 'Usa solo letras, números y espacios.';
  return null;
}
