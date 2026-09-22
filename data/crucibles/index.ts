import type { CrucibleCategory, CrucibleId } from '../../types';
import { academicCrucible } from './academic';
import { burnoutCrucible } from './burnout';
import { economicCrucible } from './economic';
import { existentialCrucible } from './existential';
import { griefCrucible } from './grief';

export const CRUCIBLES: readonly CrucibleCategory[] = [
  academicCrucible,
  economicCrucible,
  griefCrucible,
  burnoutCrucible,
  existentialCrucible,
];

const CRUCIBLE_IDS: readonly string[] = CRUCIBLES.map((crucible) => crucible.id);

export function isCrucibleId(value: unknown): value is CrucibleId {
  return typeof value === 'string' && CRUCIBLE_IDS.includes(value);
}

export function getCrucible(id: CrucibleId): CrucibleCategory {
  const crucible = CRUCIBLES.find((item) => item.id === id);
  if (!crucible) {
    throw new Error(`Crisol desconocido: ${id}`);
  }
  return crucible;
}
