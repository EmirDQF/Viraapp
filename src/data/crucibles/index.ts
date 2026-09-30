import type { CrucibleCategory, CrucibleId } from '@/types';
import { academicCrucible } from '@/data/crucibles/academic';
import { burnoutCrucible } from '@/data/crucibles/burnout';
import { economicCrucible } from '@/data/crucibles/economic';
import { existentialCrucible } from '@/data/crucibles/existential';
import { griefCrucible } from '@/data/crucibles/grief';

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
