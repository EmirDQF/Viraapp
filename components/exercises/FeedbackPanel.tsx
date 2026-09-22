import { CircleCheck, RotateCcw } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { radius, spacing, typography } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { Button3D } from '../Button3D';

interface FeedbackPanelProps {
  readonly tone: 'success' | 'retry';
  readonly title: string;
  readonly message: string;
  readonly actionLabel: string;
  readonly onAction: () => void;
}

export function FeedbackPanel({ tone, title, message, actionLabel, onAction }: FeedbackPanelProps) {
  const { colors } = useTheme();
  const isSuccess = tone === 'success';
  const accent = isSuccess ? colors.success : colors.danger;
  return (
    <Animated.View
      entering={SlideInDown.duration(260)}
      style={[styles.panel, { backgroundColor: isSuccess ? colors.successSoft : colors.dangerSoft, borderColor: accent }]}
    >
      <View style={styles.header}>
        {isSuccess ? <CircleCheck color={accent} size={26} /> : <RotateCcw color={accent} size={24} />}
        <Text style={[styles.title, { color: accent }]}>{title}</Text>
      </View>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      <Button3D
        label={actionLabel}
        onPress={onAction}
        variant={isSuccess ? 'success' : 'danger'}
        haptics={isSuccess ? 'success' : 'light'}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 2, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { ...typography.subtitle, flex: 1 },
  message: { ...typography.body },
});
