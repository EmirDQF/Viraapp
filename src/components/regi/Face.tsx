import { Circle, Ellipse, G, Path } from 'react-native-svg';

import type { RegiColors, RegiPose } from '@/lib/regi';

function OpenEyes({ colors }: { readonly colors: RegiColors }) {
  return (
    <G>
      {[80, 120].map((cx) => (
        <G key={cx}>
          <Ellipse cx={cx} cy={71} rx={7} ry={8.5} fill={colors.ink} />
          <Circle cx={cx + 2.6} cy={67.5} r={2.8} fill={colors.shine} />
          <Circle cx={cx - 2.4} cy={74.5} r={1.2} fill={colors.shine} />
        </G>
      ))}
    </G>
  );
}

/** Ojos entrecerrados y cejas hacia arriba: expresión empática, sutil. */
function SoftEyes({ colors }: { readonly colors: RegiColors }) {
  return (
    <G stroke={colors.ink} strokeLinecap="round" fill="none">
      <Path d="M72 73 Q80 79 88 73" strokeWidth={3.5} />
      <Path d="M112 73 Q120 79 128 73" strokeWidth={3.5} />
      <Path d="M72 62 Q79 58 86 57" strokeWidth={2.6} />
      <Path d="M128 62 Q121 58 114 57" strokeWidth={2.6} />
    </G>
  );
}

function Mouth({ colors, pose }: { readonly colors: RegiColors; readonly pose: RegiPose }) {
  switch (pose) {
    case 'growth':
      return (
        <G>
          <Path d="M90 85 Q100 99 110 85 Z" fill={colors.ink} />
          <Ellipse cx={100} cy={92} rx={4} ry={2.4} fill={colors.cheek} />
        </G>
      );
    case 'empathetic':
      return <Path d="M94 88 Q100 91.5 106 88" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" fill="none" />;
    case 'resilient':
      return <Path d="M93 87 Q101 91 108 86" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" fill="none" />;
    case 'calm':
      return <Path d="M92 86 Q100 93 108 86" stroke={colors.ink} strokeWidth={3} strokeLinecap="round" fill="none" />;
  }
}

/** Rasgos mínimos: ojos, boca y mejillas. Las expresiones son sutiles, como pide la guía. */
export function Face({ colors, pose }: { readonly colors: RegiColors; readonly pose: RegiPose }) {
  return (
    <G>
      <Ellipse cx={65} cy={84} rx={8} ry={5} fill={colors.cheek} opacity={0.6} />
      <Ellipse cx={135} cy={84} rx={8} ry={5} fill={colors.cheek} opacity={0.6} />
      {pose === 'empathetic' ? <SoftEyes colors={colors} /> : <OpenEyes colors={colors} />}
      <Mouth colors={colors} pose={pose} />
    </G>
  );
}
