import { Clock, ShieldCheck, Smile } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, View, type SectionListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { StatPill } from '@/components/ui/StatPill';
import { TREND_LINES } from '@/data/regiLines';
import { EventRow } from '@/features/journey/EventRow';
import { RegiEvolutionCard } from '@/features/journey/RegiEvolution';
import { WeekChart } from '@/features/journey/WeekChart';
import { toIsoDate } from '@/lib/age';
import { dayTitle } from '@/lib/dates';
import { journeySections, weekSummary, weeklyTrend, type JourneyItem, type JourneySection } from '@/lib/timeline';
import { useAppStore } from '@/store/useAppStore';
import { brand, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Section = JourneySection & { readonly title: string };

const keyOf = (item: JourneyItem): string => (item.type === 'event' ? item.event.id : `ms-${item.milestone.id}`);

function WeekCard() {
  const { colors } = useTheme();
  const timeline = useAppStore((state) => state.timeline);
  const day = toIsoDate(new Date());
  const { summary, trend } = useMemo(() => {
    const now = new Date(`${day}T23:59:59`);
    return { summary: weekSummary(timeline, now), trend: weeklyTrend(timeline, now) };
  }, [day, timeline]);
  return (
    <Card style={styles.week}>
      <AppText variant="overline" tone="muted" uppercase>
        Tu semana
      </AppText>
      <View style={styles.pills}>
        <StatPill icon={Clock} value={Math.round(summary.minutes)} unit="min" color={colors.highlight} accessibilityLabel={`${Math.round(summary.minutes)} minutos de práctica esta semana`} />
        <StatPill icon={ShieldCheck} value={summary.impulsesResisted} unit="frenados" color={brand.coral} accessibilityLabel={`${summary.impulsesResisted} impulsos frenados esta semana`} />
        {summary.moodAverage === null ? null : (
          <StatPill
            icon={Smile}
            value={Math.round(summary.moodAverage)}
            unit="/ 5 ánimo"
            color={colors.regi}
            accessibilityLabel={`Ánimo promedio ${summary.moodAverage} de 5`}
          />
        )}
      </View>
      <WeekChart days={summary.days} />
      <RegiSays message={TREND_LINES[trend]} size={64} pose={trend === 'down' ? 'empathetic' : 'growth'} />
    </Card>
  );
}

/** "Mi camino": resumen semanal, evolución de Regi y la línea de tiempo de todo tu avance. */
export function JourneyScreen() {
  const timeline = useAppStore((state) => state.timeline);
  const sections = useMemo<readonly Section[]>(
    () => journeySections(timeline).map((section) => ({ ...section, title: dayTitle(section.day) })),
    [timeline],
  );

  const renderItem: SectionListRenderItem<JourneyItem, Section> = useCallback(
    ({ item, index, section }) => <EventRow item={item} isLast={index === section.data.length - 1} />,
    [],
  );

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <SectionList
          sections={sections as Section[]}
          keyExtractor={keyOf}
          renderItem={renderItem}
          renderSectionHeader={({ section }) => (
            <AppText variant="heading" accessibilityRole="header" style={styles.dayTitle}>
              {section.title}
            </AppText>
          )}
          stickySectionHeadersEnabled={false}
          initialNumToRender={12}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <View style={styles.header}>
              <BackHeader title="Mi camino" />
              <WeekCard />
              <RegiEvolutionCard />
            </View>
          }
          ListEmptyComponent={
            <EmptyState title="Aún no hay pasos en tu camino" message="Completa una lección, anota un impulso o haz tu check-in de ánimo: aparecerán aquí." />
          }
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, paddingBottom: spacing.xxl },
  header: { gap: spacing.md, marginBottom: spacing.md },
  week: { gap: spacing.md },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  dayTitle: { marginTop: spacing.md, marginBottom: spacing.sm, textTransform: 'capitalize' },
});
