import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Shuffle } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { PATHS } from '@/data/caminos/paths';
import type { Pa3ModuleId } from '@/data/caminos/types';
import { AllModules } from '@/features/caminos/AllModules';
import { PathCard } from '@/features/caminos/PathCard';
import { PathDetail } from '@/features/caminos/PathDetail';
import { ORB_SIZE, ORB_TOP, RegiOrb, type OrbMode } from '@/features/caminos/RegiOrb';
import { RegiToast } from '@/features/caminos/RegiToast';
import { caminos, caminosText } from '@/features/caminos/theme';
import { moduleHref, useOpenActivity } from '@/features/caminos/useOpenActivity';
import { useFade } from '@/features/caminos/useRise';
import { haptic } from '@/lib/haptics';
import { pickPlan } from '@/lib/caminos';
import { useAppStore } from '@/store/useAppStore';
import { MAX_FONT_SCALE } from '@/theme/typography';
import { useReduceMotion } from '@/theme/useReduceMotion';

export type ExploreState = 'home' | 'spin' | 'paths' | 'detail' | 'all_modules';

const SPIN_TO_PATHS_MS = 1050;
const LAYER_FADE_MS = 300;
const PANEL_MS = 420;
const HINT_TOP = 428;
const TEXT_SCALE = { maxFontSizeMultiplier: MAX_FONT_SCALE } as const;
const SOON_MESSAGE = 'Este módulo estará disponible próximamente';

function useLayer(visible: boolean, reduceMotion: boolean) {
  const value = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    value.value = reduceMotion ? (visible ? 1 : 0) : withTiming(visible ? 1 : 0, { duration: LAYER_FADE_MS });
  }, [reduceMotion, value, visible]);
  return useAnimatedStyle(() => ({ opacity: value.value }));
}

/** Panel que entra desde la derecha (detalle de un camino o lista de módulos). */
function usePanel(open: boolean, width: number, reduceMotion: boolean) {
  const value = useSharedValue(open ? 0 : 1);
  useEffect(() => {
    const target = open ? 0 : 1;
    value.value = reduceMotion ? target : withTiming(target, { duration: PANEL_MS, easing: Easing.bezier(0.3, 0.8, 0.3, 1) });
  }, [open, reduceMotion, value]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: value.value * width * 1.02 }] }));
}

/**
 * Explorar · "De la ruleta a los caminos": Regi espera en el centro; al tocarlo gira el anillo de los 3 caminos,
 * sube a la esquina y aparecen las rutas. Cada camino abre sus módulos como paradas.
 */
