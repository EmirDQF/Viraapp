import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, type EmptyStateProps } from '@/components/ui/EmptyState';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

export { EmptyState } from '@/components/ui/EmptyState';

/** Pantalla completa de estado vacío con área segura y fondo vivo. */
export function ComingSoon(props: EmptyStateProps) {
  return (
    <ScreenBackground variant="regi">
      <SafeAreaView style={styles.safe} edges={['top']}>
        <EmptyState {...props} />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
