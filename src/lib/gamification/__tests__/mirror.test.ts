import { mirrorScores } from '@/lib/gamification/mirror';

describe('mirrorScores', () => {
  test('elegir la respuesta resiliente a la primera refleja alta resiliencia', () => {
    expect(mirrorScores(true)).toEqual({ impulsive: 15, resilient: 85 });
  });

  test('reaccionar primero y corregir después refleja un equilibrio (sin castigo)', () => {
    expect(mirrorScores(false)).toEqual({ impulsive: 60, resilient: 60 });
  });
});
