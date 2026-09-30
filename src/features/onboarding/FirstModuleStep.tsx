import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { MODULE_ORDER, MODULES } from '@/data/modules/catalog';
import { StepFrame } from '@/features/onboarding/StepFrame';
import { haptic } from '@/lib/haptics';
import { brand, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId } from '@/types/game';

interface FirstModuleStepProps {
  readonly selected: ModuleId;
  readonly onSelect: (id: ModuleId) => void;
  readonly onBack: () => void;
  readonly onFinish: () => void;
}

/** Paso 4: qué habilidad quiere trabajar primero. Ese tema queda desbloqueado para empezar. */
export function FirstModuleStep({ selected, onSelect, onBack, onFinish }: FirstModuleStepProps) {
  const { colors } = useTheme();
  return (
    <StepFrame
      step={4}
      title="¿Por dónde quieres empezar?"
      onBack={onBack}
      footer={<Button3D label="Empezar mi camino" size="lg" haptics="success" onPress={onFinish} />}
    >
      <RegiSays message="Elige lo que más te sirva hoy. Después podrás recorrer los demás temas." pose="resilient" />
      <View accessibilityRole="radiogroup" style={styles.list}>
        {MODULE_ORDER.map((id) => {
          const meta = MODULES[id];
          const tone = MODULE_COLORS[id];
          const isSelected = selected === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              aria-checked={isSelected}
              accessibilityLabel={`${meta.name}. ${meta.tagline}`}
              onPress={() => {
                haptic('selection');
                onSelect(id);
              }}
              style={[
                styles.option,
                { backgroundColor: isSelected ? tone.soft : colors.surface, borderColor: isSelected ? tone.base : colors.border },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: tone.base }]}>
                <ModuleIcon id={id} color={tone.on} size={24} />
              </View>
              <View style={styles.text}>
                <AppText variant="subtitle" color={isSelected ? brand.inkDeep : undefined}>
                  {meta.name}
                </AppText>
                <AppText variant="caption" color={isSelected ? brand.inkDeep : colors.textMuted}>
                  {meta.tagline}
                </AppText>
              </View>
              {isSelected ? <Check color={tone.deep} size={24} strokeWidth={3} /> : null}
            </Pressable>
          );
        })}
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 2,
    minHeight: 72,
  },
  icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 2 },
});
