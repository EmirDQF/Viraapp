import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { MODULE_ORDER } from '@/data/modules/catalog';
import { ModulePath } from '@/features/progress/ModulePath';
import { countCompletedModules } from '@/lib/gamification/progress';
import { useAppStore } from '@/store/useAppStore';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId } from '@/types/game';

const NOTICE_MS = 3200;

/** Pestaña Misiones: el camino completo (6 temas × 13 etapas). Se puede volver a cualquier tema y rejugarlo. */
export function MissionsScreen() {
  const { colors } = useTheme();
  const modules = useAppStore((state) => state.modules);
  const name = useAppStore((state) => state.user?.name ?? '');
  const [notice, setNotice] = useState<string | null>(null);
  const completed = countCompletedModules(modules);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    setTimeout(() => setNotice((current) => (current === message ? null : current)), NOTICE_MS);
  }, []);

  const renderItem = useCallback(
    ({ item }: { readonly item: ModuleId }) => <ModulePath id={item} modules={modules} onLockedPress={showNotice} />,
    [modules, showNotice],
  );

  const greeting =
    completed === 0
      ? `${name ? `${name}, este` : 'Este'} es tu recorrido. Cada etapa toma pocos minutos.`
      : `Llevas ${completed} de ${MODULE_ORDER.length} temas. Puedes volver a cualquiera cuando quieras.`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <FlatList
        data={MODULE_ORDER}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        initialNumToRender={2}
        windowSize={5}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="title" accessibilityRole="header">
              El Recorrido
            </AppText>
            <RegiSays message={greeting} size={78} />
          </View>
        }
      />
      {notice ? (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          accessibilityLiveRegion="polite"
          style={[styles.toast, { backgroundColor: colors.text }]}
        >
          <AppText variant="bodyStrong" color={colors.background} align="center">
            {notice}
          </AppText>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header: { gap: spacing.md, marginBottom: spacing.lg },
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
  },
});
