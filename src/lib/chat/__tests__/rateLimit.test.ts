import { createRateLimiter } from '@/lib/chat/rateLimit';

describe('createRateLimiter', () => {
  test('permite hasta el límite dentro de la ventana y luego bloquea', () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect(limiter.check('ip', 0).allowed).toBe(true);
    expect(limiter.check('ip', 100).allowed).toBe(true);
    expect(limiter.check('ip', 200).allowed).toBe(true);
    const blocked = limiter.check('ip', 300);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(700);
  });

  test('libera cupo cuando pasa la ventana', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check('ip', 0).allowed).toBe(true);
    expect(limiter.check('ip', 999).allowed).toBe(false);
    expect(limiter.check('ip', 1000).allowed).toBe(true);
  });

  test('cada clave tiene su propio cupo', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check('a', 0).allowed).toBe(true);
    expect(limiter.check('b', 0).allowed).toBe(true);
  });
});
