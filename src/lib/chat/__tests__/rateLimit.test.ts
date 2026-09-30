import { clientKey, createRateLimiter } from '@/lib/chat/rateLimit';

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

  test('clientKey solo confía en X-Forwarded-For si se indica que hay un proxy de confianza', () => {
    const request = new Request('http://x/api/chat', { headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } });
    expect(clientKey(request, false)).toBe('anonymous');
    expect(clientKey(request, true)).toBe('1.2.3.4');
  });

  test('cada clave tiene su propio cupo', () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check('a', 0).allowed).toBe(true);
    expect(limiter.check('b', 0).allowed).toBe(true);
  });
});
