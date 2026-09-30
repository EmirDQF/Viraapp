import { currentModule, isModuleComplete, moduleOrder } from '@/lib/gamification/progress';
import type { ModuleId, ModulesProgress } from '@/types/game';

export const MAX_RECOMMENDATIONS = 3;

/**
 * Temas recomendados en Explorar: primero el que estás trabajando, luego los que vienen en tu orden y,
 * si ya terminaste todo, los completados para repasar.
 */
export function recommendModules(modules: ModulesProgress, start: ModuleId | null = null): readonly ModuleId[] {
  const order = moduleOrder(start);
  const current = currentModule(modules, start);
  const pending = order.filter((id) => id !== current && !isModuleComplete(id, modules));
  const review = order.filter((id) => isModuleComplete(id, modules));
  return [...(current ? [current] : []), ...pending, ...review].slice(0, MAX_RECOMMENDATIONS);
}
