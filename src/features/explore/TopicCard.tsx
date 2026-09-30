import { ChevronDown, ChevronUp, Lock, Sparkles } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button3D } from '@/components/ui/Button3D';
import { MODULES } from '@/data/modules/catalog';
import { TOPICS } from '@/data/explore';
import { LinkRow } from '@/features/explore/LinkRow';
import { openModule } from '@/features/game/navigation';
import { MODULE_COLORS, MIN_TOUCH, elevation, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId, UnlockStatus } from '@/types/game';

interface TopicCardProps {
  readonly id: ModuleId;
  readonly status: UnlockStatus;
  readonly recommended: boolean;
  readonly expanded: boolean;
  readonly onToggle: (id: ModuleId) => void;
}

function TopicDetails({ id, status }: { readonly id: ModuleId; readonly status: UnlockStatus }) {
  const topic = TOPICS[id];
  const tone = MODULE_COLORS[id];
  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.details}>
      <AppText>{topic.why}</AppText>
      <AppText variant="overline" tone="muted">
        Prueba esto
      </AppText>
      {topic.tips.map((tip) => (
        <AppText key={tip}>• {tip}</AppText>
      ))}
      <LinkRow link={topic.link} />
      {status === 'locked' ? (
        <View style={styles.lockedRow}>
          <Lock color={tone.deep} size={16} />
          <AppText variant="caption" tone="muted">
            Se desbloquea al terminar el tema anterior. Puedes leer sobre él cuando quieras.
          </AppText>
        </View>
      ) : (
        <Button3D label={status === 'completed' ? 'Repasar tema' : 'Ir al tema'} compact tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => openModule(id)} />
      )}
    </Animated.View>
  );
}

/** Un tema de las misiones explicado: por qué importa, tres ideas prácticas y un enlace confiable. */
export const TopicCard = memo(function TopicCard({ id, status, recommended, expanded, onToggle }: TopicCardProps) {
  const { colors } = useTheme();
  const meta = MODULES[id];
  const tone = MODULE_COLORS[id];
  const Chevron = expanded ? ChevronUp : ChevronDown;
  return (
    <View style={[styles.card, elevation.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${meta.name}. ${meta.tagline}`}
        accessibilityHint={expanded ? 'Oculta la explicación' : 'Muestra la explicación del tema'}
        onPress={() => onToggle(id)}
        style={styles.header}
      >
        <View style={[styles.icon, { backgroundColor: tone.base }]}>
          <ModuleIcon id={id} color={tone.on} size={24} />
        </View>
        <View style={styles.flex}>
          {recommended ? <Badge label="Recomendado" icon={<Sparkles color={tone.on} size={12} />} color={tone.base} textColor={tone.on} /> : null}
          <AppText variant="subtitle">{meta.name}</AppText>
          <AppText variant="caption" tone="muted">
            {meta.tagline}
          </AppText>
        </View>
        <Chevron color={colors.textMuted} size={22} />
      </Pressable>
      {expanded ? <TopicDetails id={id} status={status} /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1, gap: 2, alignItems: 'flex-start' },
  details: { gap: spacing.sm, paddingTop: spacing.xs },
  lockedRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
