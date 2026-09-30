import { router } from 'expo-router';
import { useState } from 'react';

import { AgeStep, NameStep } from '@/features/onboarding/ProfileSteps';
import { FirstModuleStep } from '@/features/onboarding/FirstModuleStep';
import { PermissionsStep } from '@/features/onboarding/PermissionsStep';
import { WelcomeStep } from '@/features/onboarding/WelcomeStep';
import type { DateParts } from '@/lib/age';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import type { ModuleId } from '@/types/game';

type Step = 'welcome' | 'name' | 'age' | 'permissions' | 'module';

/** Onboarding de 4 pasos: nombre → edad → permisos → primer módulo. */
export function OnboardingFlow() {
  const setUser = useAppStore((state) => state.setUser);
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState<DateParts>({ day: '', month: '', year: '' });
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [firstModule, setFirstModule] = useState<ModuleId>('descarga');

  const finish = () => {
    if (!birthDate) {
      setStep('age');
      return;
    }
    setUser(name, birthDate);
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
            setStep('permissions');
          }}
        />
      );
    case 'permissions':
      return <PermissionsStep onBack={() => setStep('age')} onNext={() => setStep('module')} />;
    case 'module':
      return <FirstModuleStep selected={firstModule} onSelect={setFirstModule} onBack={() => setStep('permissions')} onFinish={finish} />;
  }
}
