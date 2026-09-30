import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { ModulePath } from '@/features/progress/ModulePath';
import { countCompletedModules, moduleOrder } from '@/lib/gamification/progress';
import { useAppStore } from '@/store/useAppStore';
import { radius, spacing } from '@/theme/tokens';
import type { ModuleId } from '@/types/game';

const NOTICE_MS = 3200;

/** Pestaña Misiones: el camino completo (6 temas × 13 etapas). Se puede volver a cualquier tema y rejugarlo. */
export function MissionsScreen() {
  const tabSpace = useTabBarSpace();
  const modules = useAppStore((state) => state.modules);
  const name = useAppStore((state) => state.user?.name ?? '');
  const start = useAppStore((state) => state.onboarding.firstModule);
  const order = moduleOrder(start);
  const [notice, setNotice] = useState<string | null>(null);
  const completed = countCompletedModules(modules);

  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  const showNotice = useCallback((message: string) => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = setTimeout(() => setNotice(null), NOTICE_MS);
  }, []);

  const renderItem = useCallback(
    ({ item }: { readonly item: ModuleId }) => (
      <ModulePath id={item} modules={modules} start={start} onLockedPress={showNotice} />
    ),
    [modules, showNotice, start],
  );

  const greeting =
    completed === 0
      ? `${name ? `${name}, este` : 'Este'} es tu recorrido. Cada etapa toma pocos minutos.`
      : `Llevas ${completed} de ${order.length} temas. Puedes volver a cualquiera cuando quieras.`;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={order}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={[styles.content, { paddingBottom: tabSpace + spacing.lg }]}
          initialNumToRender={2}
          windowSize={5}
          ListHeaderComponent={
            <View style={styles.header}>
              <AppText variant="overline" tone="muted" uppercase>
                {completed} de {order.length} temas completados
              </AppText>
              <AppText variant="display" accessibilityRole="header">
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
            style={[styles.toast, { bottom: tabSpace }]}
          >
            <GlassCard elevation="lg" radius={radius.lg}>
              <AppText variant="bodyStrong" align="center">
                {notice}
              </AppText>
            </GlassCard>
          </Animated.View>
        ) : null}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.md },
  header: { gap: spacing.sm, marginBottom: spacing.xl },
  toast: { position: 'absolute', left: spacing.screen, right: spacing.screen },
});
