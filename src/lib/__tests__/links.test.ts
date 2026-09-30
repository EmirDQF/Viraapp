import { RESOURCES, TOPICS } from '@/data/explore';
import { displayHost, isTrustedUrl } from '@/lib/links';

describe('enlaces confiables', () => {
  test('todos los enlaces de Explorar pasan el filtro', () => {
    const urls = [...Object.values(TOPICS).map((topic) => topic.link.url), ...RESOURCES.map((link) => link.url)];
    expect(urls.filter((url) => !isTrustedUrl(url))).toEqual([]);
  });

  test('acepta HTTPS de dominios oficiales y sus subdominios', () => {
    expect(isTrustedUrl('https://www.who.int/es/news-room')).toBe(true);
    expect(isTrustedUrl('https://medlineplus.gov/spanish/stress.html')).toBe(true);
    expect(isTrustedUrl('https://www.gob.pe/555')).toBe(true);
  });

  test('rechaza HTTP, otros esquemas y URLs inválidas', () => {
    expect(isTrustedUrl('http://www.who.int')).toBe(false);
    expect(isTrustedUrl('javascript:alert(1)')).toBe(false);
    expect(isTrustedUrl('no es una url')).toBe(false);
  });

  test('rechaza dominios que solo imitan a uno confiable', () => {
    expect(isTrustedUrl('https://who.int.evil.com')).toBe(false);
    expect(isTrustedUrl('https://notwho.int')).toBe(false);
    expect(isTrustedUrl('https://user:pass@www.who.int')).toBe(false);
  });

  test('muestra el dominio sin www', () => {
    expect(displayHost('https://www.paho.org/es')).toBe('paho.org');
    expect(displayHost('::')).toBe('');
  });
});
