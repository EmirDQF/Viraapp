import { Lock } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { MODULES } from '@/data/modules/catalog';
import { SECTORS, STAGES } from '@/data/stages';
import { openModule, openStage } from '@/features/game/navigation';
import { StageNode } from '@/features/progress/StageNode';
import { moduleCompletion, moduleStatus, nextStage, stageStatus } from '@/lib/gamification/progress';
import { haptic } from '@/lib/haptics';
import { MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import type { ModuleId, ModulesProgress } from '@/types/game';

/** Desplazamientos en zigzag de los nodos, como el camino de Duolingo. */
const ZIGZAG = [0, 48, 72, 48, 0, -48, -72, -48] as const;

interface ModulePathProps {
  readonly id: ModuleId;
  readonly modules: ModulesProgress;
  readonly start: ModuleId | null;
  readonly onLockedPress: (message: string) => void;
}

/** Tramo del recorrido de un módulo: cabecera de color + 13 etapas agrupadas por sector. */
export const ModulePath = memo(function ModulePath({ id, modules, start, onLockedPress }: ModulePathProps) {
  const meta = MODULES[id];
  const tone = MODULE_COLORS[id];
  const status = moduleStatus(id, modules, start);
  const next = nextStage(modules, start);
  const percent = Math.round(moduleCompletion(id, modules) * 100);

  const pressStage = useCallback(
    (stage: number) => {
      const state = stageStatus(id, stage, modules, start);
      if (state === 'locked') {
        haptic('warning');
        onLockedPress(
          status === 'locked'
            ? `Completa el tema anterior para desbloquear ${meta.name}.`
            : 'Completa la etapa anterior para desbloquear esta.',
        );
        return;
      }
      haptic('medium');
      openStage({ moduleId: id, stage });
    },
    [id, meta.name, modules, onLockedPress, start, status],
  );

  return (
    <View style={styles.section}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${meta.name}, ${meta.track}, ${percent} por ciento completado. Ver detalles del tema`}
        onPress={() => openModule(id)}
        style={[styles.header, { backgroundColor: tone.base, borderBottomColor: tone.deep }]}
      >
        <View style={styles.headerText}>
          <AppText variant="overline" color={tone.on}>
            {meta.track}
          </AppText>
          <AppText variant="heading" color={tone.on}>
            {meta.name}
          </AppText>
          <AppText variant="caption" color={tone.on}>
            {status === 'locked' ? 'Bloqueado' : `${percent}% completado`}
          </AppText>
        </View>
        {status === 'locked' ? <Lock color={tone.on} size={30} /> : <ModuleIcon id={id} color={tone.on} size={34} />}
      </Pressable>
      {STAGES.map((stage) => {
        const sector = SECTORS.find((item) => item.id === stage.sector);
        const firstOfSector = STAGES.findIndex((item) => item.sector === stage.sector) === stage.index;
        return (
          <View key={stage.index} style={styles.stageRow}>
            {firstOfSector && sector ? (
              <AppText variant="overline" tone="muted" align="center" style={styles.sector}>
                {sector.title}
              </AppText>
            ) : null}
            <StageNode
              moduleId={id}
              stage={stage}
              status={stageStatus(id, stage.index, modules, start)}
              isCurrent={next?.moduleId === id && next.stage === stage.index}
              offset={ZIGZAG[stage.index % ZIGZAG.length]}
              onPress={pressStage}
            />
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  section: { gap: spacing.sm, paddingBottom: spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    borderBottomWidth: 6,
    marginBottom: spacing.md,
  },
  headerText: { flex: 1, gap: 2 },
  stageRow: { alignItems: 'center' },
  sector: { marginTop: spacing.md, marginBottom: spacing.xs },
});
