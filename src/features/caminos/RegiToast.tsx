import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';

import { RegiAvatar } from '@/features/caminos/RegiOrb';
import { caminos, caminosText } from '@/features/caminos/theme';
import { MAX_FONT_SCALE } from '@/theme/typography';

const VISIBLE_MS = 2400;
const FADE_MS = 220;

interface RegiToastProps {
  /** Mensaje actual; cada `id` nuevo vuelve a mostrar el aviso. */
  readonly message: { readonly id: number; readonly text: string } | null;
  readonly bottom: number;
}

/** Aviso breve de Regi (por ejemplo, al tocar una parada que llegará pronto). */
export function RegiToast({ message, bottom }: RegiToastProps) {
  const visible = useSharedValue(0);

  useEffect(() => {
    if (!message) return;
    AccessibilityInfo.announceForAccessibility(message.text);
    visible.value = withSequence(withTiming(1, { duration: FADE_MS }), withDelay(VISIBLE_MS, withTiming(0, { duration: FADE_MS })));
  }, [message, visible]);

  const style = useAnimatedStyle(() => ({ opacity: visible.value, transform: [{ translateY: 12 * (1 - visible.value) }] }));

  if (!message) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.toast, { bottom }, style]} accessibilityLiveRegion="polite">
      <RegiAvatar size={32} />
      <View style={styles.flex}>
        <Text style={styles.text} maxFontSizeMultiplier={MAX_FONT_SCALE}>
          {message.text}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: caminos.teal,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    zIndex: 30,
    elevation: 6,
  },
  flex: { flex: 1 },
  text: { ...caminosText.body, color: caminos.appBg },
});
