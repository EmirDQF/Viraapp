import { Ban, Clock, ShoppingCart, Smartphone, Sparkles, Utensils } from 'lucide-react-native';
import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { IMPULSE_PRESETS, formatCountdown, remainingMs, type Impulse } from '@/lib/impulses';
import { brand, elevationFor, MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const TONE = MODULE_COLORS.enfriador;
const ICONS = { cart: ShoppingCart, phone: Smartphone, food: Utensils } as const;
const RING = 120;

function ImpulseIcon({ title }: { readonly title: string }) {
  const preset = IMPULSE_PRESETS.find((item) => item.title === title);
  const Icon = preset ? ICONS[preset.icon] : Sparkles;
  return <Icon color={TONE.on} size={20} strokeWidth={ICON_STROKE} />;
}

interface ImpulseCardProps {
  readonly impulse: Impulse;
  readonly now: Date;
  readonly onWait: (impulse: Impulse) => void;
  readonly onDiscard: (impulse: Impulse) => void;
  readonly onDecide: (impulse: Impulse, stillNeed: boolean) => void;
}

function Action({ label, icon, onPress }: { readonly label: string; readonly icon?: ReactNode; readonly onPress: () => void }) {
  return (
    <AnimatedPressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.action}>
      {icon}
      <AppText variant="bodyStrong">{label}</AppText>
    </AnimatedPressable>
  );
}

/** Tarjeta de un impulso con su cuenta regresiva en anillo (maqueta 7). Al vencer pregunta "¿Aún lo necesitas?". */
export const ImpulseCard = memo(function ImpulseCard({ impulse, now, onWait, onDiscard, onDecide }: ImpulseCardProps) {
  const { colors, isDark } = useTheme();
  const left = remainingMs(impulse, now);
  const total = impulse.minutes * 60 * 1000;
  const due = left === 0;
  const tint = isDark ? TONE.softDark : TONE.soft;
  const iconColor = colors.text;

  return (
    <View
      style={[
        styles.card,
        elevationFor('md', isDark),
        { backgroundColor: colors.surface, borderColor: isDark ? colors.glassBorder : colors.border },
      ]}
    >
      <View style={styles.header}>
        <IconTile color={TONE.base} size={40}>
          <ImpulseIcon title={impulse.title} />
        </IconTile>
        <AppText variant="subtitle" style={styles.title}>
          {impulse.title}
        </AppText>
      </View>
      {due ? (
        <View style={styles.due}>
          <AppText variant="heading" align="center">
            ¿Aún lo necesitas?
          </AppText>
        </View>
      ) : (
        <View style={styles.ring}>
          <ProgressRing
            value={left / total}
            size={RING}
            strokeWidth={11}
            gradient={[brand.lilacLight, TONE.base]}
            trackColor={tint}
            glow
            accessibilityLabel={`Faltan ${formatCountdown(left)} de ${impulse.minutes} minutos`}
          >
            <AppText variant="number">{formatCountdown(left)}</AppText>
            <AppText variant="caption" tone="muted">
              {formatCountdown(total)}
            </AppText>
          </ProgressRing>
        </View>
      )}
      <View style={[styles.actions, { backgroundColor: tint, borderTopColor: isDark ? colors.glassBorder : colors.border }]}>
        {due ? (
          <>
            <Action label="Sí" onPress={() => onDecide(impulse, true)} />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <Action label="No, ya pasó" onPress={() => onDecide(impulse, false)} />
          </>
        ) : (
          <>
            <Action label="Esperar" icon={<Clock color={iconColor} size={18} strokeWidth={ICON_STROKE} />} onPress={() => onWait(impulse)} />
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
            <Action label="Descartar" icon={<Ban color={iconColor} size={18} strokeWidth={ICON_STROKE} />} onPress={() => onDiscard(impulse)} />
          </>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: radius.xxl, borderWidth: 1, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  title: { flex: 1 },
  ring: { alignItems: 'center', paddingBottom: spacing.lg },
  due: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  actions: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1 },
  separator: { width: 1, height: MIN_TOUCH / 2 },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH + 4,
  },
});
