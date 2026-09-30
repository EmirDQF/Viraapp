import type { ActionPlan, CrucibleCategory, CrucibleProgress, PlanDay } from '@/types';

const PLAN_DAYS = 7;
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const;

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function formatPlanDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function firstDayAction(crucible: CrucibleCategory, progress: CrucibleProgress): string {
  const { microAction } = progress;
  if (!microAction) {
    return crucible.content.weeklyActions[0];
  }
  const challenge = crucible.content.microChallenges.find((item) => item.id === microAction.challengeId);
  const title = challenge ? challenge.title : 'Tu micro-reto';
  return microAction.commitment.trim().length > 0 ? `${title}: ${microAction.commitment.trim()}` : title;
}

export function buildSchedule(crucible: CrucibleCategory, progress: CrucibleProgress, start: Date): readonly PlanDay[] {
  const actions = crucible.content.weeklyActions;
  return Array.from({ length: PLAN_DAYS }, (_, dayIndex) => ({
    dayIndex,
    dateLabel: formatPlanDate(addDays(start, dayIndex)),
    action: dayIndex === 0 ? firstDayAction(crucible, progress) : actions[dayIndex % actions.length],
  }));
}

/** Texto plano del plan, listo para compartir. */
export function formatPlanText(plan: ActionPlan, name: string): string {
  const lines = [
    `PLAN DE RESILIENCIA PERSONAL · TENAZ`,
    `${name} · ${plan.crucibleTitle}`,
    '',
    `DIAGNÓSTICO: ${plan.diagnosis.headline}`,
    plan.diagnosis.body,
    '',
    `MANTRA: "${plan.mantra}"`,
    ...(plan.reframe ? ['', `PENSAMIENTO REALISTA: ${plan.reframe}`] : []),
    '',
    'REGLAS NO NEGOCIABLES:',
    ...plan.rules.map((rule, index) => `${index + 1}. ${rule}`),
    '',
    'PRÓXIMOS 7 DÍAS:',
    ...plan.schedule.map((day) => `• ${day.dateLabel}: ${day.action}`),
  ];
  return lines.join('\n');
}

export function buildActionPlan(crucible: CrucibleCategory, progress: CrucibleProgress, start: Date = new Date()): ActionPlan {
  const { content } = crucible;
  const chosenRules = (progress.ruleIds ?? [])
    .map((id) => content.rules.find((rule) => rule.id === id)?.text)
    .filter((text): text is string => typeof text === 'string');
  const rules = chosenRules.length > 0 ? chosenRules : content.rules.slice(0, 3).map((rule) => rule.text);

  return {
    crucibleId: crucible.id,
    crucibleTitle: crucible.title,
    diagnosis: content.diagnosis,
    mantra: progress.mantra ?? content.mantras[0],
    rules,
    schedule: buildSchedule(crucible, progress, start),
    reframe: progress.reframe,
  };
}
