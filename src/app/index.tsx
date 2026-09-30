import { Redirect, router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AxoMascot, AxoSays } from '@/components/AxoMascot';
import { Button3D } from '@/components/Button3D';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { MAX_AGE, MIN_AGE, validateBirthDate, type DateParts } from '@/lib/age';
import { haptic } from '@/lib/haptics';
import { useResilienceStore } from '@/store/useResilienceStore';
import { palette, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Step = 'welcome' | 'name' | 'birth';

const NAME_MIN = 2;
const NAME_MAX = 24;
const FORBIDDEN_NAME_CHARS = /[<>{}[\]\\/@#$%^*=+|~`]/;

function validateName(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed.length < NAME_MIN) return `Escribe al menos ${NAME_MIN} caracteres.`;
  if (trimmed.length > NAME_MAX) return `Máximo ${NAME_MAX} caracteres.`;
  if (FORBIDDEN_NAME_CHARS.test(trimmed)) return 'Usa solo letras, números y espacios.';
  return null;
}

function Welcome({ onStart }: { readonly onStart: () => void }) {
  const { colors } = useTheme();
  return (
    <Screen footer={<Button3D label="Empezar mi entrenamiento" onPress={onStart} haptics="medium" />}>
      <View style={styles.welcome}>
        <Animated.View entering={FadeInDown.duration(600)}>
          <AxoMascot mood="neutral" size={220} />
        </Animated.View>
        <Animated.Text entering={FadeInUp.delay(200)} style={[styles.brand, { color: colors.primary }]}>
          TENAZ
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(350)} style={[styles.promise, { color: colors.text }]}>
          Entrena tu mente para doblarte sin romperte en 5 minutos al día.
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(500)} style={[styles.greeting, { color: colors.textMuted }]}>
          Soy Axo, un ajolote. Mi especie regenera lo que pierde. Te voy a enseñar a hacer lo mismo.
        </Animated.Text>
        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          TENAZ es entrenamiento psicoeducativo y no sustituye la atención profesional. Si estás en crisis, contacta a
          los servicios de emergencia o a una línea de ayuda de tu país.
        </Text>
      </View>
    </Screen>
  );
}

function StepHeader({ progress, onBack }: { readonly progress: number; readonly onBack: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.stepHeader}>
      <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={onBack} hitSlop={12}>
        <ArrowLeft color={colors.textMuted} size={26} />
      </Pressable>
      <ProgressBar value={progress} />
    </View>
  );
}

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const user = useResilienceStore((state) => state.user);
  const activeCrucible = useResilienceStore((state) => state.activeCrucible);
  const setUser = useResilienceStore((state) => state.setUser);

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [birth, setBirth] = useState<DateParts>({ day: '', month: '', year: '' });

  if (user && activeCrucible) return <Redirect href="/modules" />;
  if (user) return <Redirect href="/select-crucible" />;

  if (step === 'welcome') {
    return <Welcome onStart={() => setStep('name')} />;
  }

  const nameError = validateName(name);
  const birthStarted = birth.day.length > 0 || birth.month.length > 0 || birth.year.length > 0;
  const birthResult = validateBirthDate(birth);

  const updateBirth = (field: keyof DateParts, value: string) => {
    setBirth((current) => ({ ...current, [field]: value.replace(/\D/g, '') }));
  };

  const finish = () => {
    if (nameError || !birthResult.valid) return;
    setUser(name, birthResult.isoDate);
    haptic('success');
    router.replace('/select-crucible');
  };

  if (step === 'name') {
    return (
      <Screen
        header={<StepHeader progress={0.5} onBack={() => setStep('welcome')} />}
        footer={
          <Button3D
            label="Continuar"
            onPress={() => {
              setNameTouched(true);
              if (!nameError) setStep('birth');
            }}
            disabled={nameError !== null}
          />
        }
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.form}>
          <AxoSays mood="neutral" message="¡Hola! ¿Cómo quieres que te llame durante el entrenamiento?" />
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={() => setNameTouched(true)}
            placeholder="Tu nombre o alias"
            placeholderTextColor={colors.textMuted}
            autoFocus
            maxLength={NAME_MAX + 5}
            returnKeyType="next"
            onSubmitEditing={() => !nameError && setStep('birth')}
            style={[
              styles.input,
              { color: colors.text, backgroundColor: colors.surface, borderColor: nameError && nameTouched ? colors.danger : colors.border },
            ]}
          />
          {nameError && nameTouched ? <Text style={[styles.error, { color: colors.danger }]}>{nameError}</Text> : null}
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  let birthMessage = `Rango admitido: ${MIN_AGE} a ${MAX_AGE} años.`;
  let birthColor = colors.textMuted;
  if (birthStarted && birthResult.valid) {
    birthMessage = `Perfecto: tienes ${birthResult.age} años.`;
    birthColor = colors.success;
  } else if (birthStarted && !birthResult.valid) {
    birthMessage = birthResult.reason;
    birthColor = birth.year.length === 4 ? colors.danger : colors.textMuted;
  }

  return (
    <Screen
      header={<StepHeader progress={1} onBack={() => setStep('name')} />}
      footer={<Button3D label="Crear mi perfil" onPress={finish} disabled={!birthResult.valid} haptics="none" />}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.form}>
        <AxoSays mood="thinking" message={`${name.trim()}, ¿cuándo naciste? TENAZ está calibrada para adultos de ${MIN_AGE} a ${MAX_AGE} años.`} />
        <View style={styles.dateRow}>
          {(
            [
              { field: 'day', label: 'Día', placeholder: 'DD', max: 2, flex: 1 },
              { field: 'month', label: 'Mes', placeholder: 'MM', max: 2, flex: 1 },
              { field: 'year', label: 'Año', placeholder: 'AAAA', max: 4, flex: 1.5 },
            ] as const
          ).map((item) => (
            <View key={item.field} style={[styles.dateField, { flex: item.flex }]}>
              <Text style={[styles.dateLabel, { color: colors.textMuted }]}>{item.label}</Text>
              <TextInput
                value={birth[item.field]}
                onChangeText={(value) => updateBirth(item.field, value)}
                placeholder={item.placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={item.max}
                accessibilityLabel={item.label}
                style={[
                  styles.input,
                  styles.dateInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: birthStarted ? (birthResult.valid ? colors.success : colors.border) : colors.border,
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <View style={[styles.ageBadge, { borderColor: birthColor }]}>
          <Text style={[styles.ageText, { color: birthColor }]}>{birthMessage}</Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  welcome: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  brand: { ...typography.display, fontSize: 52, letterSpacing: 8 },
  promise: { ...typography.title, textAlign: 'center', fontSize: 22, lineHeight: 30 },
  greeting: { ...typography.body, textAlign: 'center' },
  disclaimer: { ...typography.caption, fontWeight: '500', textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  form: { flex: 1, gap: spacing.lg, paddingTop: spacing.lg },
  input: {
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 18,
    fontWeight: '600',
  },
  error: { ...typography.caption },
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateField: { gap: spacing.xs },
  dateLabel: { ...typography.caption, textTransform: 'uppercase' },
  dateInput: { textAlign: 'center' },
  ageBadge: { borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, borderColor: palette.victory },
  ageText: { ...typography.body, fontWeight: '700', textAlign: 'center' },
});
