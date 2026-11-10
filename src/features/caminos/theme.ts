import { StyleSheet } from 'react-native';

import type { ActivityStatus, PathId } from '@/data/caminos/types';
import { fontFamily } from '@/theme/typography';

/**
 * Paleta oficial del diseño "VIRA Caminos" (De la ruleta a los caminos). Es una experiencia clara y cálida a
 * propósito: se mantiene igual en modo oscuro para respetar el prototipo.
 */
export const caminos = {
  appBg: '#F8F6F0',
  cardBg: '#FFFFFF',
  ink: '#24343B',
  muted: '#53666D',
  line: '#CCD8D2',
  mint: '#E5EDE5',
  teal: '#24576A',
  c1: '#24576A',
  c2: '#B85A3D',
  c3: '#4E7F6A',
  /** Sombra de tarjetas y de Regi. */
  shadow: '#24343B',
  regiShadow: '#24576A',
  /** Maqueta: terracota oscuro sobre crema (contraste AA). */
  draftBg: '#F6E6DD',
  draftText: '#8A4228',
} as const;

export const PATH_COLORS: Readonly<Record<PathId, string>> = {
  recursos: caminos.c1,
  respuestas: caminos.c2,
  actuar: caminos.c3,
};

export const STATUS_LABEL: Readonly<Record<ActivityStatus, string>> = {
  desarrollado: 'DESARROLLADO',
  maqueta: 'MAQUETA',
  propuesto: 'PROPUESTO',
};

/** Estilos de texto compartidos (Nunito). */
export const caminosText = StyleSheet.create({
  eyebrow: { fontFamily: fontFamily.extrabold, fontSize: 11, lineHeight: 15, letterSpacing: 0.9, textTransform: 'uppercase' },
  h1: { fontFamily: fontFamily.extrabold, fontSize: 26, lineHeight: 32, color: caminos.teal },
  h2: { fontFamily: fontFamily.extrabold, fontSize: 23, lineHeight: 27, color: caminos.teal },
  h2Detail: { fontFamily: fontFamily.extrabold, fontSize: 24, lineHeight: 28, color: caminos.teal },
  lead: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, color: caminos.muted },
  body: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20, color: caminos.ink },
  bodyStrong: { fontFamily: fontFamily.bold, fontSize: 15, lineHeight: 21, color: caminos.ink },
  cardTitle: { fontFamily: fontFamily.extrabold, fontSize: 17, lineHeight: 20, color: caminos.ink },
  stopTitle: { fontFamily: fontFamily.extrabold, fontSize: 15.5, lineHeight: 19, color: caminos.ink },
  small: { fontFamily: fontFamily.regular, fontSize: 13, lineHeight: 18, color: caminos.muted },
  tag: { fontFamily: fontFamily.extrabold, fontSize: 11, lineHeight: 14 },
  button: { fontFamily: fontFamily.extrabold, fontSize: 14, lineHeight: 18 },
});
