import { Redirect, router } from 'expo-router';
import { CalendarDays, ShieldCheck, Share2, Sparkles, Stethoscope } from 'lucide-react-native';
import { useMemo, useState, type ReactNode } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { RegiMascot, RegiSays } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';
import { Screen } from '@/components/Screen';
import { getCrucible } from '@/data/crucibles';
import { haptic } from '@/lib/haptics';
import { buildActionPlan, formatPlanText } from '@/lib/plan';
import { isPathComplete } from '@/lib/progress';
import { useActiveProgress, useResilienceStore } from '@/store/useResilienceStore';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface SectionProps {
  readonly title: string;
  readonly icon: ReactNode;
  readonly delay: number;
  readonly children: ReactNode;
}

function Section({ title, icon, delay, children }: SectionProps) {
  const { colors } = useTheme();
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(350)}
      style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {children}
    </Animated.View>
  );
}

export default function ActionPlanScreen() {
  const { colors } = useTheme();
  const user = useResilienceStore((state) => state.user);
  const activeCrucible = useResilienceStore((state) => state.activeCrucible);
  const progress = useActiveProgress();
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  const plan = useMemo(
    () => (activeCrucible ? buildActionPlan(getCrucible(activeCrucible), progress) : null),
    [activeCrucible, progress],
  );

  if (!user) return <Redirect href="/" />;
  if (!activeCrucible || !plan) return <Redirect href="/select-crucible" />;

  if (!isPathComplete(progress.completedModules)) {
    return (
      <Screen footer={<Button3D label="Ir a mi ruta" onPress={() => router.replace('/modules')} />}>
        <RegiSays
          pose="empathetic"
          message={`Tu plan se construye con tus propias respuestas. Completa los 5 módulos (llevas ${progress.completedModules.length}/5) y aquí lo verás.`}
        />
      </Screen>
    );
  }

  const share = async () => {
    try {
      await Share.share({ title: 'Mi Plan de Resiliencia · VIRA', message: formatPlanText(plan, user.name) });
      haptic('success');
      setShareNotice(null);
    } catch (error: unknown) {
      haptic('error');
      setShareNotice(
        error instanceof Error
          ? `No se pudo compartir: ${error.message}`
          : 'Este dispositivo no permite compartir. Puedes hacer una captura de pantalla.',
      );
    }
  };

  return (
    <Screen
      scroll
      footer={
        <>
          <Button3D
            label="Compartir mi plan"
            onPress={share}
            variant="accent"
            icon={<Share2 color={palette.white} size={20} />}
          />
          <View style={styles.footerRow}>
            <View style={styles.footerButton}>
              <Button3D label="Mi ruta" onPress={() => router.replace('/modules')} variant="outline" compact />
            </View>
            <View style={styles.footerButton}>
              <Button3D label="Otro crisol" onPress={() => router.push('/select-crucible')} variant="outline" compact />
            </View>
          </View>
        </>
      }
    >
      <View style={styles.hero}>
        <RegiMascot pose="growth" size={130} />
        <Text style={[styles.heroTitle, { color: colors.text }]}>Plan de Resiliencia Personal</Text>
        <Text style={[styles.heroSubtitle, { color: colors.textMuted }]}>
          {user.name} · {plan.crucibleTitle}
        </Text>
      </View>

      {shareNotice ? <Text style={[styles.notice, { color: colors.danger }]}>{shareNotice}</Text> : null}

      <Section title="1. Diagnóstico" icon={<Stethoscope color={colors.primary} size={22} />} delay={0}>
        <Text style={[styles.headline, { color: colors.primary }]}>{plan.diagnosis.headline}</Text>
        <Text style={[styles.body, { color: colors.text }]}>{plan.diagnosis.body}</Text>
      </Section>

      <Section title="2. Mantra nuclear" icon={<Sparkles color={colors.accent} size={22} />} delay={80}>
        <View style={[styles.mantra, { backgroundColor: colors.primary }]}>
          <Text style={[styles.mantraText, { color: colors.onColor }]}>“{plan.mantra}”</Text>
        </View>
        {plan.reframe ? (
          <View style={styles.reframe}>
            <Text style={[styles.label, { color: colors.textMuted }]}>Tu pensamiento realista</Text>
            <Text style={[styles.body, { color: colors.text }]}>{plan.reframe}</Text>
          </View>
        ) : null}
      </Section>

      <Section title="3. Reglas no negociables" icon={<ShieldCheck color={colors.primary} size={22} />} delay={160}>
        {plan.rules.map((rule, index) => (
          <View key={rule} style={styles.ruleRow}>
            <View style={[styles.ruleBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.ruleNumber}>{index + 1}</Text>
            </View>
            <Text style={[styles.ruleText, { color: colors.text }]}>{rule}</Text>
          </View>
        ))}
      </Section>

      <Section title="4. Micro-acciones: próximos 7 días" icon={<CalendarDays color={colors.primary} size={22} />} delay={240}>
        {plan.schedule.map((day) => {
          const isToday = day.dayIndex === 0;
          return (
            <View
              key={day.dayIndex}
              style={[
                styles.dayRow,
                { borderColor: isToday ? colors.accent : colors.border, backgroundColor: isToday ? colors.surfaceAlt : 'transparent' },
              ]}
            >
              <Text style={[styles.dayLabel, { color: isToday ? colors.accent : colors.textMuted }]}>
                {isToday ? 'Hoy' : day.dateLabel}
              </Text>
              <Text style={[styles.dayAction, { color: colors.text }]}>{day.action}</Text>
            </View>
          );
        })}
      </Section>

      <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
        Si en algún momento sientes que no puedes con esto, busca apoyo profesional o una línea de ayuda de tu país.
        Pedir ayuda también es resiliencia.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.xs },
  heroTitle: { ...typography.title, textAlign: 'center' },
  heroSubtitle: { ...typography.body, textAlign: 'center' },
  notice: { ...typography.caption, textAlign: 'center' },
  section: { borderWidth: 2, borderBottomWidth: 5, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionTitle: { ...typography.subtitle },
  headline: { ...typography.body, fontWeight: '800' },
  body: { ...typography.body },
  label: { ...typography.caption, textTransform: 'uppercase' },
  mantra: { borderRadius: radius.lg, padding: spacing.lg },
  mantraText: { fontSize: 22, fontWeight: '900', textAlign: 'center', lineHeight: 30 },
  reframe: { gap: spacing.xs },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  ruleBadge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  ruleNumber: { color: palette.white, fontWeight: '900', fontSize: 16 },
  ruleText: { ...typography.body, flex: 1, fontWeight: '600' },
  dayRow: { borderWidth: 2, borderRadius: radius.md, padding: spacing.md, gap: 2 },
  dayLabel: { ...typography.caption, textTransform: 'uppercase' },
  dayAction: { ...typography.body },
  disclaimer: { ...typography.caption, fontWeight: '500', textAlign: 'center', lineHeight: 18 },
  footerRow: { flexDirection: 'row', gap: spacing.sm },
  footerButton: { flex: 1 },
});
