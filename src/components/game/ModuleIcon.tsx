import {
  ArrowLeftRight,
  Clapperboard,
  CloudHail,
  Compass,
  Gift,
  Grid3x3,
  ListChecks,
  OctagonMinus,
  Puzzle,
  Rewind,
  Smartphone,
  Snowflake,
  Sun,
  Swords,
  Timer,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

import type { MechanicKind, ModuleId } from '@/types/game';

const MODULE_ICONS: Readonly<Record<ModuleId, LucideIcon>> = {
  descarga: Zap,
  enfriador: Snowflake,
  freno: OctagonMinus,
  hoy: Sun,
  ancla: Compass,
  muro: Trophy,
};

const MECHANIC_ICONS: Readonly<Record<MechanicKind, LucideIcon>> = {
  decision: Clapperboard,
  quiz: ListChecks,
  puzzle: Puzzle,
  swipe: ArrowLeftRight,
  'word-rain': CloudHail,
  simulator: Smartphone,
  'trap-case': Swords,
  'word-search': Grid3x3,
  boss: Timer,
  rewind: Rewind,
};

interface IconProps {
  readonly color: string;
  readonly size?: number;
  readonly strokeWidth?: number;
}

export function ModuleIcon({ id, color, size = 24, strokeWidth = 2.2 }: IconProps & { readonly id: ModuleId }) {
  const Icon = MODULE_ICONS[id];
  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}

export function MechanicIcon({ kind, color, size = 22, strokeWidth = 2.2 }: IconProps & { readonly kind: MechanicKind }) {
  const Icon = kind === 'rewind' ? Gift : MECHANIC_ICONS[kind];
  return <Icon color={color} size={size} strokeWidth={strokeWidth} />;
}

export { Rewind as RewindIcon };
