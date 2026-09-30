import { CalendarDays, Check, MapPin } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { CommunityEvent } from '@/data/explore';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface EventCardProps {
  readonly event: CommunityEvent;
  readonly interested: boolean;
  readonly onToggle: (id: string) => void;
}

const KIND_LABEL: Readonly<Record<CommunityEvent['kind'], string>> = {
  taller: 'Taller',
  voluntariado: 'Voluntariado',
  actividad: 'Actividad',
  campaña: 'Campaña',
};

/** Evento o campaña de ejemplo. "Me interesa" solo lo marca en tu teléfono: no inscribe ni comparte nada. */
export const EventCard = memo(function EventCard({ event, interested, onToggle }: EventCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <AppText variant="overline" tone="primary">
        {KIND_LABEL[event.kind]}
      </AppText>
      <AppText variant="subtitle">{event.title}</AppText>
      <AppText tone="muted">{event.description}</AppText>
      <View style={styles.meta}>
        <CalendarDays color={colors.textMuted} size={16} />
        <AppText variant="caption" tone="muted">
          {event.when}
        </AppText>
        <MapPin color={colors.textMuted} size={16} />
        <AppText variant="caption" tone="muted" style={styles.flex} numberOfLines={1}>
          {event.where}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: interested }}
        aria-checked={interested}
        accessibilityLabel={`Me interesa: ${event.title}`}
        onPress={() => onToggle(event.id)}
        style={[
          styles.toggle,
          { borderColor: colors.highlight, backgroundColor: interested ? colors.highlight : 'transparent' },
        ]}
      >
        {interested ? <Check color={colors.background} size={16} strokeWidth={3} /> : null}
        <AppText variant="bodyStrong" color={interested ? colors.background : colors.highlight}>
          {interested ? 'Te interesa' : 'Me interesa'}
        </AppText>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, borderWidth: 1, padding: spacing.md, gap: spacing.xs },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flex: { flex: 1 },
  toggle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: MIN_TOUCH,
    marginTop: spacing.xs,
  },
});
