export const palette = {
  sand: '#F8F9FA',
  obsidian: '#0F172A',
  sage: '#2D6A4F',
  sageLight: '#40916C',
  sageDeep: '#1B4332',
  phoenix: '#D97706',
  amber: '#F59E0B',
  phoenixDeep: '#92400E',
  slate: '#1E293B',
  slateLight: '#334155',
  victory: '#10B981',
  victoryDeep: '#047857',
  retry: '#EF4444',
  retryDeep: '#B91C1C',
  white: '#FFFFFF',
} as const;

export interface ThemeColors {
  readonly background: string;
  readonly surface: string;
  readonly surfaceAlt: string;
  readonly border: string;
  readonly text: string;
  readonly textMuted: string;
  readonly primary: string;
  readonly primaryShadow: string;
  readonly accent: string;
  readonly accentShadow: string;
  readonly stable: string;
  readonly stableShadow: string;
  readonly success: string;
  readonly successShadow: string;
  readonly successSoft: string;
  readonly danger: string;
  readonly dangerShadow: string;
  readonly dangerSoft: string;
  readonly disabled: string;
  readonly disabledShadow: string;
  readonly onColor: string;
}

export const lightColors: ThemeColors = {
  background: palette.sand,
  surface: palette.white,
  surfaceAlt: '#EEF3EF',
  border: '#E2E8F0',
  text: palette.slate,
  textMuted: '#64748B',
  primary: palette.sage,
  primaryShadow: palette.sageDeep,
  accent: palette.phoenix,
  accentShadow: palette.phoenixDeep,
  stable: palette.slateLight,
  stableShadow: palette.slate,
  success: palette.victory,
  successShadow: palette.victoryDeep,
  successSoft: '#D1FAE5',
  danger: palette.retry,
  dangerShadow: palette.retryDeep,
  dangerSoft: '#FEE2E2',
  disabled: '#CBD5E1',
  disabledShadow: '#94A3B8',
  onColor: palette.white,
};

export const darkColors: ThemeColors = {
  background: palette.obsidian,
  surface: palette.slate,
  surfaceAlt: '#1A2E2A',
  border: palette.slateLight,
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  primary: palette.sageLight,
  primaryShadow: palette.sageDeep,
  accent: palette.amber,
  accentShadow: palette.phoenixDeep,
  stable: '#475569',
  stableShadow: '#1E293B',
  success: palette.victory,
  successShadow: palette.victoryDeep,
  successSoft: '#064E3B',
  danger: palette.retry,
  dangerShadow: palette.retryDeep,
  dangerSoft: '#450A0A',
  disabled: '#334155',
  disabledShadow: '#1E293B',
  onColor: palette.white,
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const radius = { md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const typography = {
  display: { fontSize: 40, fontWeight: '900', letterSpacing: 2 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '500', lineHeight: 23 },
  caption: { fontSize: 13, fontWeight: '600' },
} as const;

export const BUTTON_LIP = 4;
