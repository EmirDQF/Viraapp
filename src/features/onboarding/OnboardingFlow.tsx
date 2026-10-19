import { router } from 'expo-router';
import { useState } from 'react';

import { AgeStep, NameStep } from '@/features/onboarding/ProfileSteps';
import { FirstModuleStep } from '@/features/onboarding/FirstModuleStep';
import { FocusStep, GoalStep, MomentsStep, ReminderStep } from '@/features/onboarding/FocusSteps';
import { PermissionsStep } from '@/features/onboarding/PermissionsStep';
import { WelcomeStep } from '@/features/onboarding/WelcomeStep';
import type { DateParts } from '@/lib/age';
import { haptic } from '@/lib/haptics';
import { recommendedStart, type FocusArea, type HardMoment } from '@/lib/personalize';
import { useAppStore } from '@/store/useAppStore';
import type { ModuleId } from '@/types/game';

type Step = 'welcome' | 'name' | 'age' | 'focus' | 'moments' | 'goal' | 'reminder' | 'permissions' | 'module';

/**
 * Onboarding de 8 pasos: nombre → edad → qué quieres mejorar → cuándo te cuesta → meta diaria →
 * recordatorio → permisos → primer módulo (preseleccionado según el foco).
 */
export function OnboardingFlow() {
  const setUser = useAppStore((state) => state.setUser);
  const setFocus = useAppStore((state) => state.setFocus);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState<DateParts>({ day: '', month: '', year: '' });
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [focusAreas, setFocusAreas] = useState<readonly FocusArea[]>([]);
  const [hardMoments, setHardMoments] = useState<readonly HardMoment[]>([]);
  const [firstModule, setFirstModule] = useState<ModuleId>('descarga');

  const afterFocus = () => {
    // El primer tema sugerido es el que más encaja con lo que quiere mejorar (puede cambiarlo al final).
    setFirstModule(recommendedStart(focusAreas));
    setStep('moments');
  };

  const finish = () => {
    if (!birthDate) {
      setStep('age');
      return;
    }
    setUser(name, birthDate);
    setFocus(focusAreas, hardMoments);
    completeOnboarding(firstModule);
    haptic('success');
    router.replace('/(tabs)');
  };

  switch (step) {
    case 'welcome':
      return <WelcomeStep onStart={() => setStep('name')} />;
    case 'name':
      return <NameStep value={name} onChange={setName} onBack={() => setStep('welcome')} onNext={() => setStep('age')} />;
    case 'age':
      return (
        <AgeStep
          name={name}
          value={birth}
          onChange={setBirth}
          onBack={() => setStep('name')}
          onNext={(isoDate) => {
            setBirthDate(isoDate);
            setStep('focus');
          }}
        />
      );
    case 'focus':
      return <FocusStep name={name} value={focusAreas} onChange={setFocusAreas} onBack={() => setStep('age')} onNext={afterFocus} />;
    case 'moments':
      return <MomentsStep value={hardMoments} onChange={setHardMoments} onBack={() => setStep('focus')} onNext={() => setStep('goal')} />;
    case 'goal':
      return <GoalStep onBack={() => setStep('moments')} onNext={() => setStep('reminder')} />;
    case 'reminder':
      return <ReminderStep onBack={() => setStep('goal')} onNext={() => setStep('permissions')} />;
    case 'permissions':
      return <PermissionsStep onBack={() => setStep('reminder')} onNext={() => setStep('module')} />;
    case 'module':
      return <FirstModuleStep selected={firstModule} onSelect={setFirstModule} onBack={() => setStep('permissions')} onFinish={finish} />;
  }
}
