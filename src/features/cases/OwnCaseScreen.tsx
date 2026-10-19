import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button3D } from '@/components/ui/Button3D';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { CASE_QUESTION_TITLES } from '@/data/cases';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { OWN_CASE_FIELD_MAX, OWN_CASE_TITLE_MAX, type OwnCaseDraft } from '@/store/types';
import { radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type Field = keyof OwnCaseDraft;

const FIELDS: readonly { readonly key: Field; readonly label: string; readonly placeholder: string }[] = [
  { key: 'title', label: '¿Qué pasó? (un título corto)', placeholder: 'Ej.: La discusión con mi hermano' },
  { key: 'impulses', label: CASE_QUESTION_TITLES[0], placeholder: 'Ej.: Quise gritarle y tirar la puerta' },
  { key: 'thoughts', label: CASE_QUESTION_TITLES[1], placeholder: 'Pensé… Sentí… Hice…' },
  { key: 'frustration', label: CASE_QUESTION_TITLES[2], placeholder: 'En mi cuerpo, en lo que pensé, en lo que hice…' },
  { key: 'technique', label: CASE_QUESTION_TITLES[3], placeholder: 'Ej.: STOP, respiración 4-7-8, tiempo fuera…' },
];

const EMPTY: OwnCaseDraft = { title: '', impulses: '', thoughts: '', frustration: '', technique: '' };

/** "Escribe tu propio caso": la misma guía de 4 preguntas aplicada a una situación propia. */
export function OwnCaseScreen() {
  const { colors } = useTheme();
  const addOwnCase = useAppStore((state) => state.addOwnCase);
  const [draft, setDraft] = useState<OwnCaseDraft>(EMPTY);
  const canSave = draft.title.trim().length > 0 && FIELDS.slice(1).some(({ key }) => draft[key].trim().length > 0);

  const save = () => {
    if (!canSave) return;
    addOwnCase(draft);
    haptic('success');
    router.back();
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <BackHeader title="Mi propio caso" />
            <RegiSays message="Mírate como si fueras el personaje. Sin juzgarte: solo observa. Esto se queda en tu teléfono." pose="empathetic" />
            {FIELDS.map(({ key, label, placeholder }) => (
              <View key={key} style={styles.field}>
                <AppText variant="bodyStrong">{label}</AppText>
                <TextInput
                  value={draft[key]}
                  onChangeText={(text) => setDraft((current) => ({ ...current, [key]: text }))}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textMuted}
                  accessibilityLabel={label}
                  multiline={key !== 'title'}
                  maxLength={key === 'title' ? OWN_CASE_TITLE_MAX : OWN_CASE_FIELD_MAX}
                  style={[
                    styles.input,
                    key !== 'title' && styles.multiline,
                    { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border },
                  ]}
                />
              </View>
            ))}
            <Button3D label="Guardar mi caso" size="lg" disabled={!canSave} onPress={save} />
            {canSave ? null : (
              <AppText variant="caption" tone="muted" align="center">
                Escribe un título y responde al menos una pregunta.
              </AppText>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  field: { gap: spacing.xs },
  input: { borderWidth: 2, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 16, fontFamily: fontFamily.medium, minHeight: 50 },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
