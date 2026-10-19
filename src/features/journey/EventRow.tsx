import { Award, Clapperboard, Hourglass, LifeBuoy, Milestone as MilestoneIcon, ShieldCheck, Smile, Wind, type LucideIcon } from 'lucide-react-native';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { timeOf } from '@/lib/dates';
import { describeEvent } from '@/lib/eventText';
import type { JourneyItem, TimelineEvent } from '@/lib/timeline';
import { brand, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface Look {
  readonly color: string;
  readonly on: string;
  readonly icon: LucideIcon | null;
}

function lookOf(event: TimelineEvent): Look {
  switch (event.kind) {
    case 'lesson':
      return { color: MODULE_COLORS[event.moduleId].base, on: MODULE_COLORS[event.moduleId].on, icon: null };
    case 'impulse':
      return event.status === 'resisted'
        ? { color: MODULE_COLORS.freno.base, on: MODULE_COLORS.freno.on, icon: ShieldCheck }
        : { color: MODULE_COLORS.enfriador.base, on: MODULE_COLORS.enfriador.on, icon: Hourglass };
    case 'mood':
      return { color: MODULE_COLORS.descarga.base, on: MODULE_COLORS.descarga.on, icon: Smile };
    case 'sos':
      return { color: brand.coral, on: brand.ink, icon: LifeBuoy };
    case 'technique':
      return { color: MODULE_COLORS.ancla.base, on: MODULE_COLORS.ancla.on, icon: Wind };
    case 'badge':
      return { color: brand.amber, on: brand.ink, icon: Award };
    case 'case':
      return { color: MODULE_COLORS.hoy.base, on: MODULE_COLORS.hoy.on, icon: Clapperboard };
  }
}

/** Un nodo de la línea de tiempo: punto con ícono a la izquierda y tarjeta con el texto. */
export const EventRow = memo(function EventRow({ item, isLast }: { readonly item: JourneyItem; readonly isLast: boolean }) {
  const { colors } = useTheme();
  const isMilestone = item.type === 'milestone';
  const look: Look = isMilestone ? { color: brand.amber, on: brand.ink, icon: MilestoneIcon } : lookOf(item.event);
  const text = isMilestone ? { title: item.milestone.title, detail: '¡Hito alcanzado!' } : describeEvent(item.event);
  const at = isMilestone ? item.milestone.at : item.event.at;
  const Icon = look.icon;
  return (
    <View style={styles.row} accessible accessibilityLabel={`${timeOf(at)}. ${text.title}${text.detail ? `. ${text.detail}` : ''}`}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: look.color }]}>
          {Icon ? (
            <Icon color={look.on} size={16} strokeWidth={ICON_STROKE} />
          ) : item.type === 'event' && item.event.kind === 'lesson' ? (
            <ModuleIcon id={item.event.moduleId} color={look.on} size={16} strokeWidth={ICON_STROKE} />
          ) : null}
        </View>
        {isLast ? null : <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>
      <View
        style={[
          styles.card,
          { backgroundColor: isMilestone ? colors.surfaceAlt : colors.surface, borderColor: isMilestone ? brand.amber : colors.border },
        ]}
      >
        <AppText variant="bodyStrong">{text.title}</AppText>
        {text.detail ? (
          <AppText variant="caption" tone="muted">
            {text.detail}
          </AppText>
        ) : null}
        <AppText variant="caption" tone="muted">
          {timeOf(at)}
        </AppText>
      </View>
    </View>
  );
});

const DOT = 32;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { width: DOT, alignItems: 'center' },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, width: 3, borderRadius: 2, marginVertical: 2 },
  card: { flex: 1, borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md, gap: 2, marginBottom: spacing.sm },
});
