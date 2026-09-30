import type { CrucibleCategory, CrucibleId } from '@/types/legacy';
import { academicCrucible } from '@/data/legacy/crucibles/academic';
import { burnoutCrucible } from '@/data/legacy/crucibles/burnout';
import { economicCrucible } from '@/data/legacy/crucibles/economic';
import { existentialCrucible } from '@/data/legacy/crucibles/existential';
import { griefCrucible } from '@/data/legacy/crucibles/grief';

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
