import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowLeft, ChartColumn, History, Inbox, Plus } from 'lucide-react-native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/ComingSoon';
import { GlassCard } from '@/components/ui/GlassCard';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { goBackOrHome } from '@/features/game/navigation';
import { ImpulseCard } from '@/features/impulses/ImpulseCard';
import { haptic } from '@/lib/haptics';
import { impulseStats, type Impulse } from '@/lib/impulses';
import { cancelNotification } from '@/lib/notifications';
import { useAppStore } from '@/store/useAppStore';
import { enterAnimation } from '@/theme/motion';
import { elevationFor, MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

type Tab = 'inbox' | 'history' | 'stats';
const TONE = MODULE_COLORS.enfriador;
const TONE_GRADIENT = [TONE.base, TONE.deep] as const;
const TABS: readonly { readonly id: Tab; readonly label: string; readonly Icon: typeof Inbox }[] = [
  { id: 'inbox', label: 'Inbox', Icon: Inbox },
  { id: 'history', label: 'Historial', Icon: History },
  { id: 'stats', label: 'Estadísticas', Icon: ChartColumn },
];
const STATUS_TEXT: Readonly<Record<Impulse['status'], string>> = {
  waiting: 'Esperando',
  resisted: 'Lo dejaste pasar 💪',
  gave_in: 'Decidiste hacerlo con calma',
  discarded: 'Descartado',
};

function useNow(active: boolean): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [active]);
  return now;
}

function Stats({ impulses }: { readonly impulses: readonly Impulse[] }) {
  const stats = impulseStats(impulses);
  const percent = Math.round(stats.resistRate * 100);
  const rows = [
    ['Impulsos anotados', stats.total],
    ['Resistidos', stats.resisted],
    ['Decididos con calma', stats.gaveIn],
    ['Descartados', stats.discarded],
  ] as const;
  return (
    <View style={styles.stats}>
      <Card variant="gradient" gradient={TONE_GRADIENT} raised accessibilityLabel={`${percent}% de las veces esperaste y el impulso pasó`}>
        <AnimatedNumber value={percent} suffix="%" variant="display" color={TONE.on} style={styles.center} />
        <AppText variant="bodyStrong" color={TONE.on} align="center">
          de las veces esperaste y el impulso pasó
        </AppText>
      </Card>
      {rows.map(([label, value]) => (
        <Card key={label} style={styles.statRow}>
          <AppText style={styles.flex}>{label}</AppText>
          <AnimatedNumber value={value} variant="numberSmall" />
        </Card>
      ))}
    </View>
  );
}

const Header = memo(function Header() {
  return (
    <LinearGradient colors={TONE_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
      <AnimatedPressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
        <ArrowLeft color={TONE.on} size={24} strokeWidth={ICON_STROKE} />
      </AnimatedPressable>
      <AppText variant="subtitle" color={TONE.on} uppercase accessibilityRole="header">
        Buzón de impulsos
      </AppText>
    </LinearGradient>
  );
});

const AddPill = memo(function AddPill() {
  const { isDark } = useTheme();
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel="Añadir impulso"
      haptics="medium"
      onPress={() => router.push('/impulses/new')}
      style={[styles.addPill, elevationFor('md', isDark)]}
    >
      <LinearGradient colors={TONE_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      {/* En web, el degradado posicionado se pinta sobre lo estático: el contenido va en su propia capa. */}
      <View style={styles.addContent}>
        <Plus color={TONE.on} size={18} strokeWidth={2.6} />
        <AppText variant="button" color={TONE.on} uppercase>
          Añadir impulso
        </AppText>
      </View>
    </AnimatedPressable>
  );
});

const TabBar = memo(function TabBar({ tab, onChange }: { readonly tab: Tab; readonly onChange: (tab: Tab) => void }) {
  const { colors } = useTheme();
  return (
    <GlassCard padded={false} radius={radius.pill} elevation="lg" style={styles.tabsCard}>
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map(({ id, label, Icon }) => {
          const selected = tab === id;
          const color = selected ? TONE.on : colors.textMuted;
          return (
            <AnimatedPressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              haptics="selection"
              onPress={() => onChange(id)}
              style={[styles.tab, selected && { backgroundColor: TONE.base }]}
            >
              <Icon color={color} size={20} strokeWidth={ICON_STROKE} />
              <AppText variant="tab" color={color}>
                {label}
              </AppText>
            </AnimatedPressable>
          );
        })}
      </View>
    </GlassCard>
  );
});

/** Buzón de Impulsos (maqueta 7): anota un impulso, espera con un temporizador y decide con calma. */
export function ImpulsesScreen() {
  const reduceMotion = useReduceMotion();
  const impulses = useAppStore((state) => state.impulses);
  const resolve = useAppStore((state) => state.resolveImpulse);
  const [tab, setTab] = useState<Tab>('inbox');
  const waiting = useMemo(() => impulses.filter((item) => item.status === 'waiting'), [impulses]);
  const history = useMemo(() => impulses.filter((item) => item.status !== 'waiting'), [impulses]);
  const now = useNow(tab === 'inbox' && waiting.length > 0);

  const onWait = useCallback(() => haptic('light'), []);
  const onDiscard = useCallback(
    (impulse: Impulse) => {
      void cancelNotification(impulse.notificationId);
      resolve(impulse.id, 'discarded');
    },
    [resolve],
  );
  const onDecide = useCallback(
    (impulse: Impulse, stillNeed: boolean) => {
      haptic(stillNeed ? 'light' : 'success');
      resolve(impulse.id, stillNeed ? 'gave_in' : 'resisted');
    },
    [resolve],
  );

  return (
    <ScreenBackground variant="regi">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Header />
        <View style={styles.add}>
          <AddPill />
        </View>
        {tab === 'stats' ? (
          <Stats impulses={impulses} />
        ) : (
          <FlatList
            data={tab === 'inbox' ? waiting : history}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => (
              <Animated.View entering={enterAnimation(index, reduceMotion)}>
                {tab === 'inbox' ? (
                  <ImpulseCard impulse={item} now={now} onWait={onWait} onDiscard={onDiscard} onDecide={onDecide} />
                ) : (
                  <Card style={styles.statRow}>
                    <View style={styles.flex}>
                      <AppText variant="bodyStrong">{item.title}</AppText>
                      <AppText variant="caption" tone="muted">
                        {STATUS_TEXT[item.status]}
                      </AppText>
                    </View>
                  </Card>
                )}
              </Animated.View>
            )}
            ListEmptyComponent={
              <EmptyState
                title={tab === 'inbox' ? 'Tu buzón está vacío' : 'Aún no hay historial'}
                message="Cuando sientas un impulso (comprar, scrollear, picar algo), anótalo aquí y date unos minutos antes de decidir."
              />
            }
          />
        )}
        <TabBar tab={tab} onChange={setTab} />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.md,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  add: { alignItems: 'center', paddingTop: spacing.lg },
  addPill: { borderRadius: radius.pill, overflow: 'hidden', minHeight: MIN_TOUCH },
  addContent: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    minHeight: MIN_TOUCH,
  },
  list: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg, flexGrow: 1 },
  stats: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.sm, flex: 1 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tabsCard: { marginHorizontal: spacing.screen, marginBottom: spacing.sm },
  tabs: { flexDirection: 'row', padding: spacing.xs, gap: spacing.xs },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: MIN_TOUCH + 8, borderRadius: radius.pill },
});
