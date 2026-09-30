import { Redirect, router } from 'expo-router';
import { Anchor, Brain, Check, Hand, Lock, ScrollText, Target } from 'lucide-react-native';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { RegiSays } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';
import { CrucibleIcon } from '@/components/CrucibleIcon';
import { HudBar } from '@/components/HudBar';
import { Screen } from '@/components/Screen';
import { getCrucible } from '@/data/crucibles';
import { buildModules } from '@/data/modules';
import { haptic } from '@/lib/haptics';
import { isPathComplete, moduleStatus, type ModuleStatus } from '@/lib/progress';
import { useActiveProgress, useResilienceStore } from '@/store/useResilienceStore';
import { palette, radius, spacing, typography, type ThemeColors } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { Module, ModuleId } from '@/types';

const NODE_SIZE = 84;
const PATH_OFFSETS = [0, 70, 0, -70, 0] as const;

function ModuleGlyph({ id, color }: { readonly id: ModuleId; readonly color: string }) {
  const size = 34;
  switch (id) {
    case 'm1-acceptance':
      return <Hand color={color} size={size} />;
    case 'm2-distortions':
      return <Brain color={color} size={size} />;
    case 'm3-anchoring':
      return <Anchor color={color} size={size} />;
    case 'm4-micro-actions':
      return <Target color={color} size={size} />;
    case 'm5-manifesto':
      return <ScrollText color={color} size={size} />;
  }
}

function nodeColors(colors: ThemeColors, status: ModuleStatus) {
  if (status === 'completed') return { face: colors.success, lip: colors.successShadow };
  if (status === 'unlocked') return { face: colors.accent, lip: colors.accentShadow };
  return { face: colors.disabled, lip: colors.disabledShadow };
}

function PulseRing({ color, children }: { readonly color: string; readonly children: ReactNode }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0, { duration: 900 })), -1);
  }, [pulse]);
  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.25 + pulse.value * 0.5, transform: [{ scale: 1 + pulse.value * 0.12 }] }));
  return (
    <View style={styles.ringWrap}>
      <Animated.View style={[styles.ring, { borderColor: color }, ringStyle]} />
      {children}
    </View>
  );
}

interface PathNodeProps {
  readonly module: Module;
  readonly status: ModuleStatus;
  readonly isCurrent: boolean;
  readonly offset: number;
  readonly onPress: () => void;
}

function PathNode({ module, status, isCurrent, offset, onPress }: PathNodeProps) {
  const { colors } = useTheme();
  const tone = nodeColors(colors, status);
  const glyphColor = status === 'locked' ? colors.textMuted : palette.white;
  const node = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Módulo ${module.order}: ${module.title}. ${status === 'locked' ? 'Bloqueado' : status === 'completed' ? 'Completado' : 'Disponible'}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.node,
        { backgroundColor: tone.face, borderBottomColor: tone.lip },
        pressed && styles.nodePressed,
      ]}
    >
      {status === 'completed' ? (
        <Check color={glyphColor} size={38} strokeWidth={3} />
      ) : status === 'locked' ? (
        <Lock color={glyphColor} size={30} />
      ) : (
        <ModuleGlyph id={module.id} color={glyphColor} />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.nodeRow, { transform: [{ translateX: offset }] }]}>
      {isCurrent ? <PulseRing color={colors.accent}>{node}</PulseRing> : node}
      <Text style={[styles.nodeOrder, { color: colors.textMuted }]}>Módulo {module.order}</Text>
      <Text style={[styles.nodeTitle, { color: status === 'locked' ? colors.textMuted : colors.text }]}>{module.title}</Text>
      <Text style={[styles.nodeSubtitle, { color: colors.textMuted }]}>{module.subtitle}</Text>
    </View>
  );
}

