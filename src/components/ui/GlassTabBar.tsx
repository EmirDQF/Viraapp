import type { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState, type ComponentProps } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { spring } from '@/theme/motion';
import { gradients, onGradient, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

/** Separación de la cápsula respecto a los bordes de la pantalla. */
const BAR_MARGIN = 12;
const BAR_HEIGHT = 68;
const ICON_SIZE = 22;
const INDICATOR_WIDTH = 52;
const INDICATOR_HEIGHT = 32;
const LABEL_GAP = 3;

/** Espacio inferior que deben reservar las pantallas de pestañas para que la barra flotante no tape nada. */
export function useTabBarSpace(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom + BAR_HEIGHT + BAR_MARGIN * 2;
}

/**
 * Barra de pestañas flotante: cápsula de vidrio separada 12 px de los bordes, con una pastilla aurora que se
 * desliza con resorte detrás del ícono activo.
 */
export function GlassTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const insets = useSafeAreaInsets();
  const [rowWidth, setRowWidth] = useState(0);
  const tabWidth = state.routes.length > 0 ? rowWidth / state.routes.length : 0;
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    const target = state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2;
    indicatorX.value = reduceMotion ? target : withSpring(target, spring.snappy);
  }, [indicatorX, reduceMotion, state.index, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({ transform: [{ translateX: indicatorX.value }] }));
  const onRowLayout = (event: LayoutChangeEvent) => setRowWidth(event.nativeEvent.layout.width);

  return (
    <View pointerEvents="box-none" style={[styles.host, { bottom: insets.bottom + BAR_MARGIN }]}>
      <GlassCard padded={false} radius={radius.pill} elevation="lg" style={styles.capsule}>
        <View accessibilityRole="tablist" style={styles.row} onLayout={onRowLayout}>
          {tabWidth > 0 ? (
            <Animated.View pointerEvents="none" style={[styles.indicator, indicatorStyle]}>
              <LinearGradient
                colors={gradients.auroraButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          ) : null}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const focused = state.index === index;
            const label = options.title ?? route.name;
            const iconColor = focused ? onGradient.auroraButton : colors.tabInactive;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };
            const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

            return (
              <AnimatedPressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                accessibilityState={{ selected: focused }}
                haptics="selection"
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
              >
                <View style={styles.iconSlot}>
                  {options.tabBarIcon?.({ focused, color: iconColor, size: ICON_SIZE })}
                </View>
                <AppText variant="tab" color={focused ? colors.highlight : colors.tabInactive} numberOfLines={1}>
                  {label}
                </AppText>
              </AnimatedPressable>
            );
          })}
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: BAR_MARGIN, right: BAR_MARGIN },
  capsule: { height: BAR_HEIGHT },
  row: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xs },
  indicator: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.xs,
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    height: BAR_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.sm,
    gap: LABEL_GAP,
  },
  iconSlot: { height: INDICATOR_HEIGHT, alignItems: 'center', justifyContent: 'center' },
});
