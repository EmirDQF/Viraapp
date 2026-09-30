import { Ellipse, G, Path } from 'react-native-svg';

import type { RegiColors, RegiPose } from '@/lib/regi';

const TAIL_RESTING = 'M118 162 C148 178 176 172 186 150 C189 142 182 139 178 146 C168 161 148 164 126 150 Z';
const TAIL_RAISED = 'M120 156 C142 148 158 120 174 108 C181 103 186 110 180 116 C166 128 154 152 128 166 Z';

/** Cola larga y curvada; en la pose "resiliente" se levanta. */
export function Tail({ colors, pose }: { readonly colors: RegiColors; readonly pose: RegiPose }) {
  return <Path d={pose === 'resilient' ? TAIL_RAISED : TAIL_RESTING} fill={colors.shade} />;
}

/** Cuerpo pequeño sentado, panza clara y patitas. */
export function Torso({ colors }: { readonly colors: RegiColors }) {
  return (
    <G>
      <Ellipse cx={100} cy={140} rx={37} ry={35} fill={colors.body} />
      <Ellipse cx={100} cy={148} rx={23} ry={23} fill={colors.belly} />
      <Ellipse cx={80} cy={177} rx={11} ry={6} fill={colors.shade} />
      <Ellipse cx={120} cy={177} rx={11} ry={6} fill={colors.shade} />
    </G>
  );
}

/** Cabeza grande y redonda (estilo chibi) con una sombra suave bajo la barbilla. */
export function Head({ colors }: { readonly colors: RegiColors }) {
  return (
    <G>
      <Ellipse cx={100} cy={66} rx={56} ry={46} fill={colors.body} />
      <Ellipse cx={84} cy={40} rx={16} ry={8} fill={colors.shine} opacity={0.25} />
    </G>
  );
}
