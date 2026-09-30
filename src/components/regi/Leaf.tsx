import { Circle, Ellipse, G, Path } from 'react-native-svg';

import type { RegiColors } from '@/lib/regi';

interface LeafProps {
  readonly colors: RegiColors;
  readonly x: number;
  readonly y: number;
  readonly rotate?: number;
  readonly scale?: number;
  /** Hoja "brillante" (pose resiliente): halo más grande e intenso. */
  readonly bright?: boolean;
}

/** Hoja verde con nervio y halo suave: el símbolo de regeneración que Regi sostiene. */
export function Leaf({ colors, x, y, rotate = 0, scale = 1, bright = false }: LeafProps) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <Circle r={bright ? 26 : 20} fill={colors.leafHalo} opacity={bright ? 0.45 : 0.3} />
      <Path d="M0 -18 C11 -10 12 6 0 18 C-12 6 -11 -10 0 -18 Z" fill={colors.leaf} />
      <Path d="M0 -13 L0 15" stroke={colors.leafVein} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M0 -2 L5 -7 M0 5 L-5 0 M0 9 L5 4" stroke={colors.leafVein} strokeWidth={1.2} strokeLinecap="round" />
    </G>
  );
}

/** Brote en tierra (pose "nutrición de crecimiento"). */
export function Sprout({ colors, x, y }: { readonly colors: RegiColors; readonly x: number; readonly y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Path d="M0 8 C0 0 1 -6 0 -12" stroke={colors.leafVein} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d="M0 -6 C-9 -12 -13 -5 -12 -3 C-8 -2 -3 -3 0 -6 Z" fill={colors.leaf} />
      <Path d="M0 -10 C8 -17 13 -10 12 -8 C8 -6 3 -7 0 -10 Z" fill={colors.leaf} />
      <Ellipse cx={0} cy={10} rx={10} ry={5} fill={colors.soil} />
    </G>
  );
}
