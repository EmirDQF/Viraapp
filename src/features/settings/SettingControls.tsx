import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { MIN_TOUCH, brand, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export function SettingSection({ title, children }: { readonly title: string; readonly children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="overline" tone="muted" accessibilityRole="header">
        {title}
      </AppText>
      <Card style={styles.card}>{children}</Card>
    </View>
  );
}

interface SettingSwitchProps {
  readonly label: string;
  readonly detail?: string;
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly disabled?: boolean;
}

/** En web, react-native-web usa `activeThumbColor` (no tipado en RN) y por defecto es un verde ajeno a la marca. */
function webThumb(color: string): object {
  return Platform.OS === 'web' ? { activeThumbColor: color } : {};
}

export function SettingSwitch({ label, detail, value, onChange, disabled = false }: SettingSwitchProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.switchRow}>
      <View style={styles.flex}>
        <AppText variant="bodyStrong" tone={disabled ? 'muted' : 'default'}>
          {label}
        </AppText>
        {detail ? (
          <AppText variant="caption" tone="muted">
            {detail}
          </AppText>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityHint={detail}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.disabled, true: colors.highlight }}
        thumbColor={brand.white}
        {...webThumb(brand.white)}
      />
    </View>
  );
}

interface ChoiceGroupProps<T extends string | number> {
  readonly label: string;
  readonly options: readonly { readonly value: T; readonly label: string }[];
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly disabled?: boolean;
}

/** Grupo de opciones excluyentes (chips), accesible como radiogroup. */
export function ChoiceGroup<T extends string | number>({ label, options, value, onChange, disabled = false }: ChoiceGroupProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={styles.choice}>
      <AppText variant="bodyStrong" tone={disabled ? 'muted' : 'default'}>
        {label}
      </AppText>
      <View style={styles.chips} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={String(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              aria-checked={selected}
              accessibilityLabel={`${label}: ${option.label}`}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              style={[
                styles.chip,
                { borderColor: selected ? colors.highlight : colors.border, backgroundColor: selected ? colors.highlight : colors.surface },
                disabled && styles.disabled,
              ]}
            >
              <AppText variant="bodyStrong" color={selected ? colors.background : colors.text}>
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.xs },
  card: { gap: spacing.md },
  flex: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH },
  choice: { gap: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { minHeight: MIN_TOUCH, minWidth: MIN_TOUCH + 12, paddingHorizontal: spacing.md, borderWidth: 2, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.5 },
});
