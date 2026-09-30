/**
 * Medidores del Espejo emocional. No son un diagnóstico: solo reflejan la elección hecha en la etapa.
 * Si la persona corrigió su elección, la resiliencia también sube (cambiar de rumbo es parte de la habilidad).
 */
export interface MirrorScores {
  readonly impulsive: number;
  readonly resilient: number;
}

export function mirrorScores(firstChoiceGood: boolean): MirrorScores {
  return firstChoiceGood ? { impulsive: 15, resilient: 85 } : { impulsive: 60, resilient: 60 };
}
