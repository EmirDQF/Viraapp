import { Ban, Clock, ShoppingCart, Smartphone, Sparkles, Utensils } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { IMPULSE_PRESETS, formatCountdown, remainingMs, type Impulse } from '@/lib/impulses';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const TONE = MODULE_COLORS.enfriador;
const ICONS = { cart: ShoppingCart, phone: Smartphone, food: Utensils } as const;

function ImpulseIcon({ title }: { readonly title: string }) {
  const preset = IMPULSE_PRESETS.find((item) => item.title === title);
  const Icon = preset ? ICONS[preset.icon] : Sparkles;
  return <Icon color={TONE.base} size={24} />;
}

interface ImpulseCardProps {
  readonly impulse: Impulse;
  readonly now: Date;
  readonly onWait: (impulse: Impulse) => void;
  readonly onDiscard: (impulse: Impulse) => void;
  readonly onDecide: (impulse: Impulse, stillNeed: boolean) => void;
}

function Action({ label, icon, onPress }: { readonly label: string; readonly icon: React.ReactNode; readonly onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
      {icon}
      <AppText variant="bodyStrong" color={TONE.deep}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Tarjeta de un impulso con su temporizador en anillo (maqueta 7). Al vencer pregunta "¿Aún lo necesitas?". */
export const ImpulseCard = memo(function ImpulseCard({ impulse, now, onWait, onDiscard, onDecide }: ImpulseCardProps) {
  const { colors } = useTheme();
  const left = remainingMs(impulse, now);
  const total = impulse.minutes * 60 * 1000;
  const due = left === 0;
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: TONE.soft }]}>
      <View style={styles.header}>
        <ImpulseIcon title={impulse.title} />
        <AppText variant="subtitle" style={styles.title}>
          {impulse.title}
        </AppText>
      </View>
      {due ? (
        <View style={styles.due}>
          <AppText variant="heading" align="center">
            ¿Aún lo necesitas?
          </AppText>
          <View style={styles.actions}>
            <Action label="Sí" icon={null} onPress={() => onDecide(impulse, true)} />
            <Action label="No, ya pasó" icon={null} onPress={() => onDecide(impulse, false)} />
          </View>
        </View>
      ) : (
        <>
          <View style={styles.ring}>
            <ProgressRing
              value={left / total}
              size={110}
              strokeWidth={10}
              color={TONE.base}
              trackColor={TONE.soft}
              accessibilityLabel={`Faltan ${formatCountdown(left)} de ${impulse.minutes} minutos`}
            >
              <AppText variant="heading">{formatCountdown(left)}</AppText>
              <AppText variant="caption" tone="muted">
                {formatCountdown(total)}
              </AppText>
            </ProgressRing>
          </View>
          <View style={[styles.actions, { backgroundColor: TONE.soft }]}>
            <Action label="Esperar" icon={<Clock color={TONE.deep} size={18} />} onPress={() => onWait(impulse)} />
            <Action label="Descartar" icon={<Ban color={TONE.deep} size={18} />} onPress={() => onDiscard(impulse)} />
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  card: { borderRadius: radius.xxl, borderWidth: 2, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  title: { flex: 1 },
  ring: { alignItems: 'center', paddingBottom: spacing.md },
  due: { padding: spacing.md, gap: spacing.sm },
  actions: { flexDirection: 'row' },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, minHeight: MIN_TOUCH + 4 },
  pressed: { opacity: 0.7 },
});
