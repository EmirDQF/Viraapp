import { cellsBetween, findWord, generateWordSearch, normalizeWord, readCells } from '@/lib/wordsearch';

const WORDS = ['DESAHOGO', 'ESCRIBIR', 'SOLTAR', 'CONTROL', 'DESCANSO', 'RESPIRAR'];

describe('normalizeWord', () => {
  test('pasa a mayúsculas, quita tildes y espacios pero conserva la Ñ', () => {
    expect(normalizeWord('reacción')).toBe('REACCION');
    expect(normalizeWord('Buzón')).toBe('BUZON');
    expect(normalizeWord('año nuevo')).toBe('AÑONUEVO');
  });
});

describe('generateWordSearch', () => {
  test('crea una cuadrícula 10×10 con las 6 palabras legibles en su posición', () => {
    const grid = generateWordSearch(WORDS, 10, 42);
    expect(grid.cells).toHaveLength(10);
    grid.cells.forEach((row) => expect(row).toHaveLength(10));
    expect(grid.placements).toHaveLength(6);
    grid.placements.forEach((placement) => {
      const end = {
        row: placement.row + placement.dRow * (placement.word.length - 1),
        col: placement.col + placement.dCol * (placement.word.length - 1),
      };
      expect(readCells(grid, cellsBetween({ row: placement.row, col: placement.col }, end))).toBe(placement.word);
    });
  });

  test('solo usa letras mayúsculas en todas las celdas', () => {
    const grid = generateWordSearch(WORDS, 10, 7);
    grid.cells.flat().forEach((cell) => expect(cell).toMatch(/^[A-ZÑ]$/));
  });

  test('es determinista con la misma semilla', () => {
    expect(generateWordSearch(WORDS, 10, 5)).toEqual(generateWordSearch(WORDS, 10, 5));
  });

  test('falla con un mensaje claro si una palabra no cabe', () => {
    expect(() => generateWordSearch(['PALABRAMUYLARGA'], 10, 1)).toThrow('no cabe');
  });
});

describe('selección de celdas', () => {
  test('cellsBetween devuelve la línea recta, horizontal, vertical o diagonal', () => {
    expect(cellsBetween({ row: 0, col: 0 }, { row: 0, col: 3 })).toHaveLength(4);
    expect(cellsBetween({ row: 0, col: 0 }, { row: 3, col: 3 })).toHaveLength(4);
    expect(cellsBetween({ row: 3, col: 1 }, { row: 0, col: 1 })).toHaveLength(4);
  });

  test('cellsBetween devuelve vacío si la selección no es recta', () => {
    expect(cellsBetween({ row: 0, col: 0 }, { row: 1, col: 3 })).toEqual([]);
  });

  test('findWord reconoce una palabra seleccionada en cualquier sentido', () => {
    const grid = generateWordSearch(WORDS, 10, 42);
    const placement = grid.placements[0];
    const start = { row: placement.row, col: placement.col };
    const end = {
      row: placement.row + placement.dRow * (placement.word.length - 1),
      col: placement.col + placement.dCol * (placement.word.length - 1),
    };
    expect(findWord(grid, start, end)).toBe(placement.word);
    expect(findWord(grid, end, start)).toBe(placement.word);
    expect(findWord(grid, start, start)).toBeNull();
  });
});
