import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiMascot, type RegiPose } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly pose?: RegiPose;
  readonly children?: React.ReactNode;
}

/** Estado vacío/amable con Regi: se usa en pantallas sin datos todavía. */
export function EmptyState({ title, message, pose = 'calm', children }: EmptyStateProps) {
  return (
    <View style={styles.center}>
      <RegiMascot pose={pose} size={160} />
      <AppText variant="heading" align="center" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="muted" align="center">
        {message}
      </AppText>
      {children}
    </View>
  );
}

/** Pantalla completa de estado vacío con área segura. */
export function ComingSoon(props: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <EmptyState {...props} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
});
