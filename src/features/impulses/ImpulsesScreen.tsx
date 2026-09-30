import { router } from 'expo-router';
import { ArrowLeft, ChartColumn, History, Inbox, Plus } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/ComingSoon';
import { goBackOrHome } from '@/features/game/navigation';
import { ImpulseCard } from '@/features/impulses/ImpulseCard';
import { haptic } from '@/lib/haptics';
import { impulseStats, type Impulse } from '@/lib/impulses';
import { cancelNotification } from '@/lib/notifications';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tab = 'inbox' | 'history' | 'stats';
const TONE = MODULE_COLORS.enfriador;
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
  const rows = [
    ['Impulsos anotados', stats.total],
    ['Resistidos', stats.resisted],
    ['Decididos con calma', stats.gaveIn],
    ['Descartados', stats.discarded],
  ] as const;
  return (
    <View style={styles.stats}>
      <Card tone="color" color={TONE.soft} accessibilityLabel={`${Math.round(stats.resistRate * 100)}% de las veces esperaste y el impulso pasó`}>
        <AppText variant="display" color={TONE.deep} align="center">
          {Math.round(stats.resistRate * 100)}%
        </AppText>
        <AppText variant="bodyStrong" color={TONE.deep} align="center">
          de las veces esperaste y el impulso pasó
        </AppText>
      </Card>
      {rows.map(([label, value]) => (
        <Card key={label} style={styles.statRow}>
          <AppText style={styles.flex}>{label}</AppText>
          <AppText variant="subtitle">{value}</AppText>
        </Card>
      ))}
    </View>
  );
}

/** Buzón de Impulsos (maqueta 7): anota un impulso, espera con un temporizador y decide con calma. */
export function ImpulsesScreen() {
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={[styles.header, { backgroundColor: TONE.deep }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
          <ArrowLeft color={TONE.on} size={24} />
        </Pressable>
        <AppText variant="subtitle" color={TONE.on} uppercase accessibilityRole="header">
          Buzón de impulsos
        </AppText>
      </View>
      <View style={styles.add}>
        <Button3D label="Añadir impulso" icon={<Plus color={TONE.on} size={18} />} tone={{ face: TONE.base, shadow: TONE.deep, text: TONE.on }} onPress={() => router.push('/impulses/new')} />
      </View>
      {tab === 'stats' ? (
        <Stats impulses={impulses} />
      ) : (
        <FlatList
          data={tab === 'inbox' ? waiting : history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) =>
            tab === 'inbox' ? (
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
            )
          }
          ListEmptyComponent={
            <EmptyState
              title={tab === 'inbox' ? 'Tu buzón está vacío' : 'Aún no hay historial'}
              message="Cuando sientas un impulso (comprar, scrollear, picar algo), anótalo aquí y date unos minutos antes de decidir."
            />
          }
        />
      )}
      <View style={[styles.tabs, { backgroundColor: TONE.deep }]} accessibilityRole="tablist">
        {TABS.map(({ id, label, Icon }) => (
          <Pressable
            key={id}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === id }}
            accessibilityLabel={label}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && { backgroundColor: TONE.base }]}
          >
            <Icon color={TONE.on} size={20} />
            <AppText variant="caption" color={TONE.on}>
              {label}
            </AppText>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  add: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  list: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  stats: { padding: spacing.lg, gap: spacing.sm, flex: 1 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  tabs: { flexDirection: 'row', padding: spacing.xs, gap: spacing.xs },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: MIN_TOUCH + 8, borderRadius: radius.lg },
});
