/**
 * Custom hooks for managing Guzzle board state, keyboard interaction,
 * and game session mechanics.
 */

import { useState, useCallback, useEffect, type Dispatch, type SetStateAction } from "react";
import type { GuzzleMode } from "./Board";
import {
  type GuzzleCell,
  type GuzzlePuzzle,
  createInitialCells,
  evaluateCell,
  getLinesForCell,
} from "./puzzles";

/**
 * Calculate the next grid index when using arrow keys.
 */
function getNextIndex(key: string, prev: number, size: number): number {
  if (key === "ArrowUp") return prev >= size ? prev - size : prev;
  if (key === "ArrowDown") return prev + size < size * size ? prev + size : prev;
  if (key === "ArrowLeft") return prev % size > 0 ? prev - 1 : prev;
  if (key === "ArrowRight") return prev % size < size - 1 ? prev + 1 : prev;
  return prev;
}

/**
 * Hook to handle keyboard input for cell navigation and letter placement.
 */
export function useGuzzleKeyboard(
  selectedIndex: number | null,
  size: number,
  placeLetter: (letter: string) => void,
  clearSelectedCell: () => void,
  setSelectedIndex: Dispatch<SetStateAction<number | null>>,
) {
  useEffect(() => {
    if (selectedIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (/^[a-zA-Z]$/u.test(e.key)) {
        e.preventDefault();
        placeLetter(e.key);
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        clearSelectedCell();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(null);
      } else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev === null ? 0 : getNextIndex(e.key, prev, size)));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, size, placeLetter, clearSelectedCell, setSelectedIndex]);
}

/**
 * Manage cells, mistakes, and used bank letters state.
 */
function useGuzzleBoardState(puzzle: GuzzlePuzzle) {
  const [cells, setCells] = useState<GuzzleCell[]>(() => createInitialCells(puzzle));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [usedBankLetters, setUsedBankLetters] = useState<Set<string>>(new Set());

  const resetBoard = useCallback(() => {
    setCells(createInitialCells(puzzle));
    setSelectedIndex(null);
    setMistakes(0);
    setUsedBankLetters(new Set());
  }, [puzzle]);

  return {
    cells,
    setCells,
    selectedIndex,
    setSelectedIndex,
    mistakes,
    setMistakes,
    usedBankLetters,
    setUsedBankLetters,
    resetBoard,
  };
}

/**
 * Apply a letter placement to the cell and return the updated state.
 */
function applyPlacement(
  cells: GuzzleCell[],
  index: number,
  letter: string,
  puzzle: GuzzlePuzzle,
): { isCorrect: boolean; nextCells: GuzzleCell[] } {
  const result = evaluateCell(letter, index, puzzle);
  const isCorrect = result === "correct";
  const nextCells = [...cells];
  nextCells[index] = {
    ...nextCells[index]!,
    letter,
    result,
    isLocked: isCorrect,
  };
  return { isCorrect, nextCells };
}

/**
 * Hook for managing letter placement in a selected cell.
 */
function useLetterPlacement(
  selectedIndex: number | null,
  mode: GuzzleMode,
  usedBankLetters: Set<string>,
  cells: GuzzleCell[],
  puzzle: GuzzlePuzzle,
  setCells: Dispatch<SetStateAction<GuzzleCell[]>>,
  setUsedBankLetters: Dispatch<SetStateAction<Set<string>>>,
  setMistakes: Dispatch<SetStateAction<number>>,
  setSelectedIndex: Dispatch<SetStateAction<number | null>>,
) {
  return useCallback(
    (letter: string) => {
      if (selectedIndex === null) return;
      const upper = letter.toUpperCase();
      if (mode === "With bank" && usedBankLetters.has(upper)) return;

      const cell = cells[selectedIndex];
      if (!cell || cell.isFixed || cell.isLocked) return;

      const { isCorrect, nextCells } = applyPlacement(cells, selectedIndex, upper, puzzle);
      setCells(nextCells);

      if (isCorrect) {
        setUsedBankLetters((prev) => new Set(prev).add(upper));
      } else {
        setMistakes((prev) => prev + 1);
      }

      setSelectedIndex(null);
    },
    [
      selectedIndex,
      mode,
      usedBankLetters,
      cells,
      puzzle,
      setCells,
      setUsedBankLetters,
      setMistakes,
      setSelectedIndex,
    ],
  );
}

/**
 * Hook for cell selection and clearing actions.
 */
function useCellActions(
  selectedIndex: number | null,
  cells: GuzzleCell[],
  size: number,
  setCells: Dispatch<SetStateAction<GuzzleCell[]>>,
  setSelectedIndex: Dispatch<SetStateAction<number | null>>,
) {
  const handleCellClick = useCallback(
    (index: number) => {
      const cell = cells[index];
      if (!cell || cell.isFixed || cell.isLocked) return;
      if (getLinesForCell(index, size).length === 0) return;
      setSelectedIndex((prev) => (prev === index ? null : index));
    },
    [cells, size, setSelectedIndex],
  );

  const clearSelectedCell = useCallback(() => {
    if (selectedIndex === null) return;
    const cell = cells[selectedIndex];
    if (!cell || cell.isFixed || cell.isLocked) return;
    setCells((prev) => {
      const next = [...prev];
      next[selectedIndex] = { ...next[selectedIndex]!, letter: null, result: null };
      return next;
    });
  }, [selectedIndex, cells, setCells]);

  return { handleCellClick, clearSelectedCell };
}

/**
 * Custom hook to manage the Guzzle game state and user interactions.
 */
export function useGuzzleSession(puzzle: GuzzlePuzzle) {
  const {
    cells,
    setCells,
    selectedIndex,
    setSelectedIndex,
    mistakes,
    setMistakes,
    usedBankLetters,
    setUsedBankLetters,
    resetBoard,
  } = useGuzzleBoardState(puzzle);

  const [mode, setMode] = useState<GuzzleMode>("With bank");

  const placeLetter = useLetterPlacement(
    selectedIndex,
    mode,
    usedBankLetters,
    cells,
    puzzle,
    setCells,
    setUsedBankLetters,
    setMistakes,
    setSelectedIndex,
  );

  const { handleCellClick, clearSelectedCell } = useCellActions(
    selectedIndex,
    cells,
    puzzle.size,
    setCells,
    setSelectedIndex,
  );

  useGuzzleKeyboard(selectedIndex, puzzle.size, placeLetter, clearSelectedCell, setSelectedIndex);

  return {
    cells,
    selectedIndex,
    mistakes,
    usedBankLetters,
    mode,
    setMode,
    handleCellClick,
    placeLetter,
    handleReset: resetBoard,
  };
}
