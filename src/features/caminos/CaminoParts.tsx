import { ArrowLeft, Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ActivityStatus } from '@/data/caminos/types';
import { RegiAvatar } from '@/features/caminos/RegiOrb';
import { caminos, caminosText, STATUS_LABEL } from '@/features/caminos/theme';
import { MAX_FONT_SCALE } from '@/theme/typography';

export const TEXT_SCALE = { maxFontSizeMultiplier: MAX_FONT_SCALE } as const;

interface CaminoHeaderProps {
  readonly backLabel: string;
  readonly onBack: () => void;
  readonly eyebrow: string;
  readonly title: string;
  readonly color: string;
  readonly lead?: string;
}

/** Encabezado de las pantallas de caminos: volver, eyebrow del color del camino, título y Regi en la esquina. */
export function CaminoHeader({ backLabel, onBack, eyebrow, title, color, lead }: CaminoHeaderProps) {
  return (
    <View>
      <View style={styles.topRow}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel={`Volver a ${backLabel}`} hitSlop={12} style={styles.back}>
          <ArrowLeft size={16} color={caminos.teal} strokeWidth={2.4} />
          <Text style={[caminosText.button, { color: caminos.teal }]} {...TEXT_SCALE}>
            {backLabel}
          </Text>
        </Pressable>
        <RegiAvatar size={56} />
      </View>
      <Text style={[caminosText.eyebrow, styles.eyebrow, { color }]} {...TEXT_SCALE}>
        {eyebrow}
      </Text>
      <Text style={caminosText.h2Detail} accessibilityRole="header" {...TEXT_SCALE}>
        {title}
      </Text>
      {lead ? (
        <Text style={[caminosText.lead, styles.lead]} {...TEXT_SCALE}>
          {lead}
        </Text>
      ) : null}
    </View>
  );
}

/** Insignia de estado de construcción: DESARROLLADO / MAQUETA / PROPUESTO. */
export function StatusBadge({ status }: { readonly status: ActivityStatus }) {
  const tone = status === 'desarrollado' ? styles.badgeDone : status === 'maqueta' ? styles.badgeDraft : styles.badgePlanned;
  const color = status === 'desarrollado' ? caminos.teal : status === 'maqueta' ? caminos.draftText : caminos.muted;
  return (
    <View style={[styles.badge, tone]}>
      <Text style={[caminosText.tag, styles.badgeText, { color }]} {...TEXT_SCALE}>
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

interface SectionProps {
  readonly number: string;
  readonly title: string;
  readonly color: string;
  readonly current: boolean;
  readonly children: ReactNode;
}

/** Bloque numerado de una etapa (01 Situación inicial, 02 Explora y practica…). */
export function StageSection({ number, title, color, current, children }: SectionProps) {
  return (
    <View style={[styles.section, current && { borderColor: color }]}>
      <View style={styles.sectionHead}>
        <View style={[styles.number, { backgroundColor: current ? color : caminos.mint }]}>
          <Text style={[caminosText.tag, { color: current ? caminos.cardBg : caminos.teal }]} {...TEXT_SCALE}>
            {number}
          </Text>
        </View>
        <Text style={[caminosText.cardTitle, styles.flex]} accessibilityRole="header" {...TEXT_SCALE}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

interface ChoiceListProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly selected: number | null;
  readonly color: string;
  readonly onSelect: (index: number) => void;
  readonly disabled?: boolean;
}

/** Lista de opciones de selección única (radio). */
export function ChoiceList({ label, options, selected, color, onSelect, disabled = false }: ChoiceListProps) {
  return (
    <View style={styles.choices} accessibilityRole="radiogroup" accessibilityLabel={label}>
      <Text style={caminosText.bodyStrong} {...TEXT_SCALE}>
        {label}
      </Text>
      {options.map((option, index) => {
        const isSelected = selected === index;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(index)}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled }}
            style={[styles.choice, isSelected && { borderColor: color, backgroundColor: caminos.cardBg }]}
          >
            <View style={[styles.radio, isSelected && { borderColor: color, backgroundColor: color }]}>
              {isSelected ? <Check size={12} color={caminos.cardBg} strokeWidth={3} /> : null}
            </View>
            <Text style={[caminosText.body, styles.flex]} {...TEXT_SCALE}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface PillButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly variant?: 'solid' | 'ghost';
  readonly color?: string;
  readonly disabled?: boolean;
  readonly icon?: ReactNode;
  readonly hint?: string;
}

/** Botón redondeado del prototipo (sólido teal o "ghost" con borde). */
export function PillButton({ label, onPress, variant = 'solid', color = caminos.teal, disabled = false, icon, hint }: PillButtonProps) {
  const solid = variant === 'solid';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={hint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.pill,
        solid ? { backgroundColor: color } : styles.pillGhost,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {icon}
      <Text style={[caminosText.button, { color: solid ? caminos.appBg : caminos.teal }]} {...TEXT_SCALE}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4, minHeight: 44 },
  eyebrow: { marginTop: 6 },
  lead: { marginTop: 6 },
  flex: { flex: 1, minWidth: 0 },
  badge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 999 },
  badgeText: { letterSpacing: 0.6 },
  badgeDone: { backgroundColor: caminos.mint },
  badgeDraft: { backgroundColor: caminos.draftBg },
  badgePlanned: { borderWidth: 1.5, borderColor: caminos.line },
  section: {
    backgroundColor: caminos.cardBg,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: caminos.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  number: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  choices: { gap: 8 },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: caminos.line,
    backgroundColor: caminos.appBg,
  },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: caminos.line, alignItems: 'center', justifyContent: 'center' },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 46,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  pillGhost: { backgroundColor: 'transparent', borderWidth: 2, borderColor: caminos.line },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
});
