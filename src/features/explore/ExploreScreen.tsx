import { useCallback, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { RESOURCES, SAMPLE_EVENTS } from '@/data/explore';
import { EventCard } from '@/features/explore/EventCard';
import { LinkRow } from '@/features/explore/LinkRow';
import { TopicCard } from '@/features/explore/TopicCard';
import { recommendModules } from '@/lib/explore';
import { moduleOrder, moduleStatus } from '@/lib/gamification/progress';
import { useAppStore } from '@/store/useAppStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId } from '@/types/game';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

function SectionTitle({ title, children }: { readonly title: string; readonly children?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <AppText variant="heading" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

/** Pestaña Explorar: cada tema explicado, temas recomendados, recursos confiables y eventos de ejemplo. */
export function ExploreScreen() {
  const tabSpace = useTabBarSpace();
  const { colors } = useTheme();
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const recommended = recommendModules(modules, start);
  const others = moduleOrder(start).filter((id) => !recommended.includes(id));
  const [expanded, setExpanded] = useState<ModuleId | null>(recommended[0] ?? null);
  const [interested, setInterested] = useState<readonly string[]>([]);

  const toggleTopic = useCallback((id: ModuleId) => setExpanded((current) => (current === id ? null : id)), []);
  const toggleEvent = useCallback(
    (id: string) => setInterested((list) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id])),
    [],
  );

  const renderTopic = (id: ModuleId, isRecommended: boolean) => (
    <TopicCard key={id} id={id} status={moduleStatus(id, modules, start)} recommended={isRecommended} expanded={expanded === id} onToggle={toggleTopic} />
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabSpace }]}>
          <AppText variant="display" accessibilityRole="header">
            Explorar
          </AppText>
          <RegiSays pose="resilient" message="Aquí entiendes el porqué de cada tema. Saber cómo funciona tu mente también es entrenarla." size={78} />
          <SectionTitle title="Recomendado para ti" />
          {recommended.map((id) => renderTopic(id, true))}
          {others.length > 0 ? <SectionTitle title="Más temas" /> : null}
          {others.map((id) => renderTopic(id, false))}
          <SectionTitle title="Recursos confiables" />
          <Card style={styles.resources}>
            {RESOURCES.map((link) => (
              <LinkRow key={link.url} link={link} />
            ))}
            <AppText variant="caption" tone="muted">
              Solo enlazamos sitios oficiales y de salud pública. VIRA no reemplaza a un profesional.
            </AppText>
          </Card>
          <SectionTitle title="Eventos y campañas cerca de ti">
            <Badge label="Datos de ejemplo" color={colors.surfaceAlt} textColor={colors.textMuted} />
          </SectionTitle>
          <AppText tone="muted">
            Participar siempre es voluntario. Pronto verás actividades reales de tu zona; por ahora son ejemplos.
          </AppText>
          {SAMPLE_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} interested={interested.includes(event.id)} onToggle={toggleEvent} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap', marginTop: spacing.sm },
  resources: { gap: spacing.xs },
});
