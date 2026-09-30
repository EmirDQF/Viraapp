import { router } from 'expo-router';
import { HeartHandshake, MessageCircle, Phone, X } from 'lucide-react-native';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { DEFAULT_HELPLINES, type Helpline } from '@/data/helplines';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

async function open(url: string): Promise<void> {
  try {
    await Linking.openURL(url);
  } catch {
    // Si el dispositivo no puede llamar (p. ej. una tablet), el número sigue visible para marcarlo a mano.
  }
}

function HelplineRow({ line }: { readonly line: Helpline }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.line, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.lineText}>
        <AppText variant="bodyStrong">{line.name}</AppText>
        <AppText variant="caption" tone="muted">
          {line.description}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Llamar a ${line.name}, ${line.display}`}
        onPress={() => void open(`tel:${line.phone}`)}
        style={[styles.call, { backgroundColor: colors.primary }]}
      >
        <Phone color={colors.onPrimary} size={16} />
        <AppText variant="caption" color={colors.onPrimary}>
          {line.display}
        </AppText>
      </Pressable>
      {line.whatsapp ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Escribir por WhatsApp a ${line.name}`}
          onPress={() => void open(`https://wa.me/${line.whatsapp}`)}
          style={[styles.icon, { borderColor: colors.border }]}
        >
          <MessageCircle color={colors.highlight} size={20} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Tarjeta de contención con líneas de ayuda y acceso a Apoyo Cercano (protocolo de crisis). */
export function CrisisCard({ onDismiss }: { readonly onDismiss: () => void }) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      accessibilityLiveRegion="assertive"
      style={[styles.card, { backgroundColor: colors.surfaceAlt, borderColor: colors.highlight }]}
    >
      <View style={styles.header}>
        <AppText variant="subtitle" style={styles.title}>
          No estás solo. Hablemos con alguien ahora.
        </AppText>
        <Pressable accessibilityRole="button" accessibilityLabel="Ocultar líneas de ayuda" onPress={onDismiss} hitSlop={10} style={styles.close}>
          <X color={colors.textMuted} size={20} />
        </Pressable>
      </View>
      <AppText tone="muted">Las líneas son gratuitas y confidenciales. Si estás en peligro inmediato, llama al 106.</AppText>
      {DEFAULT_HELPLINES.helplines.slice(0, 2).map((line) => (
        <HelplineRow key={line.id} line={line} />
      ))}
      <Button3D
        label="Avisar a mi Apoyo Cercano"
        variant="accent"
        icon={<HeartHandshake color={colors.onAccent} size={18} />}
        onPress={() => router.push('/support')}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 2, borderRadius: radius.xxl, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  title: { flex: 1 },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center', marginTop: -10, marginRight: -10 },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderRadius: radius.lg, padding: spacing.sm },
  lineText: { flex: 1 },
  call: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH },
  icon: { width: MIN_TOUCH, height: MIN_TOUCH, borderRadius: radius.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
