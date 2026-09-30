/**
 * Enlaces web de Explorar: solo HTTPS y solo dominios oficiales o de salud pública conocidos.
 * Si un enlace no pasa el filtro, la app no lo abre.
 */
export const TRUSTED_HOSTS: readonly string[] = ['who.int', 'paho.org', 'gob.pe', 'medlineplus.gov'];

export function isTrustedUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || url.username !== '' || url.password !== '') return false;
  const host = url.hostname.toLowerCase();
  return TRUSTED_HOSTS.some((trusted) => host === trusted || host.endsWith(`.${trusted}`));
}

/** Nombre corto del sitio para mostrar junto al enlace (p. ej. "who.int"). */
export function displayHost(value: string): string {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}
