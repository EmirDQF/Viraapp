import { memo } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import {
  LEAF_PATH,
  LOGO,
  LOGO_BODY,
  LOGO_BODY_WIDTH,
  LOGO_EYE,
  LOGO_HEAD,
  LOGO_LEAVES,
  LOGO_LEGS,
  LOGO_SMILE,
  LOGO_TAIL,
  LOGO_VIEWBOX,
  LOGO_WORDMARK,
  LOGO_WORDMARK_WIDTH,
  MARK_OFFSET_Y,
  type LogoVariant,
} from '@/components/brand/logoGeometry';

interface ViraLogoProps {
  readonly size?: number;
  readonly variant?: LogoVariant;
  /** onDark: ajolote blanco para fondos oscuros; onLight: ajolote petróleo para fondos claros. */
  readonly tone?: 'onDark' | 'onLight';
  /** Enmarca el logo en el cuadro petróleo redondeado (como el logo original). */
  readonly framed?: boolean;
}

/** Logo VIRA: ajolote en "S" con hojas coral y salvia, y el wordmark "VIRA". */
export const ViraLogo = memo(function ViraLogo({ size = 120, variant = 'full', tone = 'onLight', framed = false }: ViraLogoProps) {
  const figure = framed || tone === 'onDark' ? LOGO.figure : LOGO.background;
  const eye = figure === LOGO.figure ? LOGO.eye : LOGO.figure;
  const shiftY = variant === 'mark' ? MARK_OFFSET_Y : 0;
  const head = LOGO_HEAD;
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel="VIRA, nuevas formas de seguir"
      style={{ width: size, height: size }}
    >
      <Svg viewBox={`0 0 ${LOGO_VIEWBOX} ${LOGO_VIEWBOX}`} width={size} height={size}>
        {framed ? <Rect width={LOGO_VIEWBOX} height={LOGO_VIEWBOX} rx={26} fill={LOGO.background} /> : null}
        <G transform={`translate(0 ${shiftY})`}>
          {LOGO_LEAVES.map((leaf) => (
            <Path key={leaf.transform} d={LEAF_PATH} transform={leaf.transform} fill={leaf.tone === 'coral' ? LOGO.coral : LOGO.sage} />
          ))}
          <Path d={LOGO_BODY} stroke={figure} strokeWidth={LOGO_BODY_WIDTH} strokeLinecap="round" fill="none" />
          <Path d={LOGO_TAIL} fill={figure} />
          {LOGO_LEGS.map((leg) => (
            <Ellipse
              key={leg.cx}
              cx={leg.cx}
              cy={leg.cy}
              rx={leg.rx}
              ry={leg.ry}
              transform={`rotate(${leg.rotate} ${leg.cx} ${leg.cy})`}
              fill={figure}
            />
          ))}
          <Ellipse
            cx={head.cx}
            cy={head.cy}
            rx={head.rx}
            ry={head.ry}
            transform={`rotate(${head.rotate} ${head.cx} ${head.cy})`}
            fill={figure}
          />
          <Circle cx={LOGO_EYE.cx} cy={LOGO_EYE.cy} r={LOGO_EYE.r} fill={eye} />
          <Path d={LOGO_SMILE} stroke={eye} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </G>
        {variant === 'full'
          ? LOGO_WORDMARK.map((d) => (
              <Path
                key={d}
                d={d}
                stroke={figure}
                strokeWidth={LOGO_WORDMARK_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))
          : null}
      </Svg>
    </View>
  );
});
