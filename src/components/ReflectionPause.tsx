import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';

const READING_SECONDS = 8;

interface ReflectionPauseProps {
  readonly visible: boolean;
  readonly concept: string;
  readonly onRefill: () => void;
}

/** Se muestra cuando la energía reflexiva llega a 0: invita a releer en lugar de castigar. */
export function ReflectionPause({ visible, concept, onRefill }: ReflectionPauseProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={() => undefined}>
      {/* El contenido se monta solo mientras el modal es visible, así el contador se reinicia solo. */}
      {visible ? <PauseContent concept={concept} onRefill={onRefill} /> : null}
    </Modal>
  );
}

function PauseContent({ concept, onRefill }: Omit<ReflectionPauseProps, 'visible'>) {
  const { colors } = useTheme();
  const [remaining, setRemaining] = useState(READING_SECONDS);

  useEffect(() => {
    const timer = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[styles.backdrop, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <RegiMascot pose="empathetic" size={150} />
        <Text style={[styles.title, { color: colors.text }]}>Pausa de relectura consciente</Text>
        <Text style={[styles.body, { color: colors.textMuted }]}>
          Tu energía reflexiva se agotó. No es un castigo: equivocarse es parte de entrenar la mente. Lee con calma
          esta idea antes de volver.
        </Text>
        <View style={[styles.concept, { backgroundColor: colors.surfaceAlt, borderColor: colors.primary }]}>
          <Text style={[styles.conceptText, { color: colors.text }]}>{concept}</Text>
        </View>
      </View>
      <Button3D
        label={remaining > 0 ? `Leyendo… ${remaining}s` : 'Recargar energía'}
        onPress={onRefill}
        disabled={remaining > 0}
        variant="accent"
        haptics="success"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, padding: spacing.xl, justifyContent: 'space-between' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { ...typography.title, textAlign: 'center' },
  body: { ...typography.body, textAlign: 'center' },
  concept: { borderLeftWidth: 5, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg },
  conceptText: { ...typography.body, fontWeight: '600' },
});
