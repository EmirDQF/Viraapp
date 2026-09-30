import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ChoiceButton } from '@/features/game/ChoiceButton';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { TrapContent, TrapOption } from '@/types/content';

interface Message {
  readonly id: string;
  readonly from: 'voice' | 'user';
  readonly text: string;
}

/**
 * Caso «trampa»: debate con la voz de la creencia. El usuario la refuta y la voz repregunta.
 * Funciona sin conexión con un árbol de respuestas guionizadas.
 */
export function TrapCaseMechanic({ content, tone, onComplete }: MechanicProps<TrapContent>) {
  const { colors } = useTheme();
  const score = useStageScore();
  const [turn, setTurn] = useState(0);
  const [messages, setMessages] = useState<readonly Message[]>([{ id: 'c0', from: 'voice', text: content.turns[0].challenge }]);
  const finished = turn >= content.turns.length;
  const current = content.turns[Math.min(turn, content.turns.length - 1)];

  const reply = (option: TrapOption) => {
    score.answer(option.strength === 'strong');
    const nextTurn = turn + 1;
    const followUp = nextTurn < content.turns.length ? [{ id: `c${nextTurn}`, from: 'voice' as const, text: content.turns[nextTurn].challenge }] : [];
    setMessages([...messages, { id: `u${turn}`, from: 'user', text: option.text }, { id: `r${turn}`, from: 'voice', text: option.reply }, ...followUp]);
    setTurn(nextTurn);
  };

  return (
    <View style={styles.root}>
      <View style={[styles.belief, { backgroundColor: tone.soft }]}>
        <AppText variant="overline" color={tone.deep}>
          La creencia trampa
        </AppText>
        <AppText variant="heading" color={tone.deep} align="center">
          “{content.belief}”
        </AppText>
        <AppText variant="caption" color={tone.deep} align="center">
          Explica por qué no es cierta. La voz de la duda va a insistir.
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.chat}>
        {messages.map((message) => (
          <Animated.View
            key={message.id}
            entering={FadeInUp.duration(250)}
            style={[
              styles.bubble,
              message.from === 'user'
                ? [styles.user, { backgroundColor: tone.base }]
                : [styles.voice, { backgroundColor: colors.surface, borderColor: colors.border }],
            ]}
          >
            <AppText color={message.from === 'user' ? tone.on : colors.text}>{message.text}</AppText>
          </Animated.View>
        ))}
        {finished ? (
          <View style={styles.closing}>
            <RegiMascot pose="resilient" size={96} glow={0.7} glowColor={tone.base} />
            <AppText variant="bodyStrong" align="center">
              {content.closing}
            </AppText>
          </View>
        ) : null}
      </ScrollView>
      {finished ? (
        <Button3D label="Continuar" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => onComplete(score.result())} />
      ) : (
        <View style={styles.options}>
          {current.options.map((option) => (
            <ChoiceButton key={option.text} label={option.text} onPress={() => reply(option)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, gap: spacing.md },
  belief: { borderRadius: radius.xxl, padding: spacing.md, alignItems: 'center', gap: spacing.xs },
  chat: { gap: spacing.sm, paddingBottom: spacing.md },
  bubble: { maxWidth: '85%', borderRadius: radius.xl, padding: spacing.md },
  voice: { alignSelf: 'flex-start', borderWidth: 1, borderBottomLeftRadius: 4 },
  user: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  closing: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  options: { gap: spacing.sm },
});
