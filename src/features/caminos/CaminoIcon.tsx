import {
  Backpack,
  Compass,
  Gauge,
  Hand,
  Lightbulb,
  Lock,
  Navigation,
  NotebookPen,
  ScanSearch,
  Undo2,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

import type { CaminoIcon as CaminoIconName } from '@/data/caminos/types';

const ICONS: Readonly<Record<CaminoIconName, LucideIcon>> = {
  backpack: Backpack,
  scan: ScanSearch,
  nav: Navigation,
  note: NotebookPen,
  users: Users,
  compass: Compass,
  undo: Undo2,
  gauge: Gauge,
  bulb: Lightbulb,
  hand: Hand,
  lock: Lock,
};

interface CaminoIconProps {
  readonly name: CaminoIconName;
  readonly size: number;
  readonly color: string;
}

/** Íconos del prototipo "VIRA Caminos" (trazo 2, como lucide). */
export function CaminoIcon({ name, size, color }: CaminoIconProps) {
  const Icon = ICONS[name];
  return <Icon size={size} color={color} strokeWidth={2} />;
}
