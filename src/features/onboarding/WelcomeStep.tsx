import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ViraLogo } from '@/components/brand/ViraLogo';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { spring } from '@/theme/motion';
import { radius, spacing } from '@/theme/tokens';
import { useReduceMotion } from '@/theme/useReduceMotion';

/**
 * Bienvenida: fondo aurora con manchas vivas, logo y Regi que entran con resorte, y el texto de la marca sobre
 * vidrio (ningún color de texto cumple AA sobre todas las paradas de la aurora, así que va sobre una superficie).
 */
export function WelcomeStep({ onStart }: { readonly onStart: () => void }) {
  const reduceMotion = useReduceMotion();
  const logoIn = reduceMotion ? FadeIn : FadeInDown.springify().damping(spring.gentle.damping);
  const regiIn = reduceMotion ? FadeIn : ZoomIn.delay(200).springify().damping(spring.gentle.damping);
  const textIn = reduceMotion ? FadeIn : FadeInDown.delay(350).springify().damping(spring.gentle.damping);

  return (
    <ScreenBackground variant="aurora">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={logoIn}>
            <ViraLogo size={104} framed />
          </Animated.View>
          <Animated.View entering={regiIn}>
            <RegiMascot pose="calm" size={196} glow={0.5} />
          </Animated.View>
          <Animated.View entering={textIn} style={styles.cardWrap}>
            <GlassCard elevation="lg" radius={radius.xl}>
              <View style={styles.text}>
                <AppText variant="display" align="center" accessibilityRole="header">
                  Nuevas formas de seguir
                </AppText>
                <AppText tone="muted" align="center">
                  Soy Regi, un ajolote. Mi nombre viene de regenerar: mi especie se recupera de lo que pierde. Te
                  acompaño a encontrar nuevas formas de seguir.
                </AppText>
                <AppText variant="caption" tone="muted" align="center">
                  VIRA es un espacio de reflexión y práctica para jóvenes de 18 a 25 años. No sustituye la atención
                  profesional: si estás en crisis, busca ayuda de inmediato.
                </AppText>
              </View>
            </GlassCard>
          </Animated.View>
        </ScrollView>
        <View style={styles.footer}>
          <Button3D label="Empezar" size="lg" variant="accent" onPress={onStart} haptics="medium" />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.screen },
  cardWrap: { alignSelf: 'stretch' },
  text: { gap: spacing.sm },
  footer: { paddingHorizontal: spacing.screen, paddingBottom: spacing.lg, paddingTop: spacing.sm },
});
