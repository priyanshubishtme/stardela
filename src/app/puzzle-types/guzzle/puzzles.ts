/**
 * Puzzle definitions and helper utilities for Guzzle.
 * A Guzzle puzzle is a grid where four words cross at the center letter:
 * across, down, and two diagonals. All words have the same length.
 */

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
  readonly size: number;
  readonly center: string;
  readonly words: {
    /** Word reading left-to-right across the centre row. */
    readonly across: string;
    /** Word reading top-to-bottom down the centre column. */
    readonly down: string;
    /** Word reading top-left to bottom-right. */
    readonly diagTLBR: string;
    /** Word reading bottom-left to top-right (read left-to-right). */
    readonly diagBLTR: string;
  };
  /** Bank of available letters (all letters except the fixed centre). */
  readonly bank: readonly string[];
  readonly author: string;
  readonly license: "CC-BY-4.0";
}

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

  /* Across: the middle row, left to right. */
  const across: number[] = [];
  for (let c = 0; c < size; c++) across.push(mid * size + c);

  /* Down: the middle column, top to bottom. */
  const down: number[] = [];
  for (let r = 0; r < size; r++) down.push(r * size + mid);

  /* Diagonal top-left to bottom-right. */
  const diagTLBR: number[] = [];
  for (let i = 0; i < size; i++) diagTLBR.push(i * size + i);

  /* Diagonal bottom-left to top-right (read left to right). */
  const diagBLTR: number[] = [];
  for (let i = 0; i < size; i++) diagBLTR.push((size - 1 - i) * size + i);

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
 * Example 3×3 Guzzle puzzle: CAT, BAG, RAN, MAP.
 */
export const guzzleExample: GuzzlePuzzle = {
  id: "guzzle-0000",
  type: "guzzle",
  size: 3,
  center: "A",
  words: {
    across: "CAT",
    down: "BAG",
    diagTLBR: "RAN",
    diagBLTR: "MAP",
  },
  bank: ["B", "C", "G", "M", "N", "P", "R", "T"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * Additional 3×3 Guzzle puzzle: TIP, WIN, RIM, SIX.
 */
export const guzzle0001: GuzzlePuzzle = {
  id: "guzzle-0001",
  type: "guzzle",
  size: 3,
  center: "I",
  words: {
    across: "TIP",
    down: "WIN",
    diagTLBR: "RIM",
    diagBLTR: "SIX",
  },
  bank: ["M", "N", "P", "R", "S", "T", "W", "X"],
  author: "skardela",
  license: "CC-BY-4.0",
};

/**
 * List of all available Guzzle puzzles.
 */
export const guzzlePuzzles: GuzzlePuzzle[] = [guzzleExample, guzzle0001];

/**
 * Find a Guzzle puzzle by identifier.
 * Returns the matched puzzle or the example puzzle.
 */
export function findGuzzlePuzzle(id?: string): GuzzlePuzzle {
  if (!id) return guzzleExample;
  const found = guzzlePuzzles.find((p) => p.id.toLowerCase() === id.toLowerCase());
  return found ?? guzzleExample;
}

