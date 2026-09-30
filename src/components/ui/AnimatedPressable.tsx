import type { ReactNode } from 'react';
import { Pressable, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { haptic, type HapticKind } from '@/lib/haptics';
import { PRESS_SCALE, spring } from '@/theme/motion';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<PressableProps, 'style' | 'children'> {
  readonly children?: ReactNode;
  readonly style?: StyleProp<ViewStyle>;
  /** Escala al pulsar (0.97 por defecto). */
  readonly scaleTo?: number;
  /** Vibración al pulsar ("light" por defecto; "none" para desactivarla). */
  readonly haptics?: HapticKind;
}

/**
 * Pressable con respuesta física: se encoge con un resorte y vibra suave. Base de todo lo pulsable de la
 * interfaz 2026. Con "reducir movimiento", el `ReducedMotionConfig` del layout raíz anula el resorte.
 */
export function AnimatedPressable({
  children,
  style,
  scaleTo = PRESS_SCALE,
  haptics = 'light',
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePressIn = (event: GestureResponderEvent) => {
    scale.set(withSpring(scaleTo, spring.snappy));
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    scale.set(withSpring(1, spring.snappy));
    onPressOut?.(event);
  };

  const handlePress = (event: GestureResponderEvent) => {
    haptic(haptics);
    onPress?.(event);
  };

  return (
    <AnimatedPressableBase
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress ? handlePress : undefined}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  );
}
