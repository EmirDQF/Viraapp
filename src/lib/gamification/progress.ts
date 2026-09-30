/**
 * Lógica pura del recorrido: desbloqueo secuencial de módulos y etapas.
 * `start` es el módulo que el usuario eligió en el onboarding: va primero y el resto sigue el orden de la guía.
 */
import { MODULE_ORDER } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import type { ModuleId, ModuleProgress, ModulesProgress, StagePointer, UnlockStatus } from '@/types/game';

const EMPTY: ModuleProgress = { completedStages: [], bestScores: {}, completedAt: null };

function progressOf(id: ModuleId, modules: ModulesProgress): ModuleProgress {
  return modules[id] ?? EMPTY;
}

/** Orden efectivo de desbloqueo: el módulo elegido primero y después el orden de la guía. */
export function moduleOrder(start: ModuleId | null = null): readonly ModuleId[] {
  if (!start) return MODULE_ORDER;
  return [start, ...MODULE_ORDER.filter((id) => id !== start)];
}

export function isModuleComplete(id: ModuleId, modules: ModulesProgress): boolean {
  return progressOf(id, modules).completedStages.length >= STAGES_PER_MODULE;
}

export function moduleStatus(id: ModuleId, modules: ModulesProgress, start: ModuleId | null = null): UnlockStatus {
  if (isModuleComplete(id, modules)) return 'completed';
  const order = moduleOrder(start);
  const index = order.indexOf(id);
  if (index <= 0) return 'unlocked';
  return isModuleComplete(order[index - 1], modules) ? 'unlocked' : 'locked';
}

export function stageStatus(
  id: ModuleId,
  stage: number,
  modules: ModulesProgress,
  start: ModuleId | null = null,
): UnlockStatus {
  if (moduleStatus(id, modules, start) === 'locked') return 'locked';
  const { completedStages } = progressOf(id, modules);
  if (completedStages.includes(stage)) return 'completed';
  if (stage === 0 || completedStages.includes(stage - 1)) return 'unlocked';
  return 'locked';
}

export function moduleCompletion(id: ModuleId, modules: ModulesProgress): number {
  return Math.min(1, progressOf(id, modules).completedStages.length / STAGES_PER_MODULE);
}

export function countCompletedModules(modules: ModulesProgress): number {
  return MODULE_ORDER.filter((id) => isModuleComplete(id, modules)).length;
}

/** Total de etapas completadas en todos los módulos (estadística de la pestaña Mi). */
export function countCompletedStages(modules: ModulesProgress): number {
  return MODULE_ORDER.reduce((total, id) => total + progressOf(id, modules).completedStages.length, 0);
}

/** Primer módulo sin completar (el que el usuario está trabajando); null si terminó todo. */
export function currentModule(modules: ModulesProgress, start: ModuleId | null = null): ModuleId | null {
  return moduleOrder(start).find((id) => !isModuleComplete(id, modules)) ?? null;
}

/** Módulo que se desbloquea al terminar el actual (para el texto del arco de progreso). */
export function followingModule(modules: ModulesProgress, start: ModuleId | null = null): ModuleId | null {
  const current = currentModule(modules, start);
  if (!current) return null;
  const order = moduleOrder(start);
  return order.slice(order.indexOf(current) + 1).find((id) => !isModuleComplete(id, modules)) ?? null;
}

/** Siguiente etapa pendiente: a donde lleva el botón INICIAR. */
export function nextStage(modules: ModulesProgress, start: ModuleId | null = null): StagePointer | null {
  const moduleId = currentModule(modules, start);
  if (!moduleId) return null;
  const { completedStages } = progressOf(moduleId, modules);
  const stage = Array.from({ length: STAGES_PER_MODULE }, (_, index) => index).find(
    (index) => !completedStages.includes(index),
  );
  return stage === undefined ? null : { moduleId, stage };
}

/** Registra una etapa completada (inmutable). Guarda la mejor puntuación y la fecha de fin del módulo. */
export function completeStage(
  modules: ModulesProgress,
  id: ModuleId,
  stage: number,
  score: number,
  now: Date = new Date(),
): ModulesProgress {
  if (!Number.isInteger(stage) || stage < 0 || stage >= STAGES_PER_MODULE) return modules;
  const current = progressOf(id, modules);
  const safeScore = Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : 0;
  const completedStages = current.completedStages.includes(stage)
    ? current.completedStages
    : [...current.completedStages, stage].sort((a, b) => a - b);
  const bestScores = { ...current.bestScores, [stage]: Math.max(current.bestScores[stage] ?? 0, safeScore) };
  const finishedNow = completedStages.length >= STAGES_PER_MODULE && current.completedAt === null;
  const next: ModuleProgress = {
    completedStages,
    bestScores,
    completedAt: finishedNow ? now.toISOString() : current.completedAt,
  };
  return { ...modules, [id]: next };
}
