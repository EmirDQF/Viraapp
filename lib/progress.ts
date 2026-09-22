import { MODULE_ORDER } from '../data/modules';
import type { CrucibleProgress, Energy, Module, ModuleId, ModuleRecord } from '../types';

export const EMPTY_PROGRESS: CrucibleProgress = { completedModules: [] };

const PERFECT_BONUS = 10;
const BONUS_PENALTY_PER_MISTAKE = 2;

export type ModuleStatus = 'completed' | 'unlocked' | 'locked';

export function moduleStatus(moduleId: ModuleId, completed: readonly ModuleId[]): ModuleStatus {
  if (completed.includes(moduleId)) {
    return 'completed';
  }
  const index = MODULE_ORDER.indexOf(moduleId);
  if (index <= 0) {
    return 'unlocked';
  }
  return completed.includes(MODULE_ORDER[index - 1]) ? 'unlocked' : 'locked';
}

export function isPathComplete(completed: readonly ModuleId[]): boolean {
  return MODULE_ORDER.every((id) => completed.includes(id));
}

export function xpForModule(module: Module, mistakes: number): number {
  const bonus = Math.max(0, PERFECT_BONUS - mistakes * BONUS_PENALTY_PER_MISTAKE);
  return module.xp + bonus;
}

export function markCompleted(progress: CrucibleProgress, moduleId: ModuleId): CrucibleProgress {
  if (progress.completedModules.includes(moduleId)) {
    return progress;
  }
  return { ...progress, completedModules: [...progress.completedModules, moduleId] };
}

export function applyRecord(progress: CrucibleProgress, record: ModuleRecord): CrucibleProgress {
  switch (record.kind) {
    case 'reframe':
      return { ...progress, reframe: record.text };
    case 'mantra':
      return { ...progress, mantra: record.mantra };
    case 'micro-action':
      return { ...progress, microAction: { challengeId: record.challengeId, commitment: record.commitment } };
    case 'rules':
      return { ...progress, ruleIds: [...record.ruleIds] };
  }
}

export function spendEnergy(energy: Energy): Energy {
  return { ...energy, current: Math.max(0, energy.current - 1) };
}

export function refillEnergy(energy: Energy): Energy {
  return { ...energy, current: energy.max };
}
