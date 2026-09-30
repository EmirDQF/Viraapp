import { CheckCircle2, Eye } from 'lucide-react-native';
import { memo, useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { AppText } from '@/components/ui/AppText';
import { FeedbackPanel } from '@/features/game/FeedbackPanel';
import type { MechanicProps } from '@/features/game/types';
import { useStageScore } from '@/features/game/useStageScore';
import { seedFrom } from '@/lib/random';
import { cellsBetween, findWord, generateWordSearch, type Cell, type WordPlacement } from '@/lib/wordsearch';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import type { WordSearchContent } from '@/types/content';

const GRID_SIZE = 10;

function placementCells(placement: WordPlacement): readonly Cell[] {
  return cellsBetween(
    { row: placement.row, col: placement.col },
    { row: placement.row + placement.dRow * (placement.word.length - 1), col: placement.col + placement.dCol * (placement.word.length - 1) },
  );
}

const key = (cell: Cell) => `${cell.row}-${cell.col}`;

interface GridCellProps {
  readonly letter: string;
  readonly size: number;
  readonly found: boolean;
  readonly selected: boolean;
  readonly foundColor: string;
  readonly foundText: string;
}

const GridCell = memo(function GridCell({ letter, size, found, selected, foundColor, foundText }: GridCellProps) {
  const { colors } = useTheme();
  const background = found ? foundColor : selected ? colors.secondary : 'transparent';
  const color = found ? foundText : selected ? colors.onSecondary : colors.text;
  return (
    <View style={[styles.cell, { width: size, height: size, backgroundColor: background }]}>
      <AppText style={[styles.letter, { fontSize: size * 0.5, color }]}>{letter}</AppText>
    </View>
  );
});

/** Pupiletras 10×10 con 6 palabras y pistas, sin tiempo límite. Se selecciona arrastrando (o tocando inicio y fin). */
export function WordSearchMechanic({ content, moduleId, tone, onComplete }: MechanicProps<WordSearchContent>) {
  const { colors } = useTheme();
  const score = useStageScore();
  const grid = useMemo(() => generateWordSearch(content.words.map((item) => item.word), GRID_SIZE, seedFrom(moduleId)), [content, moduleId]);
  const [cellSize, setCellSize] = useState(0);
  const [selection, setSelection] = useState<readonly Cell[]>([]);
  const [anchor, setAnchor] = useState<Cell | null>(null);
  const [found, setFound] = useState<ReadonlySet<string>>(() => new Set());
  const dragStart = useSharedValue<Cell>({ row: 0, col: 0 });
  const dragEnd = useSharedValue<Cell>({ row: 0, col: 0 });

  const foundCells = useMemo(
    () => new Set(grid.placements.filter((placement) => found.has(placement.word)).flatMap((placement) => placementCells(placement).map(key))),
    [found, grid],
  );
  const selectedCells = useMemo(() => new Set(selection.map(key)), [selection]);

  const markFound = useCallback(
    (word: string) => {
      if (found.has(word)) return;
      score.answer(true);
      setFound(new Set([...found, word]));
    },
    [found, score],
  );

  const commit = useCallback(
    (start: Cell, end: Cell) => {
      setSelection([]);
      if (start.row === end.row && start.col === end.col) {
        if (!anchor) {
          setAnchor(start);
          setSelection([start]);
          return;
        }
        const word = findWord(grid, anchor, end);
        setAnchor(null);
        if (word) markFound(word);
        return;
      }
      setAnchor(null);
      const word = findWord(grid, start, end);
      if (word) markFound(word);
    },
    [anchor, grid, markFound],
  );

  const preview = useCallback((start: Cell, end: Cell) => setSelection(cellsBetween(start, end)), []);

  const gesture = useMemo(() => {
    const toCell = (x: number, y: number): Cell => {
      'worklet';
      const clamp = (value: number) => Math.min(GRID_SIZE - 1, Math.max(0, Math.floor(value / cellSize)));
      return { row: clamp(y), col: clamp(x) };
    };
    return Gesture.Pan()
      .minDistance(0)
      .onBegin((event) => {
        const cell = toCell(event.x, event.y);
        dragStart.set(cell);
        dragEnd.set(cell);
        scheduleOnRN(preview, cell, cell);
      })
      .onUpdate((event) => {
        const next = toCell(event.x, event.y);
        const end = dragEnd.get();
        if (next.row !== end.row || next.col !== end.col) {
          dragEnd.set(next);
          scheduleOnRN(preview, dragStart.get(), next);
        }
      })
      .onEnd(() => {
        scheduleOnRN(commit, dragStart.get(), dragEnd.get());
      });
  }, [cellSize, commit, dragEnd, dragStart, preview]);

  const onLayout = (event: LayoutChangeEvent) => setCellSize(Math.floor(event.nativeEvent.layout.width / GRID_SIZE));
  const complete = found.size === content.words.length;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.body}>
        <AppText variant="caption" tone="muted" align="center">
          Arrastra sobre las letras (o toca la primera y la última). Sin prisa.
        </AppText>
        <View onLayout={onLayout} style={[styles.gridWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          {cellSize > 0 ? (
            <GestureDetector gesture={gesture}>
              <View accessible accessibilityLabel="Cuadrícula de letras del pupiletras" style={styles.grid}>
                {grid.cells.map((row, rowIndex) => (
                  <View key={rowIndex} style={styles.row}>
                    {row.map((letter, colIndex) => {
                      const id = `${rowIndex}-${colIndex}`;
                      return (
                        <GridCell
                          key={id}
                          letter={letter}
                          size={cellSize}
                          found={foundCells.has(id)}
                          selected={selectedCells.has(id)}
                          foundColor={tone.base}
                          foundText={tone.on}
                        />
                      );
                    })}
                  </View>
                ))}
              </View>
            </GestureDetector>
          ) : null}
        </View>
        {content.words.map((item) => {
          const isFound = found.has(item.word);
          return (
            <View key={item.word} style={[styles.clue, { borderColor: colors.border, backgroundColor: isFound ? tone.soft : colors.surface }]}>
              {isFound ? <CheckCircle2 color={tone.deep} size={20} /> : null}
              <AppText style={styles.clueText} color={isFound ? tone.deep : colors.text}>
                {isFound ? `${item.word}: ` : `${item.word.length} letras: `}
                {item.clue}
              </AppText>
              {!isFound ? (
                <Pressable accessibilityRole="button" accessibilityLabel={`Revelar la palabra: ${item.clue}`} onPress={() => setFound(new Set([...found, item.word]))} hitSlop={8} style={styles.reveal}>
                  <Eye color={colors.textMuted} size={20} />
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
      {complete ? <FeedbackPanel correct message="¡Encontraste las 6 palabras clave!" onContinue={() => onComplete(score.result())} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { gap: spacing.sm, paddingBottom: spacing.lg },
  gridWrap: { borderRadius: radius.lg, borderWidth: 1, padding: 2, alignSelf: 'stretch' },
  grid: { alignSelf: 'center' },
  row: { flexDirection: 'row' },
  cell: { alignItems: 'center', justifyContent: 'center', borderRadius: 6 },
  letter: { fontFamily: fontFamily.extrabold },
  clue: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderRadius: radius.md, padding: spacing.sm, minHeight: MIN_TOUCH },
  clueText: { flex: 1 },
  reveal: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
});
