import { StyleSheet, Text, View } from 'react-native';

import type { Activity, InitialSituation } from '@/data/caminos/types';
import { TEXT_SCALE } from '@/features/caminos/CaminoParts';
import { caminos, caminosText } from '@/features/caminos/theme';
import type { SituationAnswer } from '@/lib/caminos';

interface CompareRowProps {
  readonly label: string;
  readonly before: string;
  readonly after: string;
  readonly color: string;
}

function CompareRow({ label, before, after, color }: CompareRowProps) {
  const changed = before !== after;
  return (
    <View style={styles.compareRow} accessible accessibilityLabel={`${label}. Antes: ${before}. Ahora: ${after}.`}>
      <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
        {label}
      </Text>
      <View style={styles.columns}>
        <View style={[styles.cell, styles.cellBefore]}>
          <Text style={[caminosText.tag, { color: caminos.muted }]} {...TEXT_SCALE}>
            ANTES
          </Text>
          <Text style={caminosText.body} {...TEXT_SCALE}>
            {before}
          </Text>
        </View>
        <View style={[styles.cell, { borderColor: changed ? color : caminos.line }]}>
          <Text style={[caminosText.tag, { color }]} {...TEXT_SCALE}>
            AHORA
          </Text>
          <Text style={caminosText.body} {...TEXT_SCALE}>
            {after}
          </Text>
        </View>
      </View>
    </View>
  );
}

/** Mensaje sobre la tensión: se observa, no se exige que baje. */
function tensionNote(before: number, after: number): string {
  if (after < before) return 'Hoy lo sientes con menos tensión. Nota qué te ayudó.';
  if (after > before) return 'Hoy lo sientes con más tensión, y está bien: notarlo también es avanzar.';
  return 'La tensión se mantiene. Lo importante es qué decides hacer con ella.';
}

interface BeforeAfterProps {
  readonly situation: InitialSituation;
  readonly before: SituationAnswer;
  readonly after: SituationAnswer;
  readonly evidence: readonly Activity[];
  readonly color: string;
}

/** Etapa 04 · Antes y ahora: decisión, argumento y evidencia del inicio frente a los de ahora. */
export function BeforeAfter({ situation, before, after, evidence, color }: BeforeAfterProps) {
  const sameDecision = before.decision === after.decision;
  return (
    <View style={styles.root}>
      <CompareRow label="Decisión" before={situation.decisions[before.decision]} after={situation.decisions[after.decision]} color={color} />
      <CompareRow label="Argumento" before={situation.arguments[before.argument]} after={situation.arguments[after.argument]} color={color} />
      <View style={styles.compareRow}>
        <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
          Evidencia
        </Text>
        <Text style={caminosText.body} {...TEXT_SCALE}>
          {evidence.length > 0
            ? `Lo que practicaste: ${evidence.map((activity) => activity.title).join(', ')}.`
            : 'Aún no completas actividades de este módulo.'}
        </Text>
      </View>
      <View style={styles.compareRow} accessible>
        <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
          Tensión
        </Text>
        <Text style={caminosText.bodyStrong} {...TEXT_SCALE}>{`Antes ${before.tension} de 5 · Ahora ${after.tension} de 5`}</Text>
        <Text style={caminosText.small} {...TEXT_SCALE}>
          {tensionNote(before.tension, after.tension)}
        </Text>
      </View>
      <View style={styles.reflection}>
        <Text style={caminosText.body} {...TEXT_SCALE}>
          {sameDecision
            ? 'Mantuviste tu decisión. Revisa si tu argumento cambió: a veces lo que madura es el porqué.'
            : 'Cambiaste tu decisión. Mira qué evidencia te hizo verlo de otra forma.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  compareRow: { gap: 6 },
  columns: { flexDirection: 'row', gap: 8 },
  cell: { flex: 1, gap: 4, padding: 10, borderRadius: 14, borderWidth: 2, backgroundColor: caminos.cardBg },
  cellBefore: { borderColor: caminos.line, backgroundColor: caminos.appBg },
  reflection: { backgroundColor: caminos.mint, borderRadius: 14, padding: 12 },
});
