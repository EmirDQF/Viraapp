import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

import { weekdayInitial, weekdayName } from '@/lib/dates';
import type { DayStat } from '@/lib/timeline';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

const HEIGHT = 120;
const LABEL_SPACE = 20;
const BAR_RADIUS = 6;
/** Altura mínima visible para los días sin práctica (una base gris). */
const EMPTY_BAR = 4;

/** Mini gráfico de barras de los últimos 7 días (minutos de práctica). Hoy se resalta. */
export function WeekChart({ days }: { readonly days: readonly DayStat[] }) {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const max = Math.max(5, ...days.map((day) => day.minutes));
  const slot = width / Math.max(1, days.length);
  const barWidth = Math.min(28, slot * 0.55);
  const plot = HEIGHT - LABEL_SPACE;
  const summary = days.map((day) => `${weekdayName(day.day)}: ${Math.round(day.minutes)} minutos`).join(', ');

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Minutos de práctica de los últimos 7 días. ${summary}`}
      style={styles.root}
    >
      {width > 0 ? (
        <Svg width={width} height={HEIGHT}>
          {days.map((day, index) => {
            const isToday = index === days.length - 1;
            const height = day.minutes > 0 ? Math.max(EMPTY_BAR * 2, (day.minutes / max) * (plot - 8)) : EMPTY_BAR;
            const x = slot * index + (slot - barWidth) / 2;
            return [
              <Rect
                key={`bar-${day.day}`}
                x={x}
                y={plot - height}
                width={barWidth}
                height={height}
                rx={Math.min(BAR_RADIUS, height / 2)}
                fill={day.minutes > 0 ? (isToday ? colors.accent : colors.highlight) : colors.border}
              />,
              <SvgText
                key={`label-${day.day}`}
                x={slot * index + slot / 2}
                y={HEIGHT - 4}
                fontSize={12}
                fontFamily={fontFamily.bold}
                fill={isToday ? colors.text : colors.textMuted}
                textAnchor="middle"
              >
                {weekdayInitial(day.day)}
              </SvgText>,
            ];
          })}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { height: HEIGHT, width: '100%' },
});
