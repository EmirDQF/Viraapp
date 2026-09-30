import type { SectorId, StageDef } from '@/types/game';

export const STAGES_PER_MODULE = 13;

export const SECTORS: readonly { readonly id: SectorId; readonly title: string; readonly summary: string }[] = [
  { id: 'descubrir', title: 'Descubrir', summary: 'Entiendes qué pasa y por qué.' },
  { id: 'practicar', title: 'Practicar', summary: 'Entrenas la herramienta con casos rápidos.' },
  { id: 'aplicar', title: 'Aplicar', summary: 'La usas en situaciones más difíciles.' },
  { id: 'dominar', title: 'Dominar', summary: 'Demuestras lo aprendido y recoges tu recompensa.' },
];

/** Las 13 etapas de cada módulo, en el orden de la guía del juego (v2). */
export const STAGES: readonly StageDef[] = [
  { index: 0, sector: 'descubrir', kind: 'decision', title: 'Video · El Contexto', minutes: 2 },
  { index: 1, sector: 'descubrir', kind: 'quiz', title: 'Ronda 1 de preguntas', minutes: 3 },
  { index: 2, sector: 'descubrir', kind: 'puzzle', title: 'Rompecabezas causa y efecto', minutes: 1 },
  { index: 3, sector: 'practicar', kind: 'swipe', title: 'Swipe: casos rápidos', minutes: 2 },
  { index: 4, sector: 'practicar', kind: 'word-rain', title: 'Lluvia de palabras', minutes: 1 },
  { index: 5, sector: 'practicar', kind: 'simulator', title: 'Simulador de la herramienta', minutes: 2 },
  { index: 6, sector: 'practicar', kind: 'quiz', title: 'Ronda 2 de preguntas', minutes: 3 },
  { index: 7, sector: 'aplicar', kind: 'decision', title: 'Video · El Conflicto', minutes: 2 },
  { index: 8, sector: 'aplicar', kind: 'quiz', title: 'Ronda 3 de preguntas', minutes: 3 },
  { index: 9, sector: 'aplicar', kind: 'word-search', title: 'Pupiletras', minutes: 3 },
  { index: 10, sector: 'aplicar', kind: 'trap-case', title: 'Caso «trampa»', minutes: 3 },
  { index: 11, sector: 'dominar', kind: 'boss', title: 'Prueba final contrarreloj', minutes: 2 },
  { index: 12, sector: 'dominar', kind: 'rewind', title: 'El Rewind', minutes: 1 },
];

export function stageAt(index: number): StageDef | undefined {
  return STAGES[index];
}
