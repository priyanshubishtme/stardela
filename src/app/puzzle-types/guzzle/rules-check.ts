/**
 * Validation and rule checking logic for Guzzle puzzles.
 * Check whether placed letters match words crossing at the center,
 * and determine feedback colors:
 * - Green (correct): letter is in the correct square.
 * - Yellow (elsewhere): this line has the letter in a different square.
 * - Red (absent): this line does not have the letter.
 */

import {
  type GuzzleCell,
  type GuzzlePuzzle,
  type LetterResult,
  type LineId,
  getLineIndices,
  getLinesForCell,
} from "./puzzles";

/**
 * Result summary of evaluating the full board state.
 */
export interface GuzzleRuleCheckResult {
  isSolved: boolean;
  correctCount: number;
  totalEditableSquares: number;
  mistakes: number;
}

/**
 * Evaluate a letter against a single word line.
 *
 * @param letter - The letter placed by the player.
 * @param cellIndex - The linear index of the cell on the board.
 * @param lineId - The identifier of the line (across, down, diagTLBR, diagBLTR).
 * @param puzzle - The puzzle definition.
 * @returns LetterResult ("correct", "elsewhere", or "absent").
 */
export function evaluateLetterForLine(
  letter: string,
  cellIndex: number,
  lineId: LineId,
  puzzle: GuzzlePuzzle,
): LetterResult {
  const lines = getLineIndices(puzzle.size);
  const indices = lines[lineId];
  const posInLine = indices.indexOf(cellIndex);

  if (posInLine === -1) {
    return "absent";
  }

  const word = puzzle.words[lineId].toUpperCase();
  const targetChar = letter.toUpperCase();

  /* Correct letter at this exact position */
  if (word[posInLine] === targetChar) {
    return "correct";
  }

  /* Letter belongs to this word line, but in another square */
  if (word.includes(targetChar)) {
    return "elsewhere";
  }

  /* Letter does not belong to this word line */
  return "absent";
}

/**
 * Evaluate a letter placement in a cell across all lines passing through it.
 * Priority order: "correct" > "elsewhere" > "absent".
 *
 * @param letter - The letter placed by the player.
 * @param cellIndex - The linear index of the cell on the board.
 * @param puzzle - The puzzle definition.
 * @returns Best LetterResult across all intersecting lines.
 */
export function evaluateLetterPlacement(
  letter: string,
  cellIndex: number,
  puzzle: GuzzlePuzzle,
): LetterResult {
  const lines = getLinesForCell(cellIndex, puzzle.size);
  let best: LetterResult = "absent";

  for (const lineId of lines) {
    const result = evaluateLetterForLine(letter, cellIndex, lineId, puzzle);
    if (result === "correct") {
      return "correct";
    }
    if (result === "elsewhere") {
      best = "elsewhere";
    }
  }

  return best;
}

/**
 * Check if the entire board is solved.
 * A board is solved when all non-fixed squares have been correctly locked.
 *
 * @param cells - The array of board cells.
 * @returns True when all cells are fixed or locked.
 */
export function isGuzzleSolved(cells: readonly GuzzleCell[]): boolean {
  return cells.every((cell) => cell.isLocked || cell.isFixed);
}

/**
 * Get comprehensive rule check summary for the current board state.
 *
 * @param cells - The array of board cells.
 * @param mistakes - The current mistake count.
 * @returns GuzzleRuleCheckResult summary object.
 */
export function checkGuzzleBoard(
  cells: readonly GuzzleCell[],
  mistakes: number,
): GuzzleRuleCheckResult {
  const editable = cells.filter((c) => !c.isFixed);
  const correctCount = editable.filter((c) => c.isLocked).length;
  const isSolved = isGuzzleSolved(cells);

  return {
    isSolved,
    correctCount,
    totalEditableSquares: editable.length,
    mistakes,
  };
}
