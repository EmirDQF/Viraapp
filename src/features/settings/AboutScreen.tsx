import Constants from 'expo-constants';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ViraLogo } from '@/components/brand/ViraLogo';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { DEFAULT_HELPLINES } from '@/data/helplines';
import { HelplineRow } from '@/features/chat/CrisisCard';
import { goBackOrHome } from '@/features/game/navigation';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

/** "Sobre VIRA": qué es, descargo profesional, privacidad y líneas de ayuda. */
export function AboutScreen() {
  const { colors, isDark } = useTheme();
  const version = Constants.expoConfig?.version ?? '';
  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
            <ArrowLeft color={colors.text} size={24} />
          </Pressable>
          <View style={styles.logo}>
            <ViraLogo size={120} tone={isDark ? 'onDark' : 'onLight'} />
            {version ? (
              <AppText variant="caption" tone="muted">
                Versión {version}
              </AppText>
            ) : null}
          </View>
          <AppText variant="title" accessibilityRole="header">
            Sobre VIRA
          </AppText>
          <AppText>
            VIRA es un entrenamiento diario de resiliencia para jóvenes de 18 a 25 años. Con Regi practicas, en pocos minutos, habilidades para manejar el estrés, los impulsos y los días difíciles.
          </AppText>
          <Card style={styles.card}>
            <AppText variant="subtitle">VIRA no reemplaza la ayuda profesional</AppText>
            <AppText>
              VIRA no es un servicio de salud, no da diagnósticos ni tratamientos y no atiende emergencias. Si sientes que no puedes más o que corres peligro, busca a un profesional o llama a una línea de ayuda.
            </AppText>
          </Card>
          <Card style={styles.card}>
            <View style={styles.row}>
              <ShieldCheck color={colors.highlight} size={20} />
              <AppText variant="subtitle">Tu privacidad</AppText>
            </View>
            <AppText>
              Tu progreso, tus impulsos, tu muro, tus contactos y tu foto ancla se guardan solo en este teléfono. La conversación con Regi no se guarda: al usar la IA, tus mensajes se envían a nuestro servidor solo para generar la respuesta. Puedes borrar todo en Ajustes.
            </AppText>
          </Card>
          <AppText variant="heading" accessibilityRole="header">
            Líneas de ayuda ({DEFAULT_HELPLINES.country})
          </AppText>
          {DEFAULT_HELPLINES.helplines.map((line) => (
            <HelplineRow key={line.id} line={line} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  logo: { alignItems: 'center', gap: spacing.xs },
  card: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
