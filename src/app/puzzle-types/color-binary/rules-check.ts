/**
 * Validation logic for Color Binary puzzle rules.
 * Verify that no three identical colors touch and counts do not exceed half the line length.
 */

import type { Square } from "./puzzles";

/**
 * Result of validating puzzle rules across the board.
 */
export interface RuleCheckResult {
  isFollowed: boolean;
  isComplete: boolean;
  violations: string[];
}

/**
 * Check if a row or column has three identical colors in sequence.
 * Return an error message or null if the sequence rule is obeyed.
 */
function checkLineConsecutive(line: readonly Square[], lineName: string): string | null {
  let prev: Square = ".";
  let count = 0;

  for (const sq of line) {
    if (sq !== "." && sq === prev) {
      count++;
      if (count >= 3) {
        const colorName = sq === "R" ? "red" : "blue";
        return `${lineName} has three ${colorName} squares next to each other.`;
      }
    } else {
      prev = sq;
      count = sq === "." ? 0 : 1;
    }
  }
  return null;
}

/**
 * Check if a row or column has more than the allowed count of one color.
 * Return an error message or null if counts do not exceed the limit.
 */
function checkLineHalf(line: readonly Square[], half: number, lineName: string): string | null {
  const reds = line.filter((s) => s === "R").length;
  const blues = line.filter((s) => s === "B").length;

  if (reds > half) {
    return `${lineName} has more than half red squares (${reds}/${half}).`;
  }
  if (blues > half) {
    return `${lineName} has more than half blue squares (${blues}/${half}).`;
  }
  return null;
}

/**
 * Check all rows and columns on the board for rule violations.
 * Return a list of all detected rule violation messages.
 */
export function getRuleViolations(squares: readonly Square[]): string[] {
  const size = Math.sqrt(squares.length);
  const half = size / 2;
  const violations: string[] = [];

  for (let r = 0; r < size; r++) {
    const row = Array.from({ length: size }, (_, c) => squares[r * size + c] ?? ".");
    const cons = checkLineConsecutive(row, `Row ${r + 1}`);
    if (cons) violations.push(cons);
    const h = checkLineHalf(row, half, `Row ${r + 1}`);
    if (h) violations.push(h);
  }

  for (let c = 0; c < size; c++) {
    const col = Array.from({ length: size }, (_, r) => squares[r * size + c] ?? ".");
    const cons = checkLineConsecutive(col, `Column ${c + 1}`);
    if (cons) violations.push(cons);
    const h = checkLineHalf(col, half, `Column ${c + 1}`);
    if (h) violations.push(h);
  }

  return violations;
}

/**
 * Check if the board state complies with all game rules.
 * Return complete validation status, completion flag, and violation messages.
 */
export function checkRulesAreFollowed(squares: readonly Square[]): RuleCheckResult {
  const violations = getRuleViolations(squares);
  const isFollowed = violations.length === 0;
  const isComplete = isFollowed && !squares.includes(".");
  return { isFollowed, isComplete, violations };
}

/**
 * Check if the board has zero rule violations.
 * Return true when all rules are followed, otherwise return false.
 */
export function checkRules(squares: readonly Square[]): boolean {
  return getRuleViolations(squares).length === 0;
}
