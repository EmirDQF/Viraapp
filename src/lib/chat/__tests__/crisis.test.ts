import { detectCrisis, mentionsHelpline } from '@/lib/chat/crisis';

describe('detectCrisis', () => {
  test.each([
    'ya no quiero vivir',
    'estoy pensando en suicidarme',
    'Pienso en el SUICIDIO',
    'quiero quitarme la vida',
    'a veces me corto',
    'quiero hacerme daño',
    'me quiero matar',
    'quisiera desaparecer para siempre',
    'autolesión',
  ])('detecta señales de riesgo: "%s"', (text) => {
    expect(detectCrisis(text)).toBe(true);
  });

  test.each(['me quiero mat4r', 'q u i e r o   m o r i r', 'SU1C1D4RM3'])('resiste leetspeak y letras separadas: "%s"', (text) => {
    expect(detectCrisis(text)).toBe(true);
  });

  test('detecta cuando la respuesta de Regi remite a líneas de ayuda', () => {
    expect(mentionsHelpline('Por favor llama a la Línea 113, opción 5.')).toBe(true);
    expect(mentionsHelpline('¿Qué te preocupa del examen?')).toBe(false);
  });

  test.each(['estoy cansado del examen', 'me muero de risa con ese video', 'quiero cortar con mi pareja', 'hola Regi'])(
    'no marca frases cotidianas: "%s"',
    (text) => {
      expect(detectCrisis(text)).toBe(false);
    },
  );
});
