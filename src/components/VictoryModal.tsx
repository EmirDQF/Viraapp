import { Brain, Flame, Zap } from 'lucide-react-native';
import { Modal, StyleSheet, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { palette, radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';
import { Confetti } from '@/components/Confetti';

interface VictoryModalProps {
  readonly visible: boolean;
  readonly moduleTitle: string;
  readonly skill: string;
  readonly xp: number;
  readonly streak: number;
  readonly continueLabel: string;
  readonly onContinue: () => void;
}

export function VictoryModal({ visible, moduleTitle, skill, xp, streak, continueLabel, onContinue }: VictoryModalProps) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onContinue}>
      <View style={[styles.backdrop, { backgroundColor: colors.background }]}>
        <Confetti />
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.content}>
          <RegiMascot pose="growth" size={190} />
          <Text style={[styles.title, { color: palette.phoenix }]}>¡Módulo superado!</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>{moduleTitle}</Text>

          <View style={styles.stats}>
            <View style={[styles.stat, { borderColor: palette.amber }]}>
              <Zap color={palette.amber} fill={palette.amber} size={22} />
              <Text style={[styles.statValue, { color: palette.amber }]}>+{xp} XP</Text>
            </View>
            <View style={[styles.stat, { borderColor: palette.phoenix }]}>
              <Flame color={palette.phoenix} fill={palette.amber} size={22} />
              <Text style={[styles.statValue, { color: palette.phoenix }]}>{streak} {streak === 1 ? 'día' : 'días'}</Text>
            </View>
          </View>

          <View style={[styles.skill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Brain color={colors.primary} size={24} />
            <View style={styles.skillText}>
              <Text style={[styles.skillLabel, { color: colors.textMuted }]}>Habilidad cognitiva adquirida</Text>
              <Text style={[styles.skillValue, { color: colors.text }]}>{skill}</Text>
            </View>
          </View>
        </Animated.View>
        <View style={styles.footer}>
          <Button3D label={continueLabel} onPress={onContinue} variant="success" haptics="success" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'space-between', padding: spacing.xl },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  title: { ...typography.title, fontSize: 30, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center' },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  statValue: { fontSize: 18, fontWeight: '900' },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignSelf: 'stretch',
  },
  skillText: { flex: 1, gap: 2 },
  skillLabel: { ...typography.caption, textTransform: 'uppercase' },
  skillValue: { ...typography.body, fontWeight: '700' },
  footer: { paddingBottom: spacing.md },
});
