import { Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

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

/**
 * Cabeza grande y redonda (estilo chibi) con un brillo de luz difuso arriba a la izquierda, que le da volumen
 * sin contornos duros. `idPrefix` hace únicos los degradados (en web los <defs> de SVG son globales).
 */
export function Head({ colors, idPrefix }: { readonly colors: RegiColors; readonly idPrefix: string }) {
  const glossId = `${idPrefix}-gloss`;
  return (
    <G>
      <Defs>
        <RadialGradient id={glossId} cx="35%" cy="25%" r="45%">
          <Stop offset="0%" stopColor={colors.shine} stopOpacity={0.55} />
          <Stop offset="60%" stopColor={colors.shine} stopOpacity={0.12} />
          <Stop offset="100%" stopColor={colors.shine} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Ellipse cx={100} cy={66} rx={56} ry={46} fill={colors.body} />
      <Ellipse cx={100} cy={66} rx={56} ry={46} fill={`url(#${glossId})`} />
      <Ellipse cx={82} cy={38} rx={13} ry={6} fill={colors.shine} opacity={0.45} transform="rotate(-18 82 38)" />
    </G>
  );
}

/** Sombra de contacto elíptica bajo los pies: ancla a Regi al suelo. */
export function ContactShadow({ colors }: { readonly colors: RegiColors }) {
  return <Ellipse cx={100} cy={185} rx={48} ry={7} fill={colors.ink} opacity={0.14} />;
}
