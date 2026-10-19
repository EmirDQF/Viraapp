import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { goBackOrHome } from '@/features/game/navigation';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface BackHeaderProps {
  readonly title: string;
  readonly onBack?: () => void;
  /** Contenido opcional a la derecha (p. ej. un botón de acción). */
  readonly right?: ReactNode;
}

/** Encabezado de pantalla secundaria: botón "Volver" y título. */
export function BackHeader({ title, onBack = goBackOrHome, right }: BackHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={onBack} hitSlop={10} style={styles.back}>
        <ArrowLeft color={colors.text} size={24} />
      </Pressable>
      <AppText variant="title" accessibilityRole="header" style={styles.title} numberOfLines={2}>
        {title}
      </AppText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  title: { flex: 1 },
});
