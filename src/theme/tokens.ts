/**
 * Tokens de diseño VIRA 2026 ("con más vida"): misma identidad (petróleo, menta, coral, marfil) con más
 * saturación y luz. Todos los colores de la interfaz salen de aquí; las ilustraciones usan sus propias
 * constantes (REGI, LOGO).
 */
import { mix } from '@/lib/color';

/** Paleta de marca. Las variantes *Deep (~15 % más oscuras) son el "labio" de los botones 3D. */
export const brand = {
  petrol: '#16708F',
  petrolDeep: '#0F5870',
  /** Petróleo para superficies activas en modo oscuro (texto blanco 5.0:1). */
  petrolBright: '#17789A',
  petrolNight: '#0B2029',
  petrolNightMid: '#102C38',
  petrolNightSurface: '#13303C',
  petrolNightAlt: '#1B3D4B',
  /** Menta viva (antes salvia). Se conserva el nombre `sage` para no romper las pantallas. */
  sage: '#5ED3A0',
  sageDeep: '#3FB583',
  coral: '#FF7A59',
  coralDeep: '#E0593A',
  /** Color de Regi (chat, mascota, espejo positivo). Texto blanco 4.7:1. */
  lilac: '#6F5FEA',
  lilacDeep: '#5646CC',
  lilacSoft: '#ECEAFF',
  lilacLight: '#B3A8FF',
  teal: '#2FB8A8',
  tealDeep: '#0E7C6F',
  amber: '#FFB547',
  goldLight: '#FDE68A',
  ivory: '#FBF8F2',
  ivoryDeep: '#EFEAE0',
  ink: '#15262E',
  inkDeep: '#0D1A20',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Colores de feedback de acierto/error. */
export const feedback = {
  victory: '#10B981',
  victoryDeep: '#0E9D6E',
  retry: '#DC2626',
  retryDeep: '#B91C1C',
  gold: '#EAB308',
  goldDeep: '#B8860B',
} as const;

export type ModuleColorKey = 'descarga' | 'enfriador' | 'freno' | 'hoy' | 'ancla' | 'muro';

export interface ModuleTone {
  readonly base: string;
  readonly deep: string;
  /** Texto/íconos sobre `base` con contraste AA. */
  readonly on: string;
  /** Tinte suave (~12 %) del color sobre el fondo claro. Se usa con texto `ink` o `deep`. */
  readonly soft: string;
  /** Tinte suave del color sobre el fondo oscuro. Se usa con texto claro. */
  readonly softDark: string;
}

const SOFT_TINT = 0.12;
const SOFT_TINT_DARK = 0.24;
const DEEP_SHADE = 0.15;

function moduleTone(base: string, on: string): ModuleTone {
  return {
    base,
    deep: mix(base, brand.black, DEEP_SHADE),
    on,
    soft: mix(brand.ivory, base, SOFT_TINT),
    softDark: mix(brand.petrolNight, base, SOFT_TINT_DARK),
  };
}

/** Color propio de cada módulo (su gajo en el dial), vivos como en la maqueta 2. */
export const MODULE_COLORS: Readonly<Record<ModuleColorKey, ModuleTone>> = {
  hoy: moduleTone('#16A34A', brand.ink),
  descarga: moduleTone('#2563EB', brand.white),
  freno: moduleTone('#FF5A36', brand.ink),
  enfriador: moduleTone('#7446F0', brand.white),
  ancla: moduleTone('#F59E0B', brand.ink),
  muro: moduleTone('#EAB308', brand.ink),
};

/** Paradas de un degradado (de arriba-izquierda a abajo-derecha). */
export type GradientStops = readonly [string, string, ...string[]];

/**
 * Degradados de la marca. `aurora` y `regi` son decorativos (sin texto encima); para texto se usan las variantes
 * *Button o el color de `onGradient`, que cumple AA en todas las paradas.
 */
export const gradients = {
  aurora: [brand.petrol, brand.teal, brand.sage],
  /** Aurora oscurecida para botones con texto blanco (≥ 5:1 en todas sus paradas). */
  auroraButton: [brand.petrolDeep, brand.tealDeep],
  sunrise: [brand.coral, brand.amber],
  regi: [brand.lilac, brand.lilacLight],
  regiButton: [brand.lilacDeep, brand.lilac],
  gold: [feedback.gold, brand.goldLight],
  /** Verde-lima del espejo emocional positivo (anillo de "buena decisión"). */
  growth: [feedback.victory, '#A3E635'],
  nightSky: [brand.petrolNight, brand.petrolNightMid],
  daySky: [brand.ivory, brand.ivoryDeep],
  danger: [feedback.retry, feedback.retryDeep],
} as const satisfies Record<string, GradientStops>;

export type GradientName = keyof typeof gradients;

/** Texto legible (AA) sobre todas las paradas de cada degradado. `aurora` y `regi` son decorativos: sin texto encima. */
export const onGradient: Readonly<Record<Exclude<GradientName, 'aurora' | 'regi'>, string>> = {
  auroraButton: brand.white,
  sunrise: brand.ink,
  regiButton: brand.white,
  gold: brand.ink,
  growth: brand.ink,
  nightSky: brand.ivory,
  daySky: brand.ink,
  danger: brand.white,
};

/** Manchas difusas de los fondos vivos (se pintan con opacidad baja sobre el degradado). */
export const blobColors = {
  light: [brand.sage, brand.lilacLight, brand.coral],
  dark: [brand.petrol, brand.lilac, brand.teal],
} as const;

export type BackgroundVariant = 'default' | 'aurora' | 'regi' | 'warm' | 'gold';

interface BackgroundGradient {
  readonly light: GradientStops;
  readonly dark: GradientStops;
  /** Manchas propias de la variante (si no, las del tema). */
  readonly blobs?: readonly string[];
}

/** Fondos de pantalla (ScreenBackground) por variante, en claro y oscuro. */
export const backgroundGradients: Readonly<Record<BackgroundVariant, BackgroundGradient>> = {
  default: { light: gradients.daySky, dark: gradients.nightSky },
  aurora: {
    light: gradients.aurora,
    dark: [brand.petrolNight, brand.petrolDeep],
    blobs: [brand.sage, brand.lilacLight],
  },
  regi: { light: [brand.lilacSoft, brand.ivory], dark: [brand.petrolNight, '#1A1840'], blobs: [brand.lilac, brand.lilacLight] },
  warm: { light: [brand.ivory, '#FFE9DC'], dark: [brand.petrolNight, '#2A1E1A'], blobs: [brand.coral, brand.amber] },
  gold: { light: [brand.ivory, '#FFF4CC'], dark: [brand.petrolNight, '#2A2410'], blobs: [brand.goldLight, brand.amber] },
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
  readonly regi: string;
  readonly regiShadow: string;
  readonly onRegi: string;
  readonly regiSoft: string;
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
  /** Tinte translúcido de las superficies de vidrio. */
  readonly glass: string;
  /** Borde de luz (1 px) de las superficies de vidrio y elevadas. */
  readonly glassBorder: string;
  /** Color de las sombras difusas. */
  readonly shadow: string;
}

/*
 * Contraste (verificado en theme/__tests__/tokens.test.ts):
 * - Coral y menta usan texto `ink` (6.1 y 8.4:1); con blanco no llegan a AA.
 * - Lila usa texto blanco (4.7:1).
 */
export const lightColors: ThemeColors = {
  background: brand.ivory,
  backgroundAlt: brand.ivoryDeep,
  surface: brand.white,
  surfaceAlt: '#EEF5F2',
  border: '#DDE5E3',
  text: brand.ink,
  textMuted: '#51656E',
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
  regi: brand.lilac,
  regiShadow: brand.lilacDeep,
  onRegi: brand.white,
  regiSoft: brand.lilacSoft,
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
  tabInactive: '#51656E',
  overlay: 'rgba(21, 38, 46, 0.55)',
  glass: 'rgba(255, 255, 255, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.9)',
  shadow: '#0F3A4A',
};

export const darkColors: ThemeColors = {
  background: brand.petrolNight,
  backgroundAlt: '#081820',
  surface: brand.petrolNightSurface,
  surfaceAlt: brand.petrolNightAlt,
  border: '#24505F',
  text: brand.ivory,
  textMuted: '#9FB9C4',
  primary: brand.petrolBright,
  primaryShadow: brand.petrolDeep,
  onPrimary: brand.white,
  secondary: brand.sage,
  secondaryShadow: brand.sageDeep,
  onSecondary: brand.ink,
  accent: brand.coral,
  accentShadow: brand.coralDeep,
  onAccent: brand.ink,
  highlight: '#7FC8E0',
  regi: brand.lilac,
  regiShadow: brand.lilacDeep,
  onRegi: brand.white,
  regiSoft: '#231F4D',
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
  disabled: '#24424E',
  disabledShadow: '#17303A',
  onColor: brand.white,
  tabInactive: '#9FB9C4',
  overlay: 'rgba(5, 16, 21, 0.72)',
  glass: 'rgba(19, 48, 60, 0.72)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  shadow: '#02090C',
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

/** Escala de 4 (xxs = 2 solo para ajustes finos). Margen lateral de pantalla: `screen`. */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  screen: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

/** Radios 2026. `xxl` (28) es el radio de las tarjetas grandes del bento. */
export const radius = { sm: 12, md: 18, lg: 24, xxl: 28, xl: 32, pill: 999 } as const;

/** Altura del "labio" de los botones 3D estilo Duolingo. */
export const BUTTON_LIP = 5;

/** Tamaño mínimo de un objetivo táctil (48 dp, guía de Android; supera los 44 pt de iOS). */
export const MIN_TOUCH = 48;

/** Altura de los botones principales. */
export const BUTTON_HEIGHT = 56;

/**
 * Tres niveles de elevación con sombras suaves y difusas. En oscuro se usa `elevationFor`, que tiñe la sombra
 * y la refuerza; los componentes añaden además el borde interior `glassBorder`. `card` y `raised` son alias
 * heredados de `md` y `lg`.
 */
const SHADOW_COLOR = lightColors.shadow;

const elevationSm = {
  shadowColor: SHADOW_COLOR,
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2,
} as const;

const elevationMd = {
  shadowColor: SHADOW_COLOR,
  shadowOpacity: 0.1,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 8 },
  elevation: 5,
} as const;

const elevationLg = {
  shadowColor: SHADOW_COLOR,
  shadowOpacity: 0.16,
  shadowRadius: 32,
  shadowOffset: { width: 0, height: 16 },
  elevation: 10,
} as const;

export const elevation = {
  sm: elevationSm,
  md: elevationMd,
  lg: elevationLg,
  card: elevationMd,
  raised: elevationLg,
} as const;

export type ElevationLevel = 'sm' | 'md' | 'lg';

const DARK_SHADOW_BOOST = 2.5;

/** Elevación adaptada al tema: en oscuro la sombra es más profunda para que la capa se despegue del fondo. */
export function elevationFor(level: ElevationLevel, isDark: boolean) {
  const base = elevation[level];
  if (!isDark) {
    return base;
  }
  return {
    ...base,
    shadowColor: darkColors.shadow,
    shadowOpacity: Math.min(1, base.shadowOpacity * DARK_SHADOW_BOOST),
  };
}

export { typography, fontFamily } from '@/theme/typography';
