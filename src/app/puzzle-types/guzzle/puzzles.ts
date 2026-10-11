/**
 * Puzzle definitions and helper utilities for Guzzle.
 * A Guzzle puzzle is a grid where four words cross at the center letter:
 * across, down, and two diagonals. All words have the same length.
 */

import type { Difficulty } from "../../../shared/difficulty";

/**
 * Result of placing a letter in a square.
 * "correct" = green: the letter is in the right place.
 * "elsewhere" = yellow: the letter is in a word on this line, but in a different square.
 * "absent" = red: the letter is not in the word for this line.
 */
export type LetterResult = "correct" | "elsewhere" | "absent";

/**
 * State of a single cell on the Guzzle board.
 */
export interface GuzzleCell {
  /** The letter the player placed, or null if empty. */
  letter: string | null;
  /** Whether this cell is the fixed centre cell. */
  isFixed: boolean;
  /** The best result across all lines that pass through this cell. */
  result: LetterResult | null;
  /** Whether this cell is locked (correctly placed). */
  isLocked: boolean;
}

/**
 * Structure of a Guzzle puzzle configuration.
 */
export interface GuzzlePuzzle {
  readonly id: string;
  readonly type: "guzzle";
  readonly difficulty: Difficulty;
  readonly size: number;
  readonly center: string;
  readonly words: {
    readonly across: string;
    readonly down: string;
    readonly diagTLBR: string;
    readonly diagBLTR: string;
  };
  readonly bank: readonly string[];
  readonly author: string;
  readonly license: "CC-BY-4.0";
}

/**
 * Board dimensions for each Guzzle difficulty level.
 */
export const guzzleSizes: Record<Difficulty, number> = {
  easy: 3,
  medium: 5,
  hard: 7,
};

/**
 * Lines that pass through each cell.
 * For a 3×3 board, each cell is on one or more of the four word lines.
 */
export type LineId = "across" | "down" | "diagTLBR" | "diagBLTR";

/**
 * Get the indices of cells on each line for a given board size.
 */
export function getLineIndices(size: number): Record<LineId, number[]> {
  const mid = Math.floor(size / 2);
  const across: number[] = [];
  const down: number[] = [];
  const diagTLBR: number[] = [];
  const diagBLTR: number[] = [];
  for (let i = 0; i < size; i++) {
    across.push(mid * size + i);
    down.push(i * size + mid);
    diagTLBR.push(i * size + i);
    diagBLTR.push((size - 1 - i) * size + i);
  }
  return { across, down, diagTLBR, diagBLTR };
}

/**
 * Get which lines pass through a specific cell index.
 */
export function getLinesForCell(cellIndex: number, size: number): LineId[] {
  const lines = getLineIndices(size);
  const result: LineId[] = [];
  for (const [lineId, indices] of Object.entries(lines)) {
    if (indices.includes(cellIndex)) {
      result.push(lineId as LineId);
    }
  }
  return result;
}

/**
 * Evaluate a letter placement against a specific word line.
 * Returns the result colour for this line.
 */
export function evaluateLetter(
  letter: string,
  cellIndex: number,
  lineId: LineId,
  puzzle: GuzzlePuzzle,
): LetterResult {
  const lines = getLineIndices(puzzle.size);
  const indices = lines[lineId];
  const word = puzzle.words[lineId].toUpperCase();
  const posInLine = indices.indexOf(cellIndex);

  if (posInLine === -1) return "absent";

  /* Check if the letter is correct at this position in the word. */
  if (word[posInLine] === letter.toUpperCase()) {
    return "correct";
  }

  /* Check if the letter exists elsewhere in the word. */
  if (word.includes(letter.toUpperCase())) {
    return "elsewhere";
  }

  return "absent";
}

/**
 * Evaluate a letter at a cell across all lines through that cell.
 * Returns the best result (green > yellow > red).
 */
export function evaluateCell(
  letter: string,
  cellIndex: number,
  puzzle: GuzzlePuzzle,
): LetterResult {
  const cellLines = getLinesForCell(cellIndex, puzzle.size);
  let best: LetterResult = "absent";

  for (const lineId of cellLines) {
    const result = evaluateLetter(letter, cellIndex, lineId, puzzle);
    if (result === "correct") return "correct";
    if (result === "elsewhere") best = "elsewhere";
  }

  return best;
}

