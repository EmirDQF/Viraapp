/**
 * Detección simple de señales de riesgo (autolesión o suicidio) en lo que escribe el usuario.
 * Es deliberadamente sensible: ante la duda, mostramos líneas de ayuda. No es un diagnóstico.
 */

const RISK_PATTERNS: readonly RegExp[] = [
  /suicid/,
  /quitarme la vida/,
  /no quiero (seguir )?vivir/,
  /ya no quiero (estar|seguir) (aqui|vivo|viva)/,
  /(quiero|quisiera|me quiero) morir/,
  /(quiero|voy a|pienso en) matarme/,
  /me quiero matar/,
  /hacerme dano/,
  /lastimarme/,
  /autolesi/,
  /\bme corto\b/,
  /cortarme (las venas|los brazos|las munecas)/,
  /desaparecer para siempre/,
  /acabar con todo/,
  /no vale la pena vivir/,
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

export function detectCrisis(text: string): boolean {
  const normalized = normalize(text);
  return RISK_PATTERNS.some((pattern) => pattern.test(normalized));
}
