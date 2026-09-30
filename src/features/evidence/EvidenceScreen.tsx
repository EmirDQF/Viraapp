import { ArrowLeft, BookOpen, Compass, Handshake, Heart, Lightbulb, Medal, MountainSnow, Plus, Star, Sun, Trophy, type LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button3D } from '@/components/ui/Button3D';
import { EmptyState } from '@/components/ui/ComingSoon';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { Sheet } from '@/components/ui/Sheet';
import { goBackOrHome } from '@/features/game/navigation';
import { toIsoDate } from '@/lib/age';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { EVIDENCE_ICONS, type EvidenceIcon, type EvidenceItem } from '@/store/types';
import { enterAnimation } from '@/theme/motion';
import { MIN_TOUCH, MODULE_COLORS, brand, elevation, feedback, gradients, radius, spacing } from '@/theme/tokens';
import { useReduceMotion } from '@/theme/useReduceMotion';
import { fontFamily } from '@/theme/typography';

/** Paleta dorada solo en esta pantalla (maqueta 8). */
const GOLD = MODULE_COLORS.muro;
const ICONS: Readonly<Record<EvidenceIcon, LucideIcon>> = {
  trophy: Trophy,
  mountain: MountainSnow,
  lightbulb: Lightbulb,
  handshake: Handshake,
  heart: Heart,
  compass: Compass,
  star: Star,
  sun: Sun,
  medal: Medal,
  book: BookOpen,
};
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'] as const;

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day} ${MONTHS[Number(month) - 1] ?? ''} ${year}`;
}

function EvidenceTile({ item, index }: { readonly item: EvidenceItem; readonly index: number }) {
  const reduceMotion = useReduceMotion();
  const Icon = ICONS[item.icon];
  return (
    <Animated.View
      entering={enterAnimation(index, reduceMotion)}
      style={[styles.tile, elevation.sm, { backgroundColor: brand.white, borderColor: feedback.gold }]}
      accessible
      accessibilityLabel={`${item.title}, ${formatDate(item.date)}`}
    >
      <IconTile color={feedback.gold} gradient={gradients.gold} size={52}>
        <Icon color={brand.ink} size={26} strokeWidth={ICON_STROKE} />
      </IconTile>
      <AppText variant="caption" color={GOLD.on} align="center" uppercase numberOfLines={3}>
        {item.title}
      </AppText>
      <AppText variant="caption" color={GOLD.on} align="center" style={styles.date}>
        {formatDate(item.date)}
      </AppText>
    </Animated.View>
  );
}

function AddEvidenceSheet({ visible, onClose }: { readonly visible: boolean; readonly onClose: () => void }) {
  const addEvidence = useAppStore((state) => state.addEvidence);
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<EvidenceIcon>('trophy');
  const save = () => {
    if (title.trim().length < 3) return;
    addEvidence({ title: title.trim(), icon, date: toIsoDate(new Date()), source: 'manual' });
    haptic('success');
    setTitle('');
    onClose();
  };
  return (
    <Sheet visible={visible} onClose={onClose} title="Añadir logro" footer={<Button3D label="Guardar en mi muro" disabled={title.trim().length < 3} tone={{ face: GOLD.base, shadow: GOLD.deep, text: GOLD.on }} onPress={save} />}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ej.: aprobé el parcial de estadística"
        placeholderTextColor={GOLD.deep}
        accessibilityLabel="Logro"
        maxLength={60}
        style={[styles.input, { borderColor: feedback.gold, color: GOLD.on, backgroundColor: GOLD.soft }]}
      />
      <View style={styles.icons} accessibilityRole="radiogroup">
        {EVIDENCE_ICONS.map((key) => {
          const Icon = ICONS[key];
          return (
            <Pressable
              key={key}
              accessibilityRole="radio"
              accessibilityState={{ checked: icon === key }}
              aria-checked={icon === key}
              accessibilityLabel={`Ícono ${key}`}
              onPress={() => setIcon(key)}
              style={[styles.iconPick, { borderColor: icon === key ? GOLD.deep : feedback.gold, backgroundColor: icon === key ? feedback.gold : GOLD.soft }]}
            >
              <Icon color={GOLD.on} size={22} />
            </Pressable>
          );
        })}
      </View>
    </Sheet>
  );
}

/** Muro de Evidencia (maqueta 8): tus victorias sobre momentos difíciles, del juego y añadidas a mano. */
export function EvidenceScreen() {
  const evidence = useAppStore((state) => state.evidence);
  const [adding, setAdding] = useState(false);
  return (
    <View style={styles.safe}>
      <LinearGradient colors={[GOLD.soft, brand.ivory, GOLD.soft]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <AnimatedPressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={10} style={styles.back}>
            <ArrowLeft color={GOLD.on} size={24} strokeWidth={ICON_STROKE} />
          </AnimatedPressable>
          <View style={styles.flex}>
            <AppText variant="title" color={GOLD.on} uppercase accessibilityRole="header">
              Muro de evidencia
            </AppText>
            <AppText color={GOLD.on}>Tus victorias sobre momentos difíciles</AppText>
          </View>
          <IconTile color={feedback.gold} gradient={gradients.gold} size={52}>
            <Trophy color={brand.ink} size={26} strokeWidth={ICON_STROKE} />
          </IconTile>
        </View>
        <View style={[styles.ribbon, elevation.md]} accessible accessibilityLabel={`${evidence.length} crisis superadas`}>
          <LinearGradient colors={gradients.gold} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[StyleSheet.absoluteFill, styles.ribbonFill]} />
          <Medal color={GOLD.on} size={20} />
          <AppText variant="subtitle" color={GOLD.on}>
            {evidence.length} {evidence.length === 1 ? 'crisis superada' : 'crisis superadas'}
          </AppText>
        </View>
        <View style={styles.add}>
          <Button3D
            label="Añadir logro"
            icon={<Plus color={GOLD.on} size={18} />}
            tone={{ face: feedback.gold, shadow: GOLD.deep, text: GOLD.on }}
            gradient={gradients.gold}
            onPress={() => setAdding(true)}
          />
        </View>
        <FlatList
          data={evidence}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => <EvidenceTile item={item} index={index} />}
          ListEmptyComponent={<EmptyState title="Tu muro te espera" message="Cada módulo completado, cada impulso resistido y cada logro que añadas quedarán aquí como evidencia." pose="resilient" />}
        />
        <AddEvidenceSheet visible={adding} onClose={() => setAdding(false)} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.screen, paddingVertical: spacing.md },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  ribbon: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    zIndex: 0,
  },
  ribbonFill: { borderRadius: radius.pill, zIndex: -1 },
  add: { paddingHorizontal: spacing.xxl, paddingTop: spacing.md },
  grid: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.sm, flexGrow: 1 },
  row: { gap: spacing.sm },
  tile: { flex: 1 / 3, alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.lg, borderWidth: 1.5, minHeight: 156 },
  date: { marginTop: 'auto' },
  input: { borderWidth: 2, borderRadius: radius.lg, padding: spacing.md, fontFamily: fontFamily.semibold, fontSize: 16 },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  iconPick: { width: MIN_TOUCH + 4, height: MIN_TOUCH + 4, borderRadius: radius.md, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