/**
 * Create the initial cell state for a Guzzle board.
 */
export function createInitialCells(puzzle: GuzzlePuzzle): GuzzleCell[] {
  const total = puzzle.size * puzzle.size;
  const centerIndex = Math.floor(total / 2);
  const cells: GuzzleCell[] = [];

  for (let i = 0; i < total; i++) {
    if (i === centerIndex) {
      cells.push({
        letter: puzzle.center.toUpperCase(),
        isFixed: true,
        result: "correct",
        isLocked: true,
      });
    } else {
      cells.push({
        letter: null,
        isFixed: false,
        result: null,
        isLocked: false,
      });
    }
  }

  return cells;
}

/**
 * Check if all cells on the board are correctly filled.
 */
export function isBoardSolved(cells: readonly GuzzleCell[]): boolean {
  return cells.every((cell) => cell.isLocked || cell.isFixed);
}

/**
 * Get the expected letter for a cell from the puzzle answer.
 * A cell may belong to multiple lines; all lines agree on the correct letter.
 */
export function getExpectedLetter(cellIndex: number, puzzle: GuzzlePuzzle): string | null {
  const lines = getLineIndices(puzzle.size);

  for (const [lineId, indices] of Object.entries(lines)) {
    const pos = indices.indexOf(cellIndex);
    if (pos !== -1) {
      const word = puzzle.words[lineId as LineId];
      return word[pos]?.toUpperCase() ?? null;
    }
  }

  return null;
}

/* --- Example puzzle from rules.md --- */

/**
 * Easy 3×3 Guzzle puzzle (Set 1).
 */
export const guzzleExample: GuzzlePuzzle = {
  id: "guzzle-0000",
  type: "guzzle",
  difficulty: "easy",
  size: 3,
  center: "A",
  words: { across: "CAT", down: "BAG", diagTLBR: "RAN", diagBLTR: "MAP" },
  bank: [..."BCGMNPRT"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * Easy 3×3 Guzzle puzzle (Set 2).
 */
export const guzzle0001: GuzzlePuzzle = {
  id: "guzzle-0001",
  type: "guzzle",
  difficulty: "easy",
  size: 3,
  center: "I",
  words: { across: "TIP", down: "WIN", diagTLBR: "RIM", diagBLTR: "SIX" },
  bank: [..."MNPRSTWX"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * Medium 5×5 Guzzle puzzle.
 */
export const guzzle0005: GuzzlePuzzle = {
  id: "guzzle-0005",
  type: "guzzle",
  difficulty: "medium",
  size: 5,
  center: "A",
  words: { across: "TRAIN", down: "CRANE", diagTLBR: "FRAME", diagBLTR: "SPARE" },
  bank: [..."CEEEFIMNNPRRRRST"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * Hard 7×7 Guzzle puzzle.
 */
export const guzzle0015: GuzzlePuzzle = {
  id: "guzzle-0015",
  type: "guzzle",
  difficulty: "hard",
  size: 7,
  center: "U",
  words: { across: "MINUTES", down: "FIGURES", diagTLBR: "NATURAL", diagBLTR: "VOLUMES" },
  bank: [..."AAEEEFGIILMMNNORRSSSTTV"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * List of all available Guzzle puzzles.
 */
export const guzzlePuzzles: GuzzlePuzzle[] = [guzzleExample, guzzle0001, guzzle0005, guzzle0015];

/**
 * Find a Guzzle puzzle by identifier or difficulty keyword.
 */
export function findGuzzlePuzzle(id?: string): GuzzlePuzzle {
  if (!id) return guzzleExample;
  const lower = id.toLowerCase();
  const found = guzzlePuzzles.find(
    (p) =>
      p.id.toLowerCase() === lower ||
      lower.includes(p.difficulty) ||
      (lower === "daily" && p.difficulty === "easy"),
  );
  return found ?? guzzleExample;
}
