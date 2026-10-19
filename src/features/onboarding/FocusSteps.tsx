import { useState } from 'react';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { FocusPicker, MomentPicker } from '@/features/onboarding/FocusPickers';
import { StepFrame } from '@/features/onboarding/StepFrame';
import { ChoiceGroup, SettingSwitch } from '@/features/settings/SettingControls';
import { notificationsSupported } from '@/lib/notifications';
import { requestPermission } from '@/lib/permissions';
import type { FocusArea, HardMoment } from '@/lib/personalize';
import { REMINDER_HOURS, formatHour } from '@/lib/reminders';
import { useAppStore } from '@/store/useAppStore';
import type { DailyGoalMinutes } from '@/store/types';

interface StepNav {
  readonly onBack: () => void;
  readonly onNext: () => void;
}

export const GOAL_OPTIONS: readonly { value: DailyGoalMinutes; label: string }[] = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
];
const HOUR_OPTIONS = REMINDER_HOURS.map((hour) => ({ value: hour, label: formatHour(hour) }));

/** Paso 3: "¿Qué quieres mejorar?". Elegir es opcional: sin áreas se sigue el orden de la guía. */
export function FocusStep({ name, value, onChange, onBack, onNext }: StepNav & { readonly name: string; readonly value: readonly FocusArea[]; readonly onChange: (value: readonly FocusArea[]) => void }) {
  return (
    <StepFrame
      step={3}
      title="¿Qué quieres mejorar?"
      onBack={onBack}
      footer={<Button3D label={value.length > 0 ? 'Continuar' : 'Prefiero verlo después'} variant={value.length > 0 ? 'primary' : 'outline'} onPress={onNext} />}
    >
      <RegiSays message={`${name.trim()}, elige todo lo que quieras trabajar. Con eso armo tu ruta.`} pose="growth" />
      <FocusPicker value={value} onChange={onChange} />
    </StepFrame>
  );
}

/** Paso 4: "¿Cuándo te cuesta más?". */
export function MomentsStep({ value, onChange, onBack, onNext }: StepNav & { readonly value: readonly HardMoment[]; readonly onChange: (value: readonly HardMoment[]) => void }) {
  return (
    <StepFrame step={4} title="¿Cuándo te cuesta más?" onBack={onBack} footer={<Button3D label="Continuar" onPress={onNext} />}>
      <RegiSays message="Así sé cuándo darte una mano extra. No hay respuestas malas." pose="empathetic" />
      <MomentPicker value={value} onChange={onChange} />
    </StepFrame>
  );
}

/** Paso 5: meta diaria (5, 10 o 15 minutos). */
export function GoalStep({ onBack, onNext }: StepNav) {
  const goal = useAppStore((state) => state.dailyGoalMinutes);
  const setDailyGoal = useAppStore((state) => state.setDailyGoal);
  return (
    <StepFrame step={5} title="Tu meta diaria" onBack={onBack} footer={<Button3D label="Continuar" onPress={onNext} />}>
      <RegiSays message="Poquito y seguido funciona mejor que mucho de golpe. ¿Cuánto quieres practicar al día?" />
      <ChoiceGroup label="Minutos de práctica al día" options={GOAL_OPTIONS} value={goal} onChange={setDailyGoal} />
    </StepFrame>
  );
}

/** Paso 6: recordatorio opcional. El permiso de notificaciones se pide solo al activarlo. */
export function ReminderStep({ onBack, onNext }: StepNav) {
  const reminder = useAppStore((state) => state.settings.dailyReminder);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const setPermission = useAppStore((state) => state.setPermission);
  const [note, setNote] = useState<string | null>(null);

  const toggle = async (enabled: boolean) => {
    if (enabled) {
      const result = await requestPermission('notifications');
      setPermission('notifications', result);
      if (result !== 'granted') {
        setNote('Sin permiso de notificaciones. Puedes activarlo después en Ajustes.');
        return;
      }
    }
    setNote(null);
    updateSettings({ dailyReminder: { ...reminder, enabled } });
  };

  return (
    <StepFrame step={6} title="¿Te recuerdo practicar?" onBack={onBack} footer={<Button3D label="Continuar" onPress={onNext} />}>
      <RegiSays message="Puedo mandarte un aviso amable cada día. Es opcional y lo cambias cuando quieras." pose="calm" />
      {notificationsSupported ? null : (
        <AppText variant="caption" tone="muted">
          Los recordatorios funcionan en la app instalada en tu teléfono, no en la versión web.
        </AppText>
      )}
      <SettingSwitch
        label="Recordatorio diario"
        detail="Un aviso a la hora que elijas."
        value={reminder.enabled}
        onChange={(value) => void toggle(value)}
        disabled={!notificationsSupported}
      />
      {reminder.enabled ? (
        <ChoiceGroup
          label="Hora del recordatorio"
          options={HOUR_OPTIONS}
          value={reminder.hour}
          onChange={(hour) => updateSettings({ dailyReminder: { ...reminder, hour, minute: 0 } })}
        />
      ) : null}
      {note ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          {note}
        </AppText>
      ) : null}
    </StepFrame>
  );
}
