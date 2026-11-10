import { ChevronRight } from 'lucide-react-native';
import { memo, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import type { CaminoPath } from '@/data/caminos/types';
import { CaminoIcon } from '@/features/caminos/CaminoIcon';
import { caminos, caminosText, PATH_COLORS } from '@/features/caminos/theme';
import { useRise } from '@/features/caminos/useRise';
import { pathMeta } from '@/lib/caminos';
import { MAX_FONT_SCALE } from '@/theme/typography';

const HIGHLIGHT_MS = 120;

interface PathCardProps {
  readonly path: CaminoPath;
  readonly index: number;
  readonly visible: boolean;
  readonly highlighted: boolean;
  readonly reduceMotion: boolean;
  readonly onOpen: (index: number) => void;
}

/** Tarjeta de un camino: aparece escalonada (+130 ms por tarjeta) y se resalta durante "Que Regi elija". */
export const PathCard = memo(function PathCard({ path, index, visible, highlighted, reduceMotion, onOpen }: PathCardProps) {
  const color = PATH_COLORS[path.id];
  const meta = pathMeta(path);
  const rise = useRise(visible, index * 130 + 250, 550, reduceMotion);
  const lit = useSharedValue(0);

  useEffect(() => {
    lit.value = withTiming(highlighted ? 1 : 0, { duration: reduceMotion ? 0 : HIGHLIGHT_MS });
  }, [highlighted, lit, reduceMotion]);

  const litStyle = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.02 * lit.value }] }));

  return (
    <Animated.View style={rise}>
      <Animated.View style={litStyle}>
        <Pressable
          onPress={() => onOpen(index)}
          accessibilityRole="button"
          accessibilityLabel={`Camino ${path.number}: ${path.name}. ${meta}`}
          accessibilityState={{ selected: highlighted }}
          style={({ pressed }) => [styles.card, { borderColor: highlighted ? color : 'transparent' }, pressed && styles.pressed]}
        >
          <View style={[styles.tile, { backgroundColor: color }]}>
            <CaminoIcon name={path.icon} size={27} color={caminos.cardBg} />
          </View>
          <View style={styles.text}>
            <Text style={[caminosText.eyebrow, { color }]} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {`Camino ${path.number}`}
            </Text>
            <Text style={[caminosText.cardTitle, styles.title]} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {path.name}
            </Text>
            <Text style={[caminosText.small, styles.meta]} maxFontSizeMultiplier={MAX_FONT_SCALE}>
              {meta}
            </Text>
          </View>
          <ChevronRight color={caminos.line} size={20} strokeWidth={2} />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: caminos.cardBg,
    borderRadius: 22,
    padding: 14,
    borderWidth: 2,
    shadowColor: caminos.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: { opacity: 0.92 },
  tile: { width: 56, height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, minWidth: 0 },
  title: { marginTop: 1 },
  meta: { marginTop: 3 },
});
