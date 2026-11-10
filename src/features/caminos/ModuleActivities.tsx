import { CheckCircle2, ChevronDown, ChevronRight, CirclePause } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Activity } from '@/data/caminos/types';
import { StatusBadge, TEXT_SCALE } from '@/features/caminos/CaminoParts';
import { caminos, caminosText } from '@/features/caminos/theme';
import type { ActivityProgress, CaminoActivities } from '@/lib/caminos';

function progressLabel(activity: Activity, progress: ActivityProgress | undefined): string {
  if (activity.content.kind === 'planned') return 'Así funcionará';
  if (progress?.completed) return 'Hecha';
  if (progress && activity.content.kind === 'flow' && progress.step > 0) return 'En pausa';
  if (progress && activity.content.kind === 'link') return 'En curso';
  return 'Empezar';
}

interface ActivityRowProps {
  readonly activity: Activity;
  readonly progress: ActivityProgress | undefined;
  readonly color: string;
  readonly locked: boolean;
  readonly onOpen: (id: string) => void;
  readonly onMarkDone: (id: string) => void;
}

const ActivityRow = memo(function ActivityRow({ activity, progress, color, locked, onOpen, onMarkDone }: ActivityRowProps) {
  const [expanded, setExpanded] = useState(false);
  const { content } = activity;
  const planned = content.kind === 'planned';
  const done = progress?.completed === true;
  const label = progressLabel(activity, progress);
  const showMarkDone = content.kind === 'link' && progress !== undefined && !done;

  const onPress = () => {
    if (planned) {
      setExpanded((value) => !value);
      return;
    }
    onOpen(activity.id);
  };

  const StateIcon = done ? CheckCircle2 : label === 'En pausa' ? CirclePause : planned ? ChevronDown : ChevronRight;

  return (
    <View style={[styles.row, done && { borderColor: color }]}>
      <Pressable
        onPress={onPress}
        disabled={locked && !planned}
        accessibilityRole="button"
        accessibilityLabel={`${activity.title}. ${activity.summary}. ${activity.status}. ${label}`}
        accessibilityState={{ disabled: locked && !planned, expanded: planned ? expanded : undefined }}
        style={({ pressed }) => [styles.press, locked && !planned && styles.locked, pressed && styles.pressed]}
      >
        <View style={styles.flex}>
          <StatusBadge status={activity.status} />
          <Text style={[caminosText.stopTitle, styles.title]} {...TEXT_SCALE}>
            {activity.title}
          </Text>
          <Text style={caminosText.small} {...TEXT_SCALE}>
            {activity.summary}
          </Text>
        </View>
        <View style={styles.state}>
          <StateIcon size={22} color={done ? color : caminos.muted} strokeWidth={2} />
          <Text style={[caminosText.tag, { color: done ? color : caminos.muted }]} {...TEXT_SCALE}>
            {label}
          </Text>
        </View>
      </Pressable>
      {planned && expanded ? (
        <View style={styles.plan}>
          {content.plan.map((line, index) => (
            <Text key={line} style={caminosText.body} {...TEXT_SCALE}>
              {`${index + 1}. ${line}`}
            </Text>
          ))}
        </View>
      ) : null}
      {showMarkDone ? (
        <Pressable
          onPress={() => onMarkDone(activity.id)}
          accessibilityRole="button"
          accessibilityLabel={`Marcar ${activity.title} como hecha`}
          style={({ pressed }) => [styles.markDone, { borderColor: color }, pressed && styles.pressed]}
        >
          <CheckCircle2 size={16} color={color} strokeWidth={2.2} />
          <Text style={[caminosText.button, { color }]} {...TEXT_SCALE}>
            Ya la hice
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
});

interface ModuleActivitiesProps {
  readonly activities: readonly Activity[];
  readonly progress: CaminoActivities;
  readonly color: string;
  readonly locked: boolean;
  readonly onOpen: (id: string) => void;
  readonly onMarkDone: (id: string) => void;
}

/** Etapa 02 · Explora y practica: las actividades del módulo con su estado. */
export function ModuleActivities({ activities, progress, color, locked, onOpen, onMarkDone }: ModuleActivitiesProps) {
  return (
    <View style={styles.list}>
      {locked ? (
        <Text style={caminosText.small} {...TEXT_SCALE}>
          Responde primero la situación inicial: así podrás comparar al final qué cambió.
        </Text>
      ) : null}
      {activities.map((activity) => (
        <ActivityRow
          key={activity.id}
          activity={activity}
          progress={progress[activity.id]}
          color={color}
          locked={locked}
          onOpen={onOpen}
          onMarkDone={onMarkDone}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  row: { borderRadius: 16, borderWidth: 2, borderColor: caminos.line, backgroundColor: caminos.appBg, overflow: 'hidden' },
  press: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  locked: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  flex: { flex: 1, minWidth: 0, gap: 3 },
  title: { marginTop: 4 },
  state: { alignItems: 'center', gap: 2, minWidth: 64 },
  plan: { gap: 6, paddingHorizontal: 12, paddingBottom: 12 },
  markDone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minHeight: 44,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 999,
    borderWidth: 2,
  },
});
