import { ArrowLeft, Lock } from 'lucide-react-native';
import { memo, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { activitiesOf } from '@/data/caminos/activities';
import { PA3_MODULES } from '@/data/caminos/modules';
import type { CaminoPath, Pa3ModuleId, PathStop } from '@/data/caminos/types';
import { CaminoIcon } from '@/features/caminos/CaminoIcon';
import { RegiAvatar } from '@/features/caminos/RegiOrb';
import { caminos, caminosText, PATH_COLORS } from '@/features/caminos/theme';
import { useRise } from '@/features/caminos/useRise';
import { moduleProgress, moduleTag, type CaminoActivities, type CaminoJourneys } from '@/lib/caminos';
import { MAX_FONT_SCALE } from '@/theme/typography';

const TEXT_SCALE = { maxFontSizeMultiplier: MAX_FONT_SCALE } as const;

interface StopRowProps {
  readonly stop: PathStop;
  readonly index: number;
  readonly color: string;
  readonly active: boolean;
  readonly reduceMotion: boolean;
  readonly journeys: CaminoJourneys;
  readonly activities: CaminoActivities;
  readonly onOpenModule: (id: Pa3ModuleId) => void;
  readonly onSoon: (title: string) => void;
}

const StopRow = memo(function StopRow({ stop, index, color, active, reduceMotion, journeys, activities, onOpenModule, onSoon }: StopRowProps) {
  const rise = useRise(active, index * 120 + 250, 500, reduceMotion);

  if (stop.kind === 'soon') {
    return (
      <Animated.View style={rise}>
        <Pressable
          onPress={() => onSoon(stop.title)}
          accessibilityRole="button"
          accessibilityLabel={`${stop.title}. Tema por venir. Pronto`}
          style={[styles.stop, styles.stopSoon]}
        >
          <View style={[styles.node, styles.nodeSoon]} />
          <View style={[styles.stopTile, styles.tileSoon]}>
            <Lock size={21} color={caminos.muted} strokeWidth={2} />
          </View>
          <View style={styles.flex}>
            <Text style={[caminosText.stopTitle, styles.soonText]} {...TEXT_SCALE}>
              {stop.title}
            </Text>
            <Text style={styles.stopSub} {...TEXT_SCALE}>
              Tema por venir
            </Text>
          </View>
          <View style={[styles.tag, styles.tagSoon]}>
            <Text style={[caminosText.tag, styles.soonText]} {...TEXT_SCALE}>
              Pronto
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    );
  }

  const module = PA3_MODULES[stop.moduleId];
  const count = activitiesOf(module.id).length;
  const progress = moduleProgress(module.id, activities);
  const started = Boolean(journeys[module.id]?.before) || progress.done > 0;
  const isNewTag = module.isNew === true && !started;
  const tag = isNewTag ? 'Nuevo' : moduleTag(progress, started);
  const subtitle = `${module.topic} · ${count} actividades`;

  return (
    <Animated.View style={rise}>
      <Pressable
        onPress={() => onOpenModule(module.id)}
        accessibilityRole="button"
        accessibilityLabel={`${module.title}. ${subtitle}. ${tag}`}
        style={({ pressed }) => [styles.stop, pressed && styles.pressed]}
      >
        <View style={[styles.node, { backgroundColor: color }]} />
        <View style={[styles.stopTile, { backgroundColor: color }]}>
          <CaminoIcon name={module.icon} size={21} color={caminos.cardBg} />
        </View>
        <View style={styles.flex}>
          <Text style={caminosText.stopTitle} {...TEXT_SCALE}>
            {module.title}
          </Text>
          <Text style={styles.stopSub} {...TEXT_SCALE}>
            {subtitle}
          </Text>
        </View>
        <View style={[styles.tag, isNewTag ? { backgroundColor: color } : null]}>
          <Text style={[caminosText.tag, { color: isNewTag ? caminos.cardBg : caminos.teal }]} {...TEXT_SCALE}>
            {tag}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
});

interface PathDetailProps {
  readonly path: CaminoPath;
  readonly active: boolean;
  readonly reduceMotion: boolean;
  readonly bottomSpace: number;
  readonly journeys: CaminoJourneys;
  readonly activities: CaminoActivities;
  readonly onBack: () => void;
  readonly onOpenModule: (id: Pa3ModuleId) => void;
  readonly onSoon: (title: string) => void;
  readonly onTip: (activityId: string) => void;
}

/** Dentro de un camino: sus módulos como paradas de una ruta vertical, y el consejo de Regi. */
export function PathDetail({ path, active, reduceMotion, bottomSpace, journeys, activities, onBack, onOpenModule, onSoon, onTip }: PathDetailProps) {
  const color = PATH_COLORS[path.id];
  const line = useSharedValue(0);

  useEffect(() => {
    line.value = 0;
    if (!active) return;
    line.value = reduceMotion ? 1 : withDelay(250, withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) }));
  }, [active, line, path.id, reduceMotion]);

  const lineStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: line.value }] }));
  const tipActivity = path.tip.activityId;

  const tipContent = (
    <>
      <RegiAvatar size={44} />
      <View style={styles.flex}>
        <Text style={styles.tipTitle} {...TEXT_SCALE}>
          {path.tip.title.toUpperCase()}
        </Text>
        <Text style={styles.tipText} {...TEXT_SCALE}>
          {path.tip.text}
        </Text>
      </View>
    </>
  );

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomSpace }]} showsVerticalScrollIndicator={false}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Volver a los caminos" hitSlop={12} style={styles.back}>
        <ArrowLeft size={16} color={caminos.teal} strokeWidth={2.4} />
        <Text style={[caminosText.button, { color: caminos.teal }]} {...TEXT_SCALE}>
          Caminos
        </Text>
      </Pressable>
      <View style={styles.header}>
        <Text style={[caminosText.eyebrow, { color }]} {...TEXT_SCALE}>{`Camino ${path.number} de 3`}</Text>
        <Text style={caminosText.h2Detail} accessibilityRole="header" {...TEXT_SCALE}>
          {path.name}
        </Text>
        <Text style={[caminosText.lead, styles.lead]} {...TEXT_SCALE}>
          {path.lead}
        </Text>
      </View>
      <View style={styles.trail}>
        <Animated.View style={[styles.trailLine, { backgroundColor: color }, lineStyle]} />
        {path.stops.map((stop, index) => (
          <StopRow
            key={stop.kind === 'module' ? stop.moduleId : stop.title}
            stop={stop}
            index={index}
            color={color}
            active={active}
            reduceMotion={reduceMotion}
            journeys={journeys}
            activities={activities}
            onOpenModule={onOpenModule}
            onSoon={onSoon}
          />
        ))}
      </View>
      {tipActivity ? (
        <Pressable
          onPress={() => onTip(tipActivity)}
          accessibilityRole="button"
          accessibilityHint="Abre la actividad recomendada"
          style={({ pressed }) => [styles.tip, pressed && styles.pressed]}
        >
          {tipContent}
        </Pressable>
      ) : (
        <View style={styles.tip} accessible>
          {tipContent}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingVertical: 4 },
  header: { marginTop: 14, paddingRight: 76 },
  lead: { marginTop: 6 },
  flex: { flex: 1, minWidth: 0 },
  trail: { marginTop: 18, paddingLeft: 32, gap: 12 },
  trailLine: { position: 'absolute', left: 10, top: 28, bottom: 28, width: 3, borderRadius: 2, opacity: 0.45, transformOrigin: 'top' },
  stop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: caminos.cardBg,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 12,
    shadowColor: caminos.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  stopSoon: { backgroundColor: 'transparent', borderWidth: 2, borderColor: caminos.line, shadowOpacity: 0, elevation: 0 },
  pressed: { opacity: 0.9 },
  node: {
    position: 'absolute',
    left: -31,
    top: '50%',
    marginTop: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: caminos.appBg,
  },
  nodeSoon: { backgroundColor: caminos.appBg, borderWidth: 2, borderColor: caminos.line },
  stopTile: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tileSoon: { backgroundColor: caminos.mint },
  stopSub: { fontFamily: caminosText.small.fontFamily, fontSize: 12.5, lineHeight: 17, color: caminos.muted },
  soonText: { color: caminos.muted },
  tag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: caminos.mint },
  tagSoon: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: caminos.line },
  tip: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: caminos.mint, borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12, marginTop: 14 },
  tipTitle: { ...caminosText.tag, letterSpacing: 0.66, color: caminos.teal },
  tipText: { fontFamily: caminosText.body.fontFamily, fontSize: 13.5, lineHeight: 19, color: caminos.ink },
});
