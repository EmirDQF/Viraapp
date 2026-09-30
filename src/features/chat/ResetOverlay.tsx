import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { withAlpha } from '@/lib/color';
import { brand, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Animación de "Borrón y cuenta nueva" (maqueta 5): los mensajes se difuminan y aparece un mensaje de reinicio. */
export function ResetOverlay() {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(350)}
      exiting={FadeOut.duration(450)}
      accessibilityLiveRegion="assertive"
      style={StyleSheet.absoluteFill}
    >
      <LinearGradient
        colors={[withAlpha(brand.sage, 0.92), withAlpha(colors.background, 0.97), withAlpha(brand.sage, 0.92)]}
        style={[StyleSheet.absoluteFill, styles.center]}
      >
        <Animated.View entering={ZoomIn.delay(150).duration(400)} style={styles.content}>
          <View style={styles.sparkles}>
            <Sparkles color={brand.petrol} size={26} />
          </View>
          <RegiMascot pose="resilient" size={120} glow={0.6} glowColor={brand.sage} />
          <AppText variant="display" align="center" color={colors.highlight} style={styles.title}>
            Un mal día no te define
          </AppText>
          <AppText variant="bodyStrong" align="center" tone="muted">
            Reiniciando para un nuevo comienzo…
          </AppText>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  content: { alignItems: 'center', gap: spacing.md },
  sparkles: { alignSelf: 'flex-end' },
  title: { fontSize: 34, lineHeight: 40 },
});
