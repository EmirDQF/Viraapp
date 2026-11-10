import { ArrowLeft, ChevronRight, Clapperboard } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { activitiesOf } from '@/data/caminos/activities';
import { PA3_MODULE_LIST } from '@/data/caminos/modules';
import type { Pa3Module, Pa3ModuleId } from '@/data/caminos/types';
import { CaminoIcon } from '@/features/caminos/CaminoIcon';
import { caminos, caminosText, PATH_COLORS } from '@/features/caminos/theme';
import { useRise } from '@/features/caminos/useRise';
import { moduleProgress, moduleTag, pathOfModule, type CaminoActivities, type CaminoJourneys } from '@/lib/caminos';
import { MAX_FONT_SCALE } from '@/theme/typography';

const TEXT_SCALE = { maxFontSizeMultiplier: MAX_FONT_SCALE } as const;

interface ModuleRowProps {
  readonly module: Pa3Module;
  readonly index: number;
  readonly active: boolean;
  readonly reduceMotion: boolean;
  readonly started: boolean;
  readonly activities: CaminoActivities;
  readonly onOpen: (id: Pa3ModuleId) => void;
}

const ModuleRow = memo(function ModuleRow({ module, index, active, reduceMotion, started, activities, onOpen }: ModuleRowProps) {
  const rise = useRise(active, index * 60 + 150, 450, reduceMotion);
  const path = pathOfModule(module.id);
  const color = PATH_COLORS[path.id];
  const progress = moduleProgress(module.id, activities);
  const tag = moduleTag(progress, started);
  const detail = `${module.courseCode} · ${module.topic} · ${activitiesOf(module.id).length} actividades`;

  return (
    <Animated.View style={rise}>
      <Pressable
        onPress={() => onOpen(module.id)}
        accessibilityRole="button"
        accessibilityLabel={`${module.title}. Camino ${path.number}. ${detail}. ${tag}`}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <View style={[styles.tile, { backgroundColor: color }]}>
          <CaminoIcon name={module.icon} size={21} color={caminos.cardBg} />
        </View>
        <View style={styles.flex}>
          <View style={styles.badgeRow}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[caminosText.eyebrow, { color }]} {...TEXT_SCALE}>{`Camino ${path.number}`}</Text>
          </View>
          <Text style={caminosText.stopTitle} {...TEXT_SCALE}>
            {module.title}
          </Text>
          <Text style={styles.sub} {...TEXT_SCALE}>
            {detail}
          </Text>
        </View>
        <View style={styles.tag}>
          <Text style={[caminosText.tag, { color: caminos.teal }]} {...TEXT_SCALE}>
            {tag}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

interface AllModulesProps {
  readonly active: boolean;
  readonly reduceMotion: boolean;
  readonly bottomSpace: number;
  readonly journeys: CaminoJourneys;
  readonly activities: CaminoActivities;
  readonly onBack: () => void;
  readonly onOpenModule: (id: Pa3ModuleId) => void;
  readonly onMore: () => void;
}

/** "Ver los 7 módulos": acceso directo a cualquier módulo, con su camino, tema y avance. */
export function AllModules({ active, reduceMotion, bottomSpace, journeys, activities, onBack, onOpenModule, onMore }: AllModulesProps) {
  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomSpace }]} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Volver a caminos" hitSlop={12} style={styles.back}>
        <ArrowLeft size={16} color={caminos.teal} strokeWidth={2.4} />
        <Text style={[caminosText.button, { color: caminos.teal }]} {...TEXT_SCALE}>
          Volver a caminos
        </Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
          Todos los módulos
        </Text>
        <Text style={caminosText.h2Detail} accessibilityRole="header" {...TEXT_SCALE}>
          Los 7 módulos
        </Text>
        <Text style={[caminosText.lead, styles.lead]} {...TEXT_SCALE}>
          Entra directo al tema que necesites hoy. Cada uno conserva el color de su camino.
        </Text>
      </View>
      <View style={styles.list}>
        {PA3_MODULE_LIST.map((module, index) => (
          <ModuleRow
            key={module.id}
            module={module}
            index={index}
            active={active}
            reduceMotion={reduceMotion}
            started={Boolean(journeys[module.id]?.before)}
            activities={activities}
            onOpen={onOpenModule}
          />
        ))}
      </View>
      <Pressable
        onPress={onMore}
        accessibilityRole="button"
        accessibilityLabel="Laboratorio de casos y recursos"
        style={({ pressed }) => [styles.more, pressed && styles.pressed]}
      >
        <Clapperboard size={22} color={caminos.teal} strokeWidth={2} />
        <View style={styles.flex}>
          <Text style={caminosText.stopTitle} {...TEXT_SCALE}>
            Laboratorio de casos y recursos
          </Text>
          <Text style={styles.sub} {...TEXT_SCALE}>
            Películas y series, fuentes confiables y eventos.
          </Text>
        </View>
        <ChevronRight color={caminos.line} size={20} strokeWidth={2} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 4 },
  header: { marginTop: 14, paddingRight: 76 },
  lead: { marginTop: 6 },
  list: { marginTop: 16, gap: 10 },
  flex: { flex: 1, minWidth: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: caminos.cardBg,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: caminos.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  pressed: { opacity: 0.9 },
  tile: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  sub: { fontFamily: caminosText.small.fontFamily, fontSize: 12.5, lineHeight: 17, color: caminos.muted },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: caminos.mint },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: caminos.line,
  },
});
