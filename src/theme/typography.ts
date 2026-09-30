/**
 * Tipografía VIRA: Nunito (sans redondeada y cálida). Se usa `fontFamily` por peso en lugar de
 * `fontWeight`, porque en Android una familia personalizada con fontWeight puede caer a la fuente del sistema.
 */
export const fontFamily = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
} as const;

export const typography = {
  display: { fontFamily: fontFamily.black, fontSize: 40, lineHeight: 46, letterSpacing: 1 },
  title: { fontFamily: fontFamily.extrabold, fontSize: 26, lineHeight: 32 },
  heading: { fontFamily: fontFamily.extrabold, fontSize: 21, lineHeight: 27 },
  subtitle: { fontFamily: fontFamily.extrabold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 23 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 23 },
  button: { fontFamily: fontFamily.extrabold, fontSize: 16, letterSpacing: 0.8 },
  caption: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fontFamily.extrabold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2 },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Límite de escalado para textos grandes: respeta el tamaño del sistema sin romper el layout. */
export const MAX_FONT_SCALE = 1.6;
