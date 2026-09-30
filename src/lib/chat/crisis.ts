/**
 * Detección simple de señales de riesgo (autolesión o suicidio) en lo que escribe el usuario.
 * Es deliberadamente sensible: ante la duda, mostramos líneas de ayuda. No es un diagnóstico.
 */

/** Frases de riesgo ya normalizadas (minúsculas, sin tildes). */
const RISK_PHRASES: readonly string[] = [
  'suicid',
  'quitarme la vida',
  'no quiero vivir',
  'no quiero seguir viviendo',
  'no quiero seguir vivo',
  'no quiero seguir viva',
  'ya no quiero estar aqui',
  'quiero morir',
  'quisiera morir',
  'quiero morirme',
  'matarme',
  'me quiero matar',
  'hacerme dano',
  'lastimarme',
  'autolesi',
  'cortarme las venas',
  'desaparecer para siempre',
  'acabar con todo',
  'no vale la pena vivir',
];

/** Patrones que necesitan límites de palabra para no confundir frases cotidianas ("cortar con mi pareja"). */
const RISK_PATTERNS: readonly RegExp[] = [/\bme corto\b/];

const LEET: Readonly<Record<string, string>> = { '4': 'a', '@': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', $: 's', '7': 't' };
const MIN_SPACED_LETTERS = 3;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[4@3105$7]/g, (char) => LEET[char] ?? char)
    .replace(/\s+/g, ' ')
    .trim();
}

const compact = (text: string): string => text.replace(/[^a-zñ]/g, '');

/** "q u i e r o  m o r i r": varias letras sueltas separadas por espacios. */
function hasSpacedLetters(text: string): boolean {
  return (text.match(/\b[a-zñ]\b/g) ?? []).length >= MIN_SPACED_LETTERS;
}

export function detectCrisis(text: string): boolean {
  const normalized = normalize(text);
  if (RISK_PHRASES.some((phrase) => normalized.includes(phrase))) return true;
  if (RISK_PATTERNS.some((pattern) => pattern.test(normalized))) return true;
  if (!hasSpacedLetters(normalized)) return false;
  const joined = compact(normalized);
  return RISK_PHRASES.some((phrase) => joined.includes(compact(phrase)));
}

/** La respuesta de Regi remite a líneas de ayuda: también mostramos la tarjeta de crisis. */
export function mentionsHelpline(reply: string): boolean {
  const normalized = reply.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return /\b113\b|\b106\b|linea de ayuda/.test(normalized);
}
