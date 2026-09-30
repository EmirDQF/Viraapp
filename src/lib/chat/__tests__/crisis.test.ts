import { detectCrisis } from '@/lib/chat/crisis';

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

  test.each(['estoy cansado del examen', 'me muero de risa con ese video', 'quiero cortar con mi pareja', 'hola Regi'])(
    'no marca frases cotidianas: "%s"',
    (text) => {
      expect(detectCrisis(text)).toBe(false);
    },
  );
});
