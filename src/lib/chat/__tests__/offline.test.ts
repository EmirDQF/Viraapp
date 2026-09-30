import { CRISIS_REPLY, offlineReply } from '@/lib/chat/offline';

describe('offlineReply', () => {
  test('responde con contención ante señales de crisis', () => {
    expect(offlineReply('no quiero vivir', 0)).toBe(CRISIS_REPLY);
  });

  test('reconoce el estrés académico y guía con una pregunta', () => {
    const reply = offlineReply('mañana tengo examen y estoy muy nervioso', 0);
    expect(reply).toContain('?');
    expect(reply.toLowerCase()).toContain('examen');
  });

  test('sin tema reconocido, sigue las etapas: entender, recursos, siguiente paso', () => {
    expect(offlineReply('hola', 0)).not.toBe(offlineReply('hola', 1));
    expect(offlineReply('hola', 2)).toContain('paso');
  });

  test('nunca devuelve una respuesta vacía', () => {
    expect(offlineReply('', 99).length).toBeGreaterThan(0);
  });
});
