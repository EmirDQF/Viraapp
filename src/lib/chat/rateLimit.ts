/** Limitador de peticiones en memoria (ventana deslizante) para la ruta de chat del servidor. */

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfterMs: number;
}

export interface RateLimiter {
  check: (key: string, now?: number) => RateLimitResult;
}

interface Options {
  readonly limit: number;
  readonly windowMs: number;
}

/** Máximo de claves recordadas, para que la memoria no crezca sin límite. */
const MAX_KEYS = 5000;

export function createRateLimiter({ limit, windowMs }: Options): RateLimiter {
  const hits = new Map<string, readonly number[]>();
  return {
    check(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { allowed: false, retryAfterMs: windowMs - (now - recent[0]) };
      }
      if (!hits.has(key) && hits.size >= MAX_KEYS) {
        const oldest = hits.keys().next().value;
        if (oldest !== undefined) hits.delete(oldest);
      }
      hits.set(key, [...recent, now]);
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}
