import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { InitialSituation } from '@/data/caminos/types';
import { ChoiceList, PillButton, TEXT_SCALE } from '@/features/caminos/CaminoParts';
import { caminos, caminosText } from '@/features/caminos/theme';
import { TENSION_MAX, TENSION_MIN, type SituationAnswer } from '@/lib/caminos';

const TENSION_STEPS = Array.from({ length: TENSION_MAX - TENSION_MIN + 1 }, (_, index) => TENSION_MIN + index);
const TENSION_WORDS: Readonly<Record<number, string>> = { 1: 'Muy poca', 2: 'Poca', 3: 'Media', 4: 'Bastante', 5: 'Mucha' };

interface SituationFormProps {
  readonly situation: InitialSituation;
  readonly color: string;
  readonly submitLabel: string;
  /** Pregunta alternativa para "Antes y ahora". */
  readonly question?: string;
  readonly onSubmit: (answer: Omit<SituationAnswer, 'at'>) => void;
}

/** Caso breve: decisión, argumento y tensión. Se usa al inicio del módulo y otra vez en "Antes y ahora". */
export function SituationForm({ situation, color, submitLabel, question, onSubmit }: SituationFormProps) {
  const [decision, setDecision] = useState<number | null>(null);
  const [argument, setArgument] = useState<number | null>(null);
  const [tension, setTension] = useState<number | null>(null);
  const ready = decision !== null && argument !== null && tension !== null;

  return (
    <View style={styles.root}>
      <ChoiceList label={question ?? situation.question} options={situation.decisions} selected={decision} color={color} onSelect={setDecision} />
      <ChoiceList label="¿Por qué?" options={situation.arguments} selected={argument} color={color} onSelect={setArgument} />
      <View style={styles.tension} accessibilityRole="radiogroup" accessibilityLabel="¿Cuánta tensión sientes al pensarlo?">
        <Text style={caminosText.bodyStrong} {...TEXT_SCALE}>
          ¿Cuánta tensión sientes al pensarlo?
        </Text>
        <View style={styles.scale}>
          {TENSION_STEPS.map((value) => {
            const selected = tension === value;
            return (
              <Pressable
                key={value}
                onPress={() => setTension(value)}
                accessibilityRole="radio"
                accessibilityLabel={`${value}: ${TENSION_WORDS[value]}`}
                accessibilityState={{ checked: selected }}
                style={[styles.dot, selected && { backgroundColor: color, borderColor: color }]}
              >
                <Text style={[caminosText.bodyStrong, { color: selected ? caminos.cardBg : caminos.ink }]} {...TEXT_SCALE}>
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={caminosText.small} {...TEXT_SCALE}>
          {tension === null ? 'Elige del 1 (muy poca) al 5 (mucha). No hay respuestas correctas.' : TENSION_WORDS[tension]}
        </Text>
      </View>
      <View style={styles.row}>
        <PillButton
          label={submitLabel}
          color={color}
          disabled={!ready}
          hint={ready ? undefined : 'Elige una decisión, un argumento y tu nivel de tensión'}
          onPress={() => {
            if (decision !== null && argument !== null && tension !== null) onSubmit({ decision, argument, tension });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 14 },
  tension: { gap: 8 },
  scale: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  dot: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: caminos.line,
    backgroundColor: caminos.appBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { flexDirection: 'row' },
});
