import type { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const BAR_HEIGHT = 60;
const ICON_SIZE = 22;
/** Espacio extra para que el contenido no quede pegado a la barra. */
const CONTENT_GAP = 8;

/** Colores de la barra del diseño "VIRA Caminos" (modo claro). */
const LIGHT_BAR = { background: '#FFFFFF', border: '#CCD8D2', inactive: '#53666D', active: '#24576A' } as const;

/** Espacio inferior que deben reservar las pantallas de pestañas para que la barra no tape nada. */
export function useTabBarSpace(): number {
  const insets = useSafeAreaInsets();
  return insets.bottom + BAR_HEIGHT + CONTENT_GAP;
}

/**
 * Barra de pestañas fija abajo: fondo blanco, borde superior suave y pestaña activa en teal con texto
 * ExtraBold. En modo oscuro usa la superficie del tema.
 */
export function GlassTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const palette =
    isDark
      ? { background: colors.surface, border: colors.border, inactive: colors.tabInactive, active: colors.highlight }
      : LIGHT_BAR;

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.bar, { paddingBottom: insets.bottom, backgroundColor: palette.background, borderTopColor: palette.border }]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const label = options.title ?? route.name;
        const color = focused ? palette.active : palette.inactive;

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
            {options.tabBarIcon?.({ focused, color, size: ICON_SIZE })}
            <AppText variant="tab" color={color} numberOfLines={1} style={focused ? styles.labelActive : styles.label}>
              {label}
            </AppText>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 9,
    paddingHorizontal: 6,
  },
  tab: { flex: 1, height: BAR_HEIGHT - 9, alignItems: 'center', justifyContent: 'flex-start', gap: 2 },
  label: { fontFamily: fontFamily.semibold, fontSize: 10.5 },
  labelActive: { fontFamily: fontFamily.extrabold, fontSize: 10.5 },
});
