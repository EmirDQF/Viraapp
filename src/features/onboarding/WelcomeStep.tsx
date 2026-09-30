import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ViraLogo } from '@/components/brand/ViraLogo';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Bienvenida: logo, Regi, la frase de la marca y el descargo profesional. */
export function WelcomeStep({ onStart }: { readonly onStart: () => void }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <ViraLogo size={112} framed />
        </Animated.View>
        <Animated.View entering={FadeInUp.delay(150).duration(500)}>
          <RegiMascot pose="calm" size={200} />
        </Animated.View>
        <AppText variant="title" align="center">
          Nuevas formas de seguir
        </AppText>
        <AppText tone="muted" align="center">
          Soy Regi, un ajolote. Mi nombre viene de regenerar: mi especie se recupera de lo que pierde. Te acompaño a
          encontrar nuevas formas de seguir.
        </AppText>
        <AppText variant="caption" tone="muted" align="center">
          VIRA es un espacio de reflexión y práctica para jóvenes de 18 a 25 años. No sustituye la atención
          profesional: si estás en crisis, busca ayuda de inmediato.
        </AppText>
      </ScrollView>
      <View style={styles.footer}>
        <Button3D label="Empezar" size="lg" onPress={onStart} haptics="medium" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  footer: { padding: spacing.lg },
});
