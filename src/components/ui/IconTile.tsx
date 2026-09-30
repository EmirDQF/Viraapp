import { LinearGradient } from 'expo-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { darken, lighten, withAlpha } from '@/lib/color';
import { brand, type GradientStops } from '@/theme/tokens';

/** Grosor de trazo de los íconos lucide dentro de un tile. */
export const ICON_STROKE = 2.25;

/** Proporción radio/lado del squircle. */
const CORNER = 0.32;
const ICON_RATIO = 0.5;
const GLOSS_ALPHA = 0.45;

interface IconTileProps {
  /** Ícono lucide; alternativa: `children` para un ícono propio. */
  readonly icon?: LucideIcon;
  readonly children?: ReactNode;
  /** Color base del contexto (módulo, marca). El degradado y la sombra salen de él. */
  readonly color: string;
  /** Color del ícono (el `on` del módulo, con contraste AA). */
  readonly iconColor?: string;
  readonly size?: number;
  /** Degradado explícito en lugar del derivado de `color`. */
  readonly gradient?: GradientStops;
  /** Sin sombra (tiles pequeños dentro de listas). */
  readonly flat?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Ícono en "squircle" con aspecto 3D suave: degradado del color de su contexto, brillo arriba y sombra del
 * tono profundo. Decorativo: la etiqueta accesible la pone el elemento que lo contiene.
 */
export function IconTile({
  icon: Icon,
  children,
  color,
  iconColor = brand.white,
  size = 48,
  gradient,
  flat = false,
  style,
}: IconTileProps) {
  const cornerRadius = size * CORNER;
  const stops = gradient ?? [lighten(color, 0.18), color, darken(color, 0.12)];
  const shape = { width: size, height: size, borderRadius: cornerRadius };
  const shadow = flat
    ? null
    : {
        shadowColor: darken(color, 0.35),
        shadowOpacity: 0.35,
        shadowRadius: size * 0.18,
        shadowOffset: { width: 0, height: size * 0.1 },
        elevation: 4,
      };

  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={[shape, shadow, style]}
    >
      <View style={[shape, styles.clip]}>
        <LinearGradient colors={stops} start={{ x: 0.15, y: 0 }} end={{ x: 0.85, y: 1 }} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={[withAlpha(brand.white, GLOSS_ALPHA), withAlpha(brand.white, 0)]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.gloss, { borderRadius: cornerRadius }]}
        />
        <View style={styles.center}>
          {Icon ? <Icon color={iconColor} size={size * ICON_RATIO} strokeWidth={ICON_STROKE} /> : children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  gloss: { position: 'absolute', top: 1, left: 2, right: 2, height: '55%' },
  center: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
