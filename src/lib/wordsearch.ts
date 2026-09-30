/** Generador de pupiletras (sopa de letras) determinista y utilidades de selección. */
import { randomInt, seededRandom, type Random } from '@/lib/random';

export interface Cell {
  readonly row: number;
  readonly col: number;
}

export interface WordPlacement {
  readonly word: string;
  readonly row: number;
  readonly col: number;
  readonly dRow: number;
  readonly dCol: number;
}

export interface WordSearchGrid {
  readonly size: number;
  readonly cells: readonly (readonly string[])[];
  readonly placements: readonly WordPlacement[];
}

/** Direcciones de lectura natural: horizontal, vertical y diagonales hacia abajo. */
const DIRECTIONS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [-1, 1],
];
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
const MAX_ATTEMPTS = 400;

/** Mayúsculas, sin tildes ni espacios; conserva la Ñ. */
export function normalizeWord(word: string): string {
  return word
    .toUpperCase()
    .replace(/Ñ/g, '\u0000')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\u0000/g, 'Ñ')
    .replace(/[^A-ZÑ]/g, '');
}

function fits(grid: readonly (readonly string[])[], word: string, placement: Omit<WordPlacement, 'word'>): boolean {
  const size = grid.length;
  return [...word].every((letter, index) => {
    const row = placement.row + placement.dRow * index;
    const col = placement.col + placement.dCol * index;
    if (row < 0 || col < 0 || row >= size || col >= size) return false;
    return grid[row][col] === '' || grid[row][col] === letter;
  });
}

function place(grid: readonly (readonly string[])[], placement: WordPlacement): string[][] {
  const next = grid.map((row) => [...row]);
  [...placement.word].forEach((letter, index) => {
    next[placement.row + placement.dRow * index][placement.col + placement.dCol * index] = letter;
  });
  return next;
}

function tryPlace(grid: readonly (readonly string[])[], word: string, random: Random): WordPlacement | null {
  const size = grid.length;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const [dRow, dCol] = DIRECTIONS[randomInt(random, DIRECTIONS.length)];
    const candidate = { row: randomInt(random, size), col: randomInt(random, size), dRow, dCol };
    if (fits(grid, word, candidate)) return { word, ...candidate };
  }
  return null;
}

export function generateWordSearch(words: readonly string[], size = 10, seed = 1): WordSearchGrid {
  const random = seededRandom(seed);
  const normalized = words.map(normalizeWord).sort((a, b) => b.length - a.length);
  let grid: string[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => ''));
  const placements: WordPlacement[] = [];
  for (const word of normalized) {
    if (word.length > size) throw new Error(`La palabra "${word}" no cabe en una cuadrícula de ${size}×${size}.`);
    const placement = tryPlace(grid, word, random);
    if (!placement) throw new Error(`La palabra "${word}" no cabe en la cuadrícula; prueba con otra semilla.`);
    placements.push(placement);
    grid = place(grid, placement);
  }
  const cells = grid.map((row) => row.map((letter) => letter || ALPHABET[randomInt(random, ALPHABET.length)]));
  return { size, cells, placements };
}

/** Celdas en línea recta entre dos puntos (incluidos); vacío si no es horizontal, vertical o diagonal. */
export function cellsBetween(start: Cell, end: Cell): readonly Cell[] {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;
  const straight = dRow === 0 || dCol === 0 || Math.abs(dRow) === Math.abs(dCol);
  if (!straight) return [];
  const length = Math.max(Math.abs(dRow), Math.abs(dCol));
  const stepRow = Math.sign(dRow);
  const stepCol = Math.sign(dCol);
  return Array.from({ length: length + 1 }, (_, index) => ({ row: start.row + stepRow * index, col: start.col + stepCol * index }));
}

export function readCells(grid: WordSearchGrid, cells: readonly Cell[]): string {
  return cells.map((cell) => grid.cells[cell.row]?.[cell.col] ?? '').join('');
}

/** Palabra escondida que coincide con la selección (en cualquier sentido), o null. */
export function findWord(grid: WordSearchGrid, start: Cell, end: Cell): string | null {
  const cells = cellsBetween(start, end);
  if (cells.length < 2) return null;
  const text = readCells(grid, cells);
  const reversed = [...text].reverse().join('');
  return grid.placements.find((placement) => placement.word === text || placement.word === reversed)?.word ?? null;
}
