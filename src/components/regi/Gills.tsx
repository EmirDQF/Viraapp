import { Circle, G, Line, Path } from 'react-native-svg';

import type { RegiColors } from '@/lib/regi';

/** Una branquia en forma de fronda/pluma, dibujada en el origen apuntando hacia +x. */
function Frond({ colors, transform }: { readonly colors: RegiColors; readonly transform: string }) {
  const barbs = [
    { x: 10, y: -2 },
    { x: 18, y: -3 },
    { x: 26, y: -3 },
  ];
  return (
    <G transform={transform}>
      <Path d="M0 0 Q17 -4 34 -2" stroke={colors.gill} strokeWidth={6} strokeLinecap="round" fill="none" />
      {barbs.map((barb) => (
        <G key={barb.x} stroke={colors.gill} strokeWidth={4} strokeLinecap="round">
          <Line x1={barb.x} y1={barb.y} x2={barb.x + 5} y2={barb.y - 8} />
          <Line x1={barb.x} y1={barb.y} x2={barb.x + 5} y2={barb.y + 7} />
        </G>
      ))}
      <Circle cx={34} cy={-2} r={4.5} fill={colors.gillTip} />
    </G>
  );
}

const LEFT_FRONDS = ['translate(58 44) rotate(-140)', 'translate(50 62) rotate(-172)', 'translate(52 80) rotate(160)'];

/** Tres branquias por lado; el lado derecho es el reflejo del izquierdo. */
export function Gills({ colors }: { readonly colors: RegiColors }) {
  const side = LEFT_FRONDS.map((transform) => <Frond key={transform} colors={colors} transform={transform} />);
  return (
    <G>
      <G>{side}</G>
      <G transform="translate(200 0) scale(-1 1)">
        {LEFT_FRONDS.map((transform) => (
          <Frond key={transform} colors={colors} transform={transform} />
        ))}
      </G>
    </G>
  );
}
