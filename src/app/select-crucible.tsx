import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AxoSays } from '@/components/AxoMascot';
import { Button3D } from '@/components/Button3D';
import { CrucibleIcon } from '@/components/CrucibleIcon';
import { Screen } from '@/components/Screen';
import { CRUCIBLES } from '@/data/crucibles';
import { haptic } from '@/lib/haptics';
import { useResilienceStore } from '@/store/useResilienceStore';
import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { CrucibleId } from '@/types';

export default function SelectCrucibleScreen() {
  const { colors } = useTheme();
  const user = useResilienceStore((state) => state.user);
  const activeCrucible = useResilienceStore((state) => state.activeCrucible);
  const progress = useResilienceStore((state) => state.progress);
  const selectCrucible = useResilienceStore((state) => state.selectCrucible);
  const [selected, setSelected] = useState<CrucibleId | null>(activeCrucible);

  if (!user) return <Redirect href="/" />;

  const confirm = () => {
    if (!selected) return;
    selectCrucible(selected);
    router.replace('/modules');
  };

  const selectedTitle = CRUCIBLES.find((crucible) => crucible.id === selected)?.title;

  return (
    <Screen
      scroll
      footer={
        <>
          <Button3D
            label={selected ? `Entrenar: ${selectedTitle}` : 'Elige un crisol'}
            onPress={confirm}
            disabled={!selected}
            variant="accent"
            haptics="success"
          />
          {activeCrucible ? (
            <Button3D label="Volver a mi ruta" onPress={() => router.replace('/modules')} variant="outline" compact />
          ) : null}
        </>
      }
    >
      <AxoSays
        mood="thinking"
        message={`${user.name}, ¿qué crisol te está poniendo a prueba ahora? Elige uno: ahí empieza tu entrenamiento.`}
      />
      {CRUCIBLES.map((crucible, index) => {
        const isSelected = selected === crucible.id;
        const done = progress[crucible.id]?.completedModules.length ?? 0;
        return (
          <Animated.View key={crucible.id} entering={FadeInDown.delay(index * 70).duration(350)}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${crucible.title}. ${crucible.tagline}`}
              onPress={() => {
                haptic('light');
                setSelected(crucible.id);
              }}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: isSelected ? colors.surfaceAlt : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.iconWrap, { backgroundColor: isSelected ? colors.primary : colors.surfaceAlt }]}>
                <CrucibleIcon id={crucible.id} color={isSelected ? colors.onColor : colors.primary} />
              </View>
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{crucible.title}</Text>
                <Text style={[styles.tagline, { color: colors.textMuted }]}>{crucible.tagline}</Text>
                <View style={styles.chips}>
                  {crucible.examples.map((example) => (
                    <View key={example} style={[styles.chip, { borderColor: colors.border }]}>
                      <Text style={[styles.chipText, { color: colors.textMuted }]}>{example}</Text>
                    </View>
                  ))}
                </View>
                {done > 0 ? (
                  <Text style={[styles.progress, { color: colors.success }]}>{done}/5 módulos completados</Text>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 3 },
  iconWrap: { width: 52, height: 52, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, gap: spacing.xs },
  cardTitle: { ...typography.subtitle },
  tagline: { ...typography.body, fontSize: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  chipText: { fontSize: 12, fontWeight: '600' },
  progress: { ...typography.caption, marginTop: spacing.xs },
});
