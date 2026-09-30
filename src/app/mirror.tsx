import { useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isModuleId } from '@/data/modules/catalog';
import { MirrorView } from '@/features/game/MirrorView';
import { goBackOrHome } from '@/features/game/navigation';
import { MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Espejo emocional como pantalla suelta (p. ej. desde un enlace). Los parámetros se validan antes de usarlos. */
export default function MirrorRoute() {
  const { colors } = useTheme();
  const { module, good } = useLocalSearchParams<{ module?: string; good?: string }>();
  const tone = isModuleId(module) ? MODULE_COLORS[module] : undefined;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <MirrorView firstChoiceGood={good === '1'} tone={tone} onContinue={goBackOrHome} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, padding: spacing.lg },
});
