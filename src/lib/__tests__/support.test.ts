import { alertMessage, normalizePhone, smsUrl, whatsappUrl } from '@/lib/support';

describe('apoyo cercano', () => {
  test('normaliza teléfonos: solo dígitos y un + inicial', () => {
    expect(normalizePhone(' +51 987-654-321 ')).toBe('+51987654321');
    expect(normalizePhone('(01) 234 5678')).toBe('012345678');
    expect(normalizePhone('abc')).toBe('');
  });

  test('el mensaje de alerta es breve, directo y menciona que lo envía la persona', () => {
    const message = alertMessage('Ana');
    expect(message).toContain('Ana');
    expect(message).toContain('5 minutos');
    expect(alertMessage('')).not.toContain('soy ,');
  });

  test('arma el enlace de WhatsApp con el texto ya redactado', () => {
    expect(whatsappUrl('+51 987 654 321', 'Hola')).toBe('https://wa.me/51987654321?text=Hola');
    expect(whatsappUrl('987', 'a b')).toBe('https://wa.me/987?text=a%20b');
  });

  test('arma el enlace SMS para uno o varios contactos', () => {
    expect(smsUrl(['+51987', '+51988'], 'Hola')).toBe('sms:+51987,+51988?body=Hola');
  });
});
