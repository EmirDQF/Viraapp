import type { DistortionType } from '@/types/legacy';

export interface DistortionInfo {
  readonly label: string;
  readonly short: string;
}

export const DISTORTIONS: Readonly<Record<DistortionType, DistortionInfo>> = {
  catastrophizing: {
    label: 'Catastrofismo',
    short: 'Saltar al peor escenario posible como si fuera el más probable.',
  },
  'black-white': {
    label: 'Pensamiento blanco/negro',
    short: 'Ver solo dos extremos: éxito total o fracaso absoluto.',
  },
  'mind-reading': {
    label: 'Lectura de mente',
    short: 'Asumir que sabes lo que otros piensan de ti, sin pruebas.',
  },
  overgeneralization: {
    label: 'Sobregeneralización',
    short: 'Convertir un hecho aislado en un "siempre" o un "nunca".',
  },
  personalization: {
    label: 'Personalización',
    short: 'Cargar con toda la culpa de algo que tiene muchas causas.',
  },
  'emotional-reasoning': {
    label: 'Razonamiento emocional',
    short: '"Lo siento, luego es verdad": tratar una emoción como un hecho.',
  },
  'should-statements': {
    label: 'Exigencias "debería"',
    short: 'Reglas rígidas sobre cómo tú o el mundo "deberían" ser.',
  },
};
