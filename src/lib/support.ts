/** Apoyo Cercano: mensajes y enlaces ya redactados. La app nunca envía nada sola: abre el mensaje para que la persona lo envíe. */

export const MAX_CONTACTS = 3;

export interface TrustedContact {
  readonly id: string;
  readonly name: string;
  readonly phone: string;
}

export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

export function alertMessage(name: string): string {
  const who = name.trim() ? `Hola, soy ${name.trim()}. ` : 'Hola. ';
  return `${who}Ando pasando un momento difícil. ¿Tienes 5 minutos para hablar? No hace falta que sea nada serio.`;
}

export function whatsappUrl(phone: string, text: string): string {
  return `https://wa.me/${normalizePhone(phone).replace('+', '')}?text=${encodeURIComponent(text)}`;
}

export function smsUrl(phones: readonly string[], text: string): string {
  return `sms:${phones.map(normalizePhone).join(',')}?body=${encodeURIComponent(text)}`;
}
