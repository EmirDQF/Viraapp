import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { StepFrame } from '@/features/onboarding/StepFrame';
import { MAX_AGE, MIN_AGE, validateBirthDate, type DateParts } from '@/lib/age';
import { NAME_MAX, validateName } from '@/lib/validation';
import { radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

interface NameStepProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onBack: () => void;
  readonly onNext: () => void;
}

/** Paso 1: cómo quiere que Regi le llame. */
export function NameStep({ value, onChange, onBack, onNext }: NameStepProps) {
  const { colors } = useTheme();
  const [touched, setTouched] = useState(false);
  const error = validateName(value);
  const showError = touched && error !== null;

  const next = () => {
    setTouched(true);
    if (!error) onNext();
  };

  return (
    <StepFrame step={1} onBack={onBack} footer={<Button3D label="Continuar" onPress={next} disabled={error !== null} />}>
      <RegiSays message="¿Cómo quieres que te llame? Puede ser tu nombre o un apodo." />
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={() => setTouched(true)}
        onSubmitEditing={next}
        placeholder="Tu nombre o apodo"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Tu nombre o apodo"
        autoFocus
        autoCapitalize="words"
        maxLength={NAME_MAX + 4}
        returnKeyType="next"
        style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: showError ? colors.danger : colors.border }]}
      />
      {showError ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
    </StepFrame>
  );
}

interface AgeStepProps {
  readonly name: string;
  readonly value: DateParts;
  readonly onChange: (value: DateParts) => void;
  readonly onBack: () => void;
  readonly onNext: (isoDate: string) => void;
}

const DATE_FIELDS = [
  { field: 'day', label: 'Día', placeholder: 'DD', max: 2, flex: 1 },
  { field: 'month', label: 'Mes', placeholder: 'MM', max: 2, flex: 1 },
  { field: 'year', label: 'Año', placeholder: 'AAAA', max: 4, flex: 1.5 },
] as const;

/** Paso 2: fecha de nacimiento. Menores de 18 no pueden continuar; a mayores de 25 solo se les avisa. */
export function AgeStep({ name, value, onChange, onBack, onNext }: AgeStepProps) {
  const { colors } = useTheme();
  const result = validateBirthDate(value);
  const started = value.day.length > 0 || value.month.length > 0 || value.year.length > 0;

  let message = `VIRA está pensada para jóvenes de ${MIN_AGE} a ${MAX_AGE} años.`;
  let tone: 'muted' | 'success' | 'danger' = 'muted';
  if (started && result.valid) {
    message = result.notice ?? `Perfecto: tienes ${result.age} años.`;
    tone = result.notice ? 'muted' : 'success';
  } else if (started && !result.valid && value.year.length === 4) {
    message = result.reason;
    tone = 'danger';
  }

  return (
    <StepFrame
      step={2}
      onBack={onBack}
      footer={<Button3D label="Continuar" disabled={!result.valid} onPress={() => result.valid && onNext(result.isoDate)} />}
    >
      <RegiSays message={`${name.trim()}, ¿cuándo naciste?`} />
      <View style={styles.dateRow}>
        {DATE_FIELDS.map((item) => (
          <View key={item.field} style={[styles.dateField, { flex: item.flex }]}>
            <AppText variant="caption" tone="muted" uppercase>
              {item.label}
            </AppText>
            <TextInput
              value={value[item.field]}
              onChangeText={(text) => onChange({ ...value, [item.field]: text.replace(/\D/g, '') })}
              placeholder={item.placeholder}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={item.max}
              accessibilityLabel={item.label}
              style={[styles.input, styles.dateInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
            />
          </View>
        ))}
      </View>
      <View style={[styles.notice, { borderColor: tone === 'danger' ? colors.danger : colors.border, backgroundColor: colors.surface }]}>
        <AppText variant="bodyStrong" tone={tone} align="center" accessibilityLiveRegion="polite">
          {message}
        </AppText>
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 18,
    fontFamily: fontFamily.semibold,
    minHeight: 54,
  },
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateField: { gap: spacing.xs },
  dateInput: { textAlign: 'center' },
  notice: { borderWidth: 1.5, borderRadius: radius.lg, padding: spacing.md },
});