export function ExploreCaminosScreen() {
  const reduceMotion = useReduceMotion();
  const tabSpace = useTabBarSpace();
  const journeys = useAppStore((state) => state.caminoJourneys);
  const activities = useAppStore((state) => state.caminoActivities);
  const openActivity = useOpenActivity();

  const [state, setState] = useState<ExploreState>('home');
  const [openPath, setOpenPath] = useState(0);
  const [highlight, setHighlight] = useState<number | null>(null);
  const window = useWindowDimensions();
  const [measured, setMeasured] = useState(0);
  // Hasta medir el escenario se usa el ancho de la pantalla: Regi aparece desde el primer cuadro.
  const width = measured || window.width;
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setHighlight(null);
  }, []);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const showPaths = state === 'paths' || state === 'detail' || state === 'all_modules';
  const homeLayer = useLayer(!showPaths, reduceMotion);
  const hintLayer = useLayer(state === 'home', reduceMotion);
  const pathsLayer = useLayer(showPaths, reduceMotion);
  const bubbleFade = useFade(showPaths, 0, reduceMotion);
  const actsFade = useFade(showPaths, 750, reduceMotion);
  const detailPanel = usePanel(state === 'detail', width, reduceMotion);
  const modulesPanel = usePanel(state === 'all_modules', width, reduceMotion);

  const open = useCallback(
    (index: number) => {
      clearTimers();
      setOpenPath(index);
      setState('detail');
    },
    [clearTimers],
  );

  const onRegi = useCallback(() => {
    clearTimers();
    haptic('medium');
    if (state === 'home') {
      if (reduceMotion) {
        setState('paths');
        return;
      }
      setState('spin');
      later(() => setState('paths'), SPIN_TO_PATHS_MS);
      return;
    }
    if (state !== 'spin') setState('home');
  }, [clearTimers, later, reduceMotion, state]);

  const onPick = useCallback(() => {
    clearTimers();
    const plan = pickPlan(Math.random());
    plan.steps.forEach((step) => later(() => setHighlight(step.index), step.at));
    later(() => open(plan.target), plan.openAt);
  }, [clearTimers, later, open]);

  const onOpenModule = useCallback((id: Pa3ModuleId) => router.push(moduleHref(id)), []);
  const onSoon = useCallback(() => setToast((current) => ({ id: (current?.id ?? 0) + 1, text: SOON_MESSAGE })), []);
  const toPaths = useCallback(() => setState('paths'), []);

  // Botón "atrás" de Android: retrocede un paso dentro de Explorar antes de salir de la pestaña.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (state === 'detail' || state === 'all_modules') {
          setState('paths');
          return true;
        }
        if (state === 'paths') {
          setState('home');
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [state]),
  );

  const onLayout = (event: LayoutChangeEvent) => setMeasured(event.nativeEvent.layout.width);
  const orbMode: OrbMode = state === 'home' ? 'center' : state === 'spin' ? 'spin' : 'corner';
  const bottomSpace = tabSpace + 16;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root} edges={['top']}>
        <View style={styles.stage} onLayout={onLayout}>
          <Animated.View style={[styles.home, homeLayer]} pointerEvents={showPaths ? 'none' : 'box-none'}>
            <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
              Explorar
            </Text>
            <Text style={[caminosText.h1, styles.homeTitle]} accessibilityRole="header" {...TEXT_SCALE}>
              ¿Qué exploramos hoy?
            </Text>
            <Animated.View style={[styles.hint, hintLayer]} pointerEvents="none">
              <Text style={styles.hintStrong} {...TEXT_SCALE}>
                Toca a Regi
              </Text>
              <Text style={styles.hintText} {...TEXT_SCALE}>
                para ver tus caminos
              </Text>
            </Animated.View>
          </Animated.View>

          <Animated.View style={[styles.layer, pathsLayer]} pointerEvents={state === 'paths' ? 'auto' : 'none'}>
            <ScrollView contentContainerStyle={[styles.paths, { paddingBottom: bottomSpace }]} showsVerticalScrollIndicator={false}>
              <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
                Elige tu camino
              </Text>
              <Text style={[caminosText.h2, styles.pathsTitle]} accessibilityRole="header" {...TEXT_SCALE}>
                ¿Por dónde vamos hoy?
              </Text>
              <Animated.View style={[styles.bubble, bubbleFade]}>
                <Text style={caminosText.body} {...TEXT_SCALE}>
                  Son rutas sugeridas, no un orden obligatorio. Puedes cambiar de camino cuando quieras.
                </Text>
              </Animated.View>
              <View style={styles.cards}>
                {PATHS.map((path, index) => (
                  <PathCard
                    key={path.id}
                    path={path}
                    index={index}
                    visible={showPaths}
                    highlighted={highlight === index}
                    reduceMotion={reduceMotion}
                    onOpen={open}
                  />
                ))}
              </View>
              <Animated.View style={[styles.acts, actsFade]}>
                <Pressable onPress={onPick} accessibilityRole="button" style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
                  <Shuffle size={17} color={caminos.appBg} strokeWidth={2} />
                  <Text style={[caminosText.button, { color: caminos.appBg }]} {...TEXT_SCALE}>
                    Que Regi elija
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setState('all_modules')}
                  accessibilityRole="button"
                  style={({ pressed }) => [styles.btn, styles.ghost, pressed && styles.pressed]}
                >
                  <Text style={[caminosText.button, { color: caminos.teal }]} {...TEXT_SCALE}>
                    Ver los 7 módulos
                  </Text>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </Animated.View>

          <Animated.View style={[styles.panel, detailPanel]} pointerEvents={state === 'detail' ? 'auto' : 'none'}>
            <PathDetail
              path={PATHS[openPath]}
              active={state === 'detail'}
              reduceMotion={reduceMotion}
              bottomSpace={bottomSpace}
              journeys={journeys}
              activities={activities}
              onBack={toPaths}
              onOpenModule={onOpenModule}
              onSoon={onSoon}
              onTip={openActivity}
            />
          </Animated.View>

          <Animated.View style={[styles.panel, modulesPanel]} pointerEvents={state === 'all_modules' ? 'auto' : 'none'}>
            <AllModules
              active={state === 'all_modules'}
              reduceMotion={reduceMotion}
              bottomSpace={bottomSpace}
              journeys={journeys}
              activities={activities}
              onBack={toPaths}
              onOpenModule={onOpenModule}
              onMore={() => router.push('/explorar-mas')}
            />
          </Animated.View>

          <RegiOrb mode={orbMode} stageWidth={width} reduceMotion={reduceMotion} onPress={onRegi} />
          <RegiToast message={toast} bottom={bottomSpace} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: caminos.appBg },
  stage: { flex: 1, overflow: 'hidden' },
  home: { ...StyleSheet.absoluteFill, alignItems: 'center', paddingTop: 26, paddingHorizontal: 24 },
  homeTitle: { marginTop: 6, textAlign: 'center' },
  hint: { position: 'absolute', left: 0, right: 0, top: Math.max(HINT_TOP, ORB_TOP + ORB_SIZE + 40), alignItems: 'center' },
  hintStrong: { ...caminosText.button, fontSize: 19, lineHeight: 24, color: caminos.teal },
  hintText: { ...caminosText.button, fontFamily: caminosText.bodyStrong.fontFamily, fontSize: 15, lineHeight: 21, color: caminos.muted },
  layer: { ...StyleSheet.absoluteFill },
  paths: { paddingTop: 22, paddingHorizontal: 20 },
  pathsTitle: { marginTop: 4, paddingRight: 76 },
  bubble: {
    backgroundColor: caminos.mint,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    marginTop: 14,
  },
  cards: { gap: 12, marginTop: 14 },
  acts: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: caminos.teal,
  },
  ghost: { backgroundColor: 'transparent', borderWidth: 2, borderColor: caminos.line },
  pressed: { opacity: 0.85 },
  panel: { ...StyleSheet.absoluteFill, backgroundColor: caminos.appBg, zIndex: 5 },
});
