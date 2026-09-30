/**
 * Logros de la pestaña Mi. Se derivan del progreso guardado (no se persisten aparte), así nunca se
 * desincronizan y "Borrar mis datos" los reinicia sin pasos extra.
 */

export interface AchievementInput {
  readonly completedStages: number;
  readonly completedModules: number;
  readonly streak: number;
  readonly resistedImpulses: number;
  readonly evidence: number;
  readonly contacts: number;
  readonly level: number;
}

export type AchievementIcon = 'sprout' | 'flag' | 'crown' | 'flame' | 'hourglass' | 'shield' | 'trophy' | 'users' | 'star';

interface AchievementDef {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: AchievementIcon;
  readonly metric: keyof AchievementInput;
  readonly target: number;
}

export interface Achievement extends AchievementDef {
  readonly value: number;
  readonly unlocked: boolean;
  /** Avance hacia el logro (0 a 1). */
  readonly progress: number;
}

export const ACHIEVEMENTS: readonly AchievementDef[] = [
  { id: 'first-stage', title: 'Primer paso', description: 'Completa tu primera etapa.', icon: 'sprout', metric: 'completedStages', target: 1 },
  { id: 'first-module', title: 'Tema completo', description: 'Termina las 13 etapas de un tema.', icon: 'flag', metric: 'completedModules', target: 1 },
  { id: 'all-modules', title: 'Mente resiliente', description: 'Completa los 6 temas.', icon: 'crown', metric: 'completedModules', target: 6 },
  { id: 'streak-3', title: 'Constancia', description: 'Practica 3 días seguidos.', icon: 'flame', metric: 'streak', target: 3 },
  { id: 'streak-7', title: 'Semana firme', description: 'Practica 7 días seguidos.', icon: 'flame', metric: 'streak', target: 7 },
  { id: 'impulse-1', title: 'Pausa ganadora', description: 'Resiste tu primer impulso.', icon: 'hourglass', metric: 'resistedImpulses', target: 1 },
  { id: 'impulse-10', title: 'Maestría de la espera', description: 'Resiste 10 impulsos.', icon: 'shield', metric: 'resistedImpulses', target: 10 },
  { id: 'evidence-5', title: 'Muro sólido', description: 'Reúne 5 logros en tu Muro de Evidencia.', icon: 'trophy', metric: 'evidence', target: 5 },
  { id: 'support-1', title: 'Red de apoyo', description: 'Añade un contacto de confianza.', icon: 'users', metric: 'contacts', target: 1 },
  { id: 'level-5', title: 'Nivel 5', description: 'Llega al nivel 5.', icon: 'star', metric: 'level', target: 5 },
];

function safeCount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function computeAchievements(input: AchievementInput): readonly Achievement[] {
  return ACHIEVEMENTS.map((def) => {
    const value = safeCount(input[def.metric]);
    return { ...def, value, unlocked: value >= def.target, progress: Math.min(1, value / def.target) };
  });
}

export function unlockedCount(list: readonly Achievement[]): number {
  return list.filter((achievement) => achievement.unlocked).length;
}
