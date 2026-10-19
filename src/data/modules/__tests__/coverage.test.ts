import { ancla } from '@/data/modules/ancla';
import { MODULE_ORDER } from '@/data/modules/catalog';
import { descarga } from '@/data/modules/descarga';
import { enfriador } from '@/data/modules/enfriador';
import { freno } from '@/data/modules/freno';
import { hoy } from '@/data/modules/hoy';
import { muro } from '@/data/modules/muro';
import { getModuleContent } from '@/data/modules';
import { COURSE_QUESTIONS, MODULE_AXES, type CourseAxis } from '@/data/modules/courseQuestions';
import { MIN_EXERCISES, moduleContentSchema } from '@/data/modules/schema';

const RAW_MODULES = { descarga, enfriador, freno, hoy, ancla, muro };

const AXES: readonly CourseAxis[] = ['impulsos', 'pensamientos', 'frustracion', 'tecnicas'];

/** Técnicas del curso y una palabra clave que debe aparecer en el contenido. */
const TECHNIQUES: readonly (readonly [string, RegExp])[] = [
  ['STOP', /STOP/],
  ['Respiración 4-7-8', /4-7-8/],
  ['Respiración cuadrada', /respiración cuadrada/i],
  ['Contar hasta 10', /contar hasta 10/i],
  ['Tiempo fuera', /tiempo fuera/i],
  ['Surfear el impulso', /surfear el impulso/i],
  ['Grounding 5-4-3-2-1', /5-4-3-2-1/],
  ['Reestructuración cognitiva', /reestructuración cognitiva/i],
  ['Autoinstrucciones', /autoinstrucci/i],
  ['Solución de problemas', /solución de problemas/i],
  ['Regla de los 10 minutos', /10 minutos/i],
  ['Relajación muscular progresiva', /relajación muscular/i],
  ['Comunicación asertiva', /asertiv/i],
];

const allText = MODULE_ORDER.map((id) => JSON.stringify(getModuleContent(id))).join(' ');

describe('cobertura del curso en todo el catálogo', () => {
  test.each(MODULE_ORDER)('%s pasa la validación del esquema completo', (id) => {
    const parsed = moduleContentSchema.safeParse(getModuleContent(id));
    expect(parsed.success ? 'ok' : parsed.error.issues[0]?.message).toBe('ok');
  });

  test('los 4 ejes del curso están cubiertos por al menos un módulo', () => {
    const covered = new Set(MODULE_ORDER.flatMap((id) => MODULE_AXES[id]));
    AXES.forEach((axis) => expect(covered).toContain(axis));
  });

  test.each(TECHNIQUES)('la técnica %s aparece en el contenido', (_name, pattern) => {
    expect(allText).toMatch(pattern);
  });

  test.each(MODULE_ORDER)('%s tiene al menos 8 preguntas propias por ronda (sin contar el relleno heredado)', (id) => {
    const course = COURSE_QUESTIONS[id];
    RAW_MODULES[id].rounds.forEach((round, index) => {
      expect(round.length + (course?.[index].length ?? 0)).toBeGreaterThanOrEqual(MIN_EXERCISES);
    });
  });

  test.each(MODULE_ORDER)('%s tiene al menos 8 casos de swipe y 8 de la prueba final', (id) => {
    const content = getModuleContent(id);
    expect(content.swipe.cards.length).toBeGreaterThanOrEqual(MIN_EXERCISES);
    expect(content.boss.items.length).toBeGreaterThanOrEqual(MIN_EXERCISES);
  });

  test('no hay preguntas repetidas dentro de un módulo y todas las respuestas existen', () => {
    MODULE_ORDER.forEach((id) => {
      const questions = getModuleContent(id).rounds.flat();
      expect(new Set(questions.map((question) => question.prompt)).size).toBe(questions.length);
      questions.forEach((question) => expect(question.options[question.answer]).toBeDefined());
    });
  });
});
