/**
 * Tipografía VIRA 2026: Nunito (sans redondeada y cálida) con jerarquía fuerte. Se usa `fontFamily` por peso
 * en lugar de `fontWeight`, porque en Android una familia personalizada con fontWeight puede caer a la fuente
 * del sistema.
 */
import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Nunito_400Regular',
  medium: 'Nunito_500Medium',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

/** Cifras de ancho fijo para que XP, racha y porcentajes no "bailen" al animarse. */
const TABULAR: TextStyle['fontVariant'] = ['tabular-nums'];

export const typography = {
  display: { fontFamily: fontFamily.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: fontFamily.extrabold, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
  heading: { fontFamily: fontFamily.extrabold, fontSize: 20, lineHeight: 26 },
  subtitle: { fontFamily: fontFamily.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 23 },
  button: { fontFamily: fontFamily.extrabold, fontSize: 16, letterSpacing: 0.6 },
  caption: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fontFamily.extrabold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
  /** Números grandes (XP, racha, %). */
  number: { fontFamily: fontFamily.extrabold, fontSize: 28, lineHeight: 34, fontVariant: TABULAR },
  /** Números pequeños dentro de píldoras y chips. */
  numberSmall: { fontFamily: fontFamily.extrabold, fontSize: 15, lineHeight: 20, fontVariant: TABULAR },
  /** Etiquetas de la barra de pestañas. */
  tab: { fontFamily: fontFamily.bold, fontSize: 11, lineHeight: 14 },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Límite de escalado para textos grandes: respeta el tamaño del sistema sin romper el layout. */
export const MAX_FONT_SCALE = 1.6;
