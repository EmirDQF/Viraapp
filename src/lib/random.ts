/** Aleatoriedad determinista (mulberry32) para que juegos y tests sean reproducibles. */

export type Random = () => number;

export function seededRandom(seed: number): Random {
  let state = Math.trunc(seed) || 1;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Semilla estable a partir de un texto (hash FNV-1a). */
export function seedFrom(text: string): number {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function randomInt(random: Random, maxExclusive: number): number {
  return Math.floor(random() * maxExclusive);
}