export default function ModulesMapScreen() {
  const { colors } = useTheme();
  const user = useResilienceStore((state) => state.user);
  const activeCrucible = useResilienceStore((state) => state.activeCrucible);
  const progress = useActiveProgress();
  const [notice, setNotice] = useState<string | null>(null);

  const crucible = activeCrucible ? getCrucible(activeCrucible) : null;
  const modules = useMemo(() => (crucible ? buildModules(crucible) : []), [crucible]);

  if (!user) return <Redirect href="/" />;
  if (!crucible) return <Redirect href="/select-crucible" />;

  const completed = progress.completedModules;
  const pathDone = isPathComplete(completed);
  const nextModule = modules.find((module) => moduleStatus(module.id, completed) === 'unlocked');

  let greeting = `¡Hola, ${user.name}! Empecemos por soltar lo que no depende de ti.`;
  if (pathDone) greeting = `¡Lo lograste, ${user.name}! Tu Plan de Resiliencia está listo.`;
  else if (completed.length > 0 && nextModule) greeting = `Vas muy bien. Tu siguiente paso: ${nextModule.title}.`;

  const openModule = (module: Module, status: ModuleStatus) => {
    if (status === 'locked') {
      haptic('warning');
      setNotice(`Completa el módulo ${module.order - 1} para desbloquear "${module.title}".`);
      return;
    }
    haptic('medium');
    setNotice(null);
    router.push({ pathname: '/modules/[id]', params: { id: module.id } });
  };

  const openPlan = () => {
    if (!pathDone) {
      setNotice(`Completa los 5 módulos para generar tu plan. Llevas ${completed.length}/5.`);
      return;
    }
    router.push('/action-plan');
  };

  return (
    <Screen scroll header={<HudBar />}>
      <View style={[styles.crucibleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.crucibleIcon, { backgroundColor: colors.primary }]}>
          <CrucibleIcon id={crucible.id} color={colors.onColor} size={26} />
        </View>
        <View style={styles.crucibleText}>
          <Text style={[styles.crucibleLabel, { color: colors.textMuted }]}>Tu crisol</Text>
          <Text style={[styles.crucibleTitle, { color: colors.text }]}>{crucible.title}</Text>
        </View>
        <View style={styles.changeButton}>
          <Button3D label="Cambiar" onPress={() => router.push('/select-crucible')} variant="outline" compact />
        </View>
      </View>

      <RegiSays pose={pathDone ? 'growth' : 'calm'} message={greeting} size={84} />

      {notice ? (
        <Animated.View entering={FadeIn} style={[styles.notice, { backgroundColor: colors.surfaceAlt, borderColor: colors.accent }]}>
          <Text style={[styles.noticeText, { color: colors.text }]}>{notice}</Text>
        </Animated.View>
      ) : null}

      <View style={styles.path}>
        {modules.map((module, index) => {
          const status = moduleStatus(module.id, completed);
          return (
            <PathNode
              key={module.id}
              module={module}
              status={status}
              isCurrent={nextModule?.id === module.id}
              offset={PATH_OFFSETS[index % PATH_OFFSETS.length]}
              onPress={() => openModule(module, status)}
            />
          );
        })}
      </View>

      <Button3D
        label={pathDone ? 'Ver mi Plan de Resiliencia' : `Plan de Resiliencia (${completed.length}/5)`}
        onPress={openPlan}
        variant={pathDone ? 'accent' : 'outline'}
        haptics={pathDone ? 'success' : 'warning'}
        icon={<ScrollText color={pathDone ? palette.white : colors.textMuted} size={20} />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  crucibleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: radius.xl,
    padding: spacing.md,
  },
  crucibleIcon: { width: 48, height: 48, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  crucibleText: { flex: 1 },
  crucibleLabel: { ...typography.caption, textTransform: 'uppercase' },
  crucibleTitle: { ...typography.subtitle },
  changeButton: { width: 110 },
  notice: { borderWidth: 2, borderRadius: radius.lg, padding: spacing.md },
  noticeText: { ...typography.body, fontWeight: '600' },
  path: { alignItems: 'center', gap: spacing.xl, paddingVertical: spacing.lg },
  nodeRow: { alignItems: 'center', width: 220, gap: 2 },
  ringWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: NODE_SIZE + 22,
    height: NODE_SIZE + 22,
    borderRadius: NODE_SIZE,
    borderWidth: 4,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE,
    borderBottomWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodePressed: { transform: [{ translateY: 4 }], borderBottomWidth: 3 },
  nodeOrder: { ...typography.caption, marginTop: spacing.sm, textTransform: 'uppercase' },
  nodeTitle: { ...typography.body, fontWeight: '800', textAlign: 'center' },
  nodeSubtitle: { ...typography.caption, fontWeight: '500', textAlign: 'center' },
});
