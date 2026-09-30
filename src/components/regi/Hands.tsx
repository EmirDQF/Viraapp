import { Ellipse, G, Path } from 'react-native-svg';

import { Leaf, Sprout } from '@/components/regi/Leaf';
import type { RegiColors, RegiPose } from '@/lib/regi';

function Hand({ colors, cx, cy }: { readonly colors: RegiColors; readonly cx: number; readonly cy: number }) {
  return <Ellipse cx={cx} cy={cy} rx={8.5} ry={6.5} fill={colors.shade} />;
}

/** Manos según la pose: sostienen la hoja, un brote o la ofrecen con el brazo extendido. */
export function Hands({ colors, pose }: { readonly colors: RegiColors; readonly pose: RegiPose }) {
  switch (pose) {
    case 'growth':
      return (
        <G>
          <Leaf colors={colors} x={84} y={138} rotate={-18} scale={0.9} />
          <Hand colors={colors} cx={78} cy={146} />
          <Sprout colors={colors} x={128} y={124} />
          <Hand colors={colors} cx={128} cy={136} />
        </G>
      );
    case 'resilient':
      return (
        <G>
          <Leaf colors={colors} x={92} y={142} rotate={-10} scale={0.8} />
          <Hand colors={colors} cx={92} cy={150} />
          <Path d="M124 138 Q142 132 156 122" stroke={colors.body} strokeWidth={13} strokeLinecap="round" fill="none" />
          <Leaf colors={colors} x={166} y={106} rotate={25} scale={0.85} bright />
          <Hand colors={colors} cx={159} cy={119} />
        </G>
      );
    case 'calm':
    case 'empathetic':
      return (
        <G>
          <Leaf colors={colors} x={100} y={138} />
          <Hand colors={colors} cx={86} cy={144} />
          <Hand colors={colors} cx={114} cy={144} />
        </G>
      );
  }
}
