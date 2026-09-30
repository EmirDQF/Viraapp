/**
 * Tokens de diseño VIRA (guía de identidad, docs/brand/image2.png).
 * Todos los colores de la interfaz salen de aquí; las ilustraciones usan sus propias constantes (REGI, LOGO).
 */

/** Paleta de marca. Las variantes *Deep (~15 % más oscuras) son el "labio" de los botones 3D. */
export const brand = {
  petrol: '#24576A',
  petrolDeep: '#1F4A5A',
  /** Petróleo aclarado para superficies activas en modo oscuro (texto blanco 5.9:1). */
  petrolBright: '#2F6B80',
  petrolNight: '#122A33',
  petrolNightSurface: '#1B3B47',
  petrolNightAlt: '#234A58',
  sage: '#A8C8B5',
  sageDeep: '#8FAA9A',
  coral: '#E99479',
  coralDeep: '#C67E67',
  ivory: '#F8F6F0',
  ivoryDeep: '#ECE8DE',
  ink: '#24343B',
  inkDeep: '#1F2C32',
  white: '#FFFFFF',
} as const;

/** Colores de feedback de acierto/error (se conservan del diseño anterior). */
export const feedback = {
  victory: '#10B981',
  victoryDeep: '#0E9D6E',
  retry: '#DC2626',
  retryDeep: '#B91C1C',
  gold: '#E3B341',
  goldDeep: '#B8860B',
} as const;

export type ModuleColorKey = 'descarga' | 'enfriador' | 'freno' | 'hoy' | 'ancla' | 'muro';

export interface ModuleTone {
  readonly base: string;
  readonly deep: string;
  /** Texto/íconos sobre `base` con contraste AA. */
  readonly on: string;
  readonly soft: string;
}

/**
 * Color propio de cada módulo (su gajo en el dial). Se parte de los colores del HTML del juego y se
 * oscurecen Freno de Mano y Hoy en Fácil para que el texto blanco cumpla AA (4.5:1).
 */
export const MODULE_COLORS: Readonly<Record<ModuleColorKey, ModuleTone>> = {
  descarga: { base: '#1E3A8A', deep: '#1A3175', on: brand.white, soft: '#DCE4F7' },
  enfriador: { base: '#7C3AED', deep: '#6931C9', on: brand.white, soft: '#EDE4FD' },
  freno: { base: '#C2410C', deep: '#A5370A', on: brand.white, soft: '#FCE6DA' },
  hoy: { base: '#15803D', deep: '#126D34', on: brand.white, soft: '#DDF3E4' },
  ancla: { base: '#F59E0B', deep: '#D08609', on: '#3A2600', soft: '#FEF0D2' },
  muro: { base: '#CA8A04', deep: '#AC7503', on: '#3A2600', soft: '#FBEFCB' },
};

export interface ThemeColors {
  readonly background: string;
  readonly backgroundAlt: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly primary: string;
  readonly primaryShadow: string;
  readonly onPrimary: string;
  readonly secondary: string;
  readonly secondaryShadow: string;
  readonly onSecondary: string;
  readonly accent: string;
  readonly accentShadow: string;
  readonly onAccent: string;
  /** Tono de énfasis para íconos/textos grandes sobre el fondo (petróleo en claro, petróleo claro en oscuro). */
  readonly highlight: string;
  readonly stable: string;
  readonly stableShadow: string;
  readonly success: string;
  readonly successShadow: string;
  readonly successSoft: string;
  readonly onSuccess: string;
  /** Verde para texto sobre fondo/superficie (el verde de feedback no llega a AA como texto). */
  readonly successText: string;
  readonly danger: string;
  readonly dangerShadow: string;
  readonly dangerSoft: string;
  readonly onDanger: string;
  readonly dangerText: string;
  readonly disabled: string;
  readonly disabledShadow: string;
  readonly onColor: string;
  readonly tabInactive: string;
  readonly overlay: string;
}

/*
 * Contraste (verificado en theme/__tests__/tokens.test.ts):
 * - Coral con texto blanco solo llega a 2.3:1, así que los botones coral usan texto `ink` (5.5:1).
 * - Salvia con texto blanco llega a 1.8:1: los botones salvia también usan texto `ink` (7.1:1).
 */
export const lightColors: ThemeColors = {
  background: brand.ivory,
  backgroundAlt: brand.ivoryDeep,
  surface: brand.white,
  surfaceAlt: '#EEF3F0',
  border: '#DCE3E1',
  text: brand.ink,
  textMuted: '#56666D',
  primary: brand.petrol,
  primaryShadow: brand.petrolDeep,
  onPrimary: brand.white,
  secondary: brand.sage,
  secondaryShadow: brand.sageDeep,
  onSecondary: brand.ink,
  accent: brand.coral,
  accentShadow: brand.coralDeep,
  onAccent: brand.ink,
  highlight: brand.petrol,
  stable: brand.petrol,
  stableShadow: brand.petrolDeep,
  success: feedback.victory,
  successShadow: feedback.victoryDeep,
  successSoft: '#D5F5E8',
  onSuccess: brand.ink,
  successText: '#047857',
  danger: feedback.retry,
  dangerShadow: feedback.retryDeep,
  dangerSoft: '#FDE3E3',
  onDanger: brand.white,
  dangerText: feedback.retryDeep,
  disabled: '#D9DEDC',
  disabledShadow: '#B9C1BE',
  onColor: brand.white,
  tabInactive: '#56666D',
  overlay: 'rgba(36, 52, 59, 0.55)',
};

export const darkColors: ThemeColors = {
  background: brand.petrolNight,
  backgroundAlt: '#0E2229',
  surface: brand.petrolNightSurface,
  surfaceAlt: brand.petrolNightAlt,
  border: '#2E5563',
  text: brand.ivory,
  textMuted: '#A9BEC6',
  primary: brand.petrolBright,
  primaryShadow: brand.petrolDeep,
  onPrimary: brand.white,
  secondary: brand.sage,
  secondaryShadow: brand.sageDeep,
  onSecondary: brand.ink,
  accent: brand.coral,
  accentShadow: brand.coralDeep,
  onAccent: brand.ink,
  highlight: '#7FB3C6',
  stable: brand.petrolBright,
  stableShadow: brand.petrolDeep,
  success: feedback.victory,
  successShadow: feedback.victoryDeep,
  successSoft: '#0F3B30',
  onSuccess: brand.ink,
  successText: '#34D399',
  danger: feedback.retry,
  dangerShadow: feedback.retryDeep,
  dangerSoft: '#4A1717',
  onDanger: brand.white,
  dangerText: '#FCA5A5',
  disabled: '#2E4A55',
  disabledShadow: '#1F3740',
  onColor: brand.white,
  tabInactive: '#A9BEC6',
  overlay: 'rgba(8, 20, 25, 0.7)',
};

/**
 * Alias heredados del diseño anterior. Se mantienen solo para las pantallas antiguas mientras se migran;
 * apuntan a la paleta VIRA.
 */
export const palette = {
  white: brand.white,
  phoenix: brand.coralDeep,
  amber: feedback.gold,
  victory: feedback.victory,
  retry: feedback.retry,
  sageLight: brand.sage,
} as const;

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999 } as const;

/** Altura del "labio" de los botones 3D estilo Duolingo. */
export const BUTTON_LIP = 5;

/** Tamaño mínimo de un objetivo táctil (WCAG / guías de iOS y Android). */
export const MIN_TOUCH = 44;

export const elevation = {
  card: {
    shadowColor: brand.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: brand.ink,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
} as const;

export { typography, fontFamily } from '@/theme/typography';
