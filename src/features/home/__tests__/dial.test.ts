import { angleFromPoint, indexForRotation, rotationForIndex, shortestDelta, snapRotation, wedgePath } from '@/features/home/dial';

const COUNT = 6;

describe('geometría del dial', () => {
  test('el gajo bajo la flecha superior depende de la rotación', () => {
    expect(indexForRotation(0, COUNT)).toBe(0);
    expect(indexForRotation(-60, COUNT)).toBe(1);
    expect(indexForRotation(60, COUNT)).toBe(5);
    expect(indexForRotation(-359, COUNT)).toBe(0);
    expect(indexForRotation(-80, COUNT)).toBe(1);
  });

  test('snapRotation encaja en el gajo más cercano', () => {
    expect(snapRotation(-70, COUNT)).toBe(-60);
    expect(snapRotation(-95, COUNT)).toBe(-120);
    expect(snapRotation(10, COUNT)).toBe(0);
  });

  test('rotationForIndex elige el giro más corto desde la rotación actual', () => {
    expect(rotationForIndex(1, 0, COUNT)).toBe(-60);
    expect(rotationForIndex(5, 0, COUNT)).toBe(60);
    expect(rotationForIndex(0, -300, COUNT)).toBe(-360);
  });

  test('angleFromPoint mide grados en sentido horario desde arriba', () => {
    expect(angleFromPoint(50, 0, 50, 50)).toBeCloseTo(0);
    expect(angleFromPoint(100, 50, 50, 50)).toBeCloseTo(90);
    expect(angleFromPoint(50, 100, 50, 50)).toBeCloseTo(180);
    expect(angleFromPoint(0, 50, 50, 50)).toBeCloseTo(270);
  });

  test('shortestDelta envuelve la diferencia a [-180, 180]', () => {
    expect(shortestDelta(350, 10)).toBe(20);
    expect(shortestDelta(10, 350)).toBe(-20);
  });

  test('wedgePath genera un sector cerrado', () => {
    const path = wedgePath(100, 100, 90, 40, -30, 30);
    expect(path.startsWith('M')).toBe(true);
    expect(path.trim().endsWith('Z')).toBe(true);
    expect(path.match(/A/g)).toHaveLength(2);
  });
});
