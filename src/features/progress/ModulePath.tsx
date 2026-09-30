import { Gift, Lock } from 'lucide-react-native';
import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { MODULES } from '@/data/modules/catalog';
import { SECTORS, STAGES } from '@/data/stages';
import { openModule, openStage } from '@/features/game/navigation';
import { StageNode } from '@/features/progress/StageNode';
import { lighten } from '@/lib/color';
import { moduleCompletion, moduleStatus, nextStage, stageStatus } from '@/lib/gamification/progress';
import { haptic } from '@/lib/haptics';
import { brand, feedback, gradients, MODULE_COLORS, radius, spacing, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId, ModulesProgress, SectorId } from '@/types/game';

/** Desplazamientos en zigzag de los nodos, como el camino de Duolingo. */
const ZIGZAG = [0, 48, 72, 48, 0, -48, -72, -48] as const;
const CHEST_SIZE = 48;

interface ModulePathProps {
  readonly id: ModuleId;
  readonly modules: ModulesProgress;
  readonly start: ModuleId | null;
  readonly onLockedPress: (message: string) => void;
}

/** Texto AA sobre el degradado de la cabecera: los módulos con texto oscuro se aclaran en vez de oscurecerse. */
function headerGradient(tone: ModuleTone): readonly [string, string] {
  return tone.on === brand.ink ? [lighten(tone.base, 0.2), tone.base] : [tone.base, tone.deep];
}

function SectorDivider({ title }: { readonly title: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.divider} accessibilityRole="header">
      <View style={[styles.line, { backgroundColor: colors.border }]} />
      <View style={[styles.sectorPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AppText variant="overline" tone="muted" uppercase>
          {title}
        </AppText>
      </View>
      <View style={[styles.line, { backgroundColor: colors.border }]} />
    </View>
  );
}

/** Cofre entre sectores: dorado cuando el sector está completo, apagado mientras tanto. */
function SectorChest({ sector, done }: { readonly sector: string; readonly done: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`Cofre del sector ${sector}: ${done ? 'conseguido' : 'por conseguir'}`}
      style={styles.chest}
    >
      {done ? (
        <IconTile color={feedback.gold} gradient={gradients.gold} size={CHEST_SIZE}>
          <Gift color={brand.ink} size={24} strokeWidth={ICON_STROKE} />
        </IconTile>
      ) : (
        <View style={[styles.chestLocked, { backgroundColor: colors.disabled }]}>
          <Gift color={colors.textMuted} size={24} strokeWidth={ICON_STROKE} />
        </View>
      )}
    </View>
  );
}

/** Tramo del recorrido de un módulo: cabecera de color + 13 etapas en camino serpenteante, por sectores. */
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

  const sectorDone = (sector: SectorId) =>
    STAGES.filter((item) => item.sector === sector).every((item) => stageStatus(id, item.index, modules, start) === 'completed');

  return (
    <View style={styles.section}>
      <Card
        variant="gradient"
        gradient={headerGradient(tone)}
        raised
        onPress={() => openModule(id)}
        accessibilityLabel={`${meta.name}, ${meta.track}, ${percent} por ciento completado. Ver detalles del tema`}
        style={styles.header}
      >
        <IconTile color={tone.base} gradient={[brand.white, tone.soft]} size={56}>
          {status === 'locked' ? (
            <Lock color={tone.deep} size={26} strokeWidth={ICON_STROKE} />
          ) : (
            <ModuleIcon id={id} color={tone.deep} size={28} strokeWidth={ICON_STROKE} />
          )}
        </IconTile>
        <View style={styles.headerText}>
          <AppText variant="overline" color={tone.on} uppercase>
            {meta.track}
          </AppText>
          <AppText variant="heading" color={tone.on}>
            {meta.name}
          </AppText>
          <AppText variant="caption" color={tone.on}>
            {status === 'locked' ? 'Bloqueado' : `${percent} % completado`}
          </AppText>
        </View>
      </Card>
      {STAGES.map((stage) => {
        const sector = SECTORS.find((item) => item.id === stage.sector);
        const firstOfSector = STAGES.findIndex((item) => item.sector === stage.sector) === stage.index;
        const following = STAGES[stage.index + 1];
        const lastOfSector = following !== undefined && following.sector !== stage.sector;
        return (
          <View key={stage.index} style={styles.stageRow}>
            {firstOfSector && sector ? <SectorDivider title={sector.title} /> : null}
            <StageNode
              moduleId={id}
              stage={stage}
              status={stageStatus(id, stage.index, modules, start)}
              isCurrent={next?.moduleId === id && next.stage === stage.index}
              offset={ZIGZAG[stage.index % ZIGZAG.length]}
              onPress={pressStage}
            />
            {lastOfSector && sector ? <SectorChest sector={sector.title} done={sectorDone(stage.sector)} /> : null}
          </View>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  section: { gap: spacing.sm, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  headerText: { flex: 1, gap: 2 },
  stageRow: { alignItems: 'center' },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  line: { flex: 1, height: 2, borderRadius: radius.pill },
  sectorPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.pill, borderWidth: 1 },
  chest: { marginVertical: spacing.sm },
  chestLocked: {
    width: CHEST_SIZE,
    height: CHEST_SIZE,
    borderRadius: CHEST_SIZE * 0.32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
