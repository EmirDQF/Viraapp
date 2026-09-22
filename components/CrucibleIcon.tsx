import { Briefcase, Compass, GraduationCap, HeartCrack, Wallet } from 'lucide-react-native';

import type { CrucibleId } from '../types';

interface CrucibleIconProps {
  readonly id: CrucibleId;
  readonly color: string;
  readonly size?: number;
}

export function CrucibleIcon({ id, color, size = 28 }: CrucibleIconProps) {
  switch (id) {
    case 'academic':
      return <GraduationCap color={color} size={size} />;
    case 'economic':
      return <Wallet color={color} size={size} />;
    case 'grief':
      return <HeartCrack color={color} size={size} />;
    case 'burnout':
      return <Briefcase color={color} size={size} />;
    case 'existential':
      return <Compass color={color} size={size} />;
  }
}
