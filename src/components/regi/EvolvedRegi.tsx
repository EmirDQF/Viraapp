import { Crown, Leaf, Sprout, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { RegiMascot, type RegiPose } from '@/components/regi/RegiMascot';
import { REGI } from '@/lib/regi';
import type { RegiStage } from '@/lib/timeline';
import { brand } from '@/theme/tokens';

interface StageLook {
  /** Tamaño relativo del cuerpo (la cría es más pequeña). */
  readonly scale: number;
  readonly glow: number;
  readonly glowColor: string;
  readonly accessory: LucideIcon | null;
  readonly accessoryColor: string;
}

const LOOKS: Readonly<Record<RegiStage, StageLook>> = {
  cria: { scale: 0.78, glow: 0, glowColor: REGI.leafHalo, accessory: null, accessoryColor: REGI.leaf },
  juvenil: { scale: 0.88, glow: 0.35, glowColor: REGI.leafHalo, accessory: Sprout, accessoryColor: REGI.leafVein },
  adulto: { scale: 1, glow: 0.6, glowColor: REGI.leafHalo, accessory: Leaf, accessoryColor: REGI.leafVein },
  sabio: { scale: 1, glow: 1, glowColor: brand.amber, accessory: Crown, accessoryColor: brand.amber },
};

interface EvolvedRegiProps {
  readonly stage: RegiStage;
  readonly size?: number;
  readonly pose?: RegiPose;
}

/** Regi según su etapa de evolución: crece, brilla más y gana un accesorio (brote, hoja, corona). */
export function EvolvedRegi({ stage, size = 120, pose = 'calm' }: EvolvedRegiProps) {
  const look = LOOKS[stage];
  const Accessory = look.accessory;
  const body = Math.round(size * look.scale);
  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <RegiMascot pose={pose} size={body} glow={look.glow} glowColor={look.glowColor} />
      {Accessory ? (
        <View style={[styles.accessory, { top: size * 0.04, right: size * 0.12 }]} importantForAccessibility="no-hide-descendants">
          <Accessory color={look.accessoryColor} fill={stage === 'sabio' ? brand.amber : 'none'} size={Math.round(size * 0.22)} strokeWidth={2.25} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'flex-end' },
  accessory: { position: 'absolute' },
});
