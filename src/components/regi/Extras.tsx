import { Circle, Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { tensionPath, type RegiColors } from '@/lib/regi';
import { gradients } from '@/theme/tokens';

const TENSION_SPIKES = 18;

function Heart({ color, x, y, size }: { readonly color: string; readonly x: number; readonly y: number; readonly size: number }) {
  const s = size / 10;
  return (
    <Path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 3 C-5 -2 -9 1 -7 5 C-5 8 0 11 0 11 C0 11 5 8 7 5 C9 1 5 -2 0 3 Z"
      fill={color}
    />
  );
}

/** Halo rosado y dos corazones pequeños: la pose empática. */
export function EmpatheticAura({ colors }: { readonly colors: RegiColors }) {
  return (
    <G>
      <Ellipse cx={100} cy={132} rx={66} ry={22} stroke={colors.gillTip} strokeWidth={3} fill="none" opacity={0.55} />
      <Heart color={colors.heart} x={52} y={116} size={9} />
      <Heart color={colors.heart} x={150} y={106} size={7} />
    </G>
  );
}

/**
 * Halo cuando Regi "brilla" por una buena decisión (glow > 0): el color del módulo en el centro se funde con
 * el degradado `regi` (lila) hacia fuera.
 */
export function GlowHalo({ id, color, intensity }: { readonly id: string; readonly color: string; readonly intensity: number }) {
  const [regiInner, regiOuter] = gradients.regi;
  return (
    <G>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="55%" r="50%">
          <Stop offset="0%" stopColor={color} stopOpacity={0.6 * intensity} />
          <Stop offset="45%" stopColor={regiOuter} stopOpacity={0.4 * intensity} />
          <Stop offset="75%" stopColor={regiInner} stopOpacity={0.16 * intensity} />
          <Stop offset="100%" stopColor={regiInner} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={100} cy={104} r={96} fill={`url(#${id})`} />
    </G>
  );
}

/** Contorno gris y tenso, con un halo apagado, cuando Regi refleja una mala decisión (glow < 0). */
export function TensionOutline({
  id,
  colors,
  intensity,
}: {
  readonly id: string;
  readonly colors: RegiColors;
  readonly intensity: number;
}) {
  return (
    <G>
      <Defs>
        <RadialGradient id={id} cx="50%" cy="55%" r="50%">
          <Stop offset="0%" stopColor={colors.tension} stopOpacity={0.28 * intensity} />
          <Stop offset="100%" stopColor={colors.tension} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={100} cy={104} r={92} fill={`url(#${id})`} />
      <Path
        d={tensionPath(100, 106, 90, TENSION_SPIKES)}
        stroke={colors.tension}
        strokeWidth={2.5}
        strokeLinejoin="round"
        fill="none"
        opacity={0.35 + 0.5 * intensity}
      />
    </G>
  );
}
