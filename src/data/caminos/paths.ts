import type { CaminoPath, PathId } from '@/data/caminos/types';

/** Los 3 caminos sugeridos (no son un orden obligatorio). */
export const PATHS: readonly CaminoPath[] = [
  {
    id: 'recursos',
    number: 1,
    name: 'Reconocer mis recursos',
    icon: 'backpack',
    lead: 'Aprende de tus experiencias, identifica apoyos y reconoce tus capacidades.',
    stops: [
      { kind: 'module', moduleId: 'muro-evidencia' },
      { kind: 'module', moduleId: 'red-recursos' },
      { kind: 'soon', title: 'Fortalezas y debilidades' },
    ],
    tip: { title: 'Regi avisa', text: 'Cuando llegue un tema nuevo, lo verás aquí como una parada más.' },
  },
  {
    id: 'respuestas',
    number: 2,
    name: 'Comprender mis respuestas',
    icon: 'scan',
    lead: 'Reconoce necesidades, emociones, señales y patrones de reacción.',
    stops: [
      { kind: 'module', moduleId: 'detras-impulso' },
      { kind: 'module', moduleId: 'punto-giro' },
      { kind: 'module', moduleId: 'bajo-presion' },
    ],
    tip: {
      title: 'Regi recomienda',
      text: 'Después de Bajo Presión, prueba “Vuelve a tu centro” en el camino Elegir cómo actuar.',
      activityId: 'vuelve-a-tu-centro',
    },
  },
  {
    id: 'actuar',
    number: 3,
    name: 'Elegir cómo actuar',
    icon: 'nav',
    lead: 'Revisa interpretaciones, practica técnicas y organiza tus acciones.',
    stops: [
      { kind: 'module', moduleId: 'hoy-facil' },
      { kind: 'module', moduleId: 'toma-mando' },
      { kind: 'soon', title: 'Afrontamiento' },
      { kind: 'soon', title: 'Gestión del tiempo' },
    ],
    tip: { title: 'Regi avisa', text: 'Cuando llegue un tema nuevo, lo verás aquí como una parada más.' },
  },
];

export function getPath(id: PathId): CaminoPath {
  const path = PATHS.find((item) => item.id === id);
  if (!path) throw new Error(`Camino desconocido: ${id}`);
  return path;
}
