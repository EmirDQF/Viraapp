import { ACTIVITIES, activitiesOf } from '@/data/caminos/activities';
import { PA3_MODULES, PA3_MODULE_LIST } from '@/data/caminos/modules';
import { PATHS } from '@/data/caminos/paths';
import { PA3_MODULE_IDS } from '@/data/caminos/types';
import { pathMeta, pathModules } from '@/lib/caminos';

describe('estructura PA3', () => {
  test('tiene 3 caminos, 7 módulos activos y 25 actividades', () => {
    expect(PATHS).toHaveLength(3);
    expect(PA3_MODULE_LIST).toHaveLength(7);
    expect(ACTIVITIES).toHaveLength(25);
  });

  test('los textos de cada camino coinciden con el diseño oficial', () => {
    expect(PATHS.map(pathMeta)).toEqual(['2 módulos · 6 actividades', '3 módulos · 11 actividades', '2 módulos · 8 actividades']);
  });

  test('cada módulo aparece en un solo camino y en el camino que declara', () => {
    const fromStops = PATHS.flatMap((path) => pathModules(path).map((id) => [id, path.id]));
    expect(fromStops.map(([id]) => id).sort()).toEqual([...PA3_MODULE_IDS].sort());
    fromStops.forEach(([id, pathId]) => expect(PA3_MODULES[id as keyof typeof PA3_MODULES].path).toBe(pathId));
  });

  test('las paradas futuras son 3: Fortalezas y debilidades, Afrontamiento y Gestión del tiempo', () => {
    const soon = PATHS.flatMap((path) => path.stops.flatMap((stop) => (stop.kind === 'soon' ? [stop.title] : [])));
    expect(soon).toEqual(['Fortalezas y debilidades', 'Afrontamiento', 'Gestión del tiempo']);
  });

  test('los ids de actividades son únicos', () => {
    expect(new Set(ACTIVITIES.map((activity) => activity.id)).size).toBe(ACTIVITIES.length);
  });

  test.each(PA3_MODULE_IDS)('el módulo %s tiene al menos una actividad desarrollada', (moduleId) => {
    expect(activitiesOf(moduleId).some((activity) => activity.status === 'desarrollado')).toBe(true);
  });

  test('el estado coincide con el contenido: propuesto ⇔ sin jugar', () => {
    ACTIVITIES.forEach((activity) => {
      expect(activity.status === 'propuesto').toBe(activity.content.kind === 'planned');
    });
  });

  test('cada paso de práctica tiene exactamente una respuesta que aplica el tema', () => {
    ACTIVITIES.forEach((activity) => {
      if (activity.content.kind !== 'flow') return;
      expect(activity.content.steps.length).toBeGreaterThan(0);
      activity.content.steps.forEach((step) => expect(step.options.filter((option) => option.good)).toHaveLength(1));
    });
  });

  test('las recomendaciones cruzadas apuntan a actividades que existen', () => {
    const targets = [
      ...PA3_MODULE_LIST.flatMap((module) => (module.recommends ? [module.recommends.activityId] : [])),
      ...PATHS.flatMap((path) => (path.tip.activityId ? [path.tip.activityId] : [])),
    ];
    expect(targets).toContain('vuelve-a-tu-centro');
    targets.forEach((id) => expect(ACTIVITIES.some((activity) => activity.id === id)).toBe(true));
  });

  test('cada caso inicial ofrece decisiones y argumentos', () => {
    PA3_MODULE_LIST.forEach(({ situation }) => {
      expect(situation.decisions.length).toBeGreaterThanOrEqual(2);
      expect(situation.arguments.length).toBeGreaterThanOrEqual(2);
    });
  });
});
