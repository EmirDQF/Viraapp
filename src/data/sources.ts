/**
 * Fuentes del contenido de VIRA en formato APA (7.ª ed.). Solo referencias verificables de autores clásicos
 * de la TCC, la DBT y la regulación emocional.
 */
export interface Source {
  readonly id: string;
  /** Referencia completa en formato APA. */
  readonly apa: string;
  /** Qué parte de la app se apoya en esta fuente. */
  readonly usedFor: string;
}

export const SOURCES: readonly Source[] = [
  {
    id: 'beck-2011',
    apa: 'Beck, J. S. (2011). Cognitive behavior therapy: Basics and beyond (2nd ed.). Guilford Press.',
    usedFor: 'Triángulo pensamiento-emoción-conducta, distorsiones y reestructuración cognitiva.',
  },
  {
    id: 'linehan-2015',
    apa: 'Linehan, M. M. (2015). DBT skills training manual (2nd ed.). Guilford Press.',
    usedFor: 'Tolerancia al malestar, STOP y regulación emocional.',
  },
  {
    id: 'gross-1998',
    apa: 'Gross, J. J. (1998). The emerging field of emotion regulation: An integrative review. Review of General Psychology, 2(3), 271–299.',
    usedFor: 'Qué es regular una emoción y por qué la pausa cambia la respuesta.',
  },
  {
    id: 'marlatt-1985',
    apa: 'Marlatt, G. A., & Gordon, J. R. (Eds.). (1985). Relapse prevention: Maintenance strategies in the treatment of addictive behaviors. Guilford Press.',
    usedFor: 'Surfear el impulso (urge surfing) y la curva del impulso.',
  },
  {
    id: 'meichenbaum-1977',
    apa: 'Meichenbaum, D. (1977). Cognitive-behavior modification: An integrative approach. Plenum Press.',
    usedFor: 'Autoinstrucciones.',
  },
  {
    id: 'dzurilla-1971',
    apa: "D'Zurilla, T. J., & Goldfried, M. R. (1971). Problem solving and behavior modification. Journal of Abnormal Psychology, 78(1), 107–126.",
    usedFor: 'Solución de problemas en 5 pasos.',
  },
  {
    id: 'jacobson-1938',
    apa: 'Jacobson, E. (1938). Progressive relaxation (2nd ed.). University of Chicago Press.',
    usedFor: 'Relajación muscular progresiva.',
  },
  {
    id: 'mischel-1989',
    apa: 'Mischel, W., Shoda, Y., & Rodriguez, M. L. (1989). Delay of gratification in children. Science, 244(4907), 933–938.',
    usedFor: 'Demora de la gratificación (regla de los 10 minutos).',
  },
];
