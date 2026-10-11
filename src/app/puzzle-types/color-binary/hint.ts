/**
 * Hint calculation engine for Color Binary puzzles.
 * This module finds the next logical move when a player requests a hint.
 */

import { text } from "../../../text/en";
import type { ColorBinaryHint } from "../../../text/en";
import type { Square } from "./puzzles";

const words = text["color-binary"];

/**
 * Check if placing a color creates three identical colors in a row.
 * Return true if three identical colors become adjacent horizontally.
 */
function hasThreeInRow(
  squares: readonly Square[],
  r: number,
  c: number,
  size: number,
  color: "R" | "B",
): boolean {
  const getCell = (col: number) => (col === c ? color : squares[r * size + col]);

  const left = c >= 2 && getCell(c - 2) === color && getCell(c - 1) === color;
  const middle = c >= 1 && c < size - 1 && getCell(c - 1) === color && getCell(c + 1) === color;
  const right = c < size - 2 && getCell(c + 1) === color && getCell(c + 2) === color;

  return left || middle || right;
}

/**
 * Check if placing a color creates three identical colors in a column.
 * Return true if three identical colors become adjacent vertically.
 */
function hasThreeInCol(
  squares: readonly Square[],
  r: number,
  c: number,
  size: number,
  color: "R" | "B",
): boolean {
  const getCell = (row: number) => (row === r ? color : squares[row * size + c]);

  const top = r >= 2 && getCell(r - 2) === color && getCell(r - 1) === color;
  const middle = r >= 1 && r < size - 1 && getCell(r - 1) === color && getCell(r + 1) === color;
  const bottom = r < size - 2 && getCell(r + 1) === color && getCell(r + 2) === color;

  return top || middle || bottom;
}

/**
 * Check if a row already contains the maximum allowed count of a color.
 * Return true if the color count equals or exceeds half the grid size.
 */
function hasHalfInRow(
  squares: readonly Square[],
  r: number,
  size: number,
  color: "R" | "B",
): boolean {
  let count = 0;
  for (let col = 0; col < size; col++) {
    if (squares[r * size + col] === color) count++;
  }
  return count >= size / 2;
}

/**
 * Check if a column already contains the maximum allowed count of a color.
 * Return true if the color count equals or exceeds half the grid size.
 */
function hasHalfInCol(
  squares: readonly Square[],
  c: number,
  size: number,
  color: "R" | "B",
): boolean {
  let count = 0;
  for (let row = 0; row < size; row++) {
    if (squares[row * size + c] === color) count++;
  }
  return count >= size / 2;
}

/**
 * Check if placing a color at an index violates any puzzle rule.
 * Return the broken rule details or null if the placement is valid.
 */
export function brokenRule(
  squares: readonly Square[],
  index: number,
  color: "R" | "B",
): Pick<ColorBinaryHint, "reason" | "line" | "number"> | null {
  const size = Math.sqrt(squares.length);
  const r = Math.floor(index / size);
  const c = index % size;

  if (hasThreeInRow(squares, r, c, size, color)) {
    return { reason: "three", line: "row", number: r + 1 };
  }
  if (hasThreeInCol(squares, r, c, size, color)) {
    return { reason: "three", line: "column", number: c + 1 };
  }
  if (hasHalfInRow(squares, r, size, color)) {
    return { reason: "half", line: "row", number: r + 1 };
  }
  if (hasHalfInCol(squares, c, size, color)) {
    return { reason: "half", line: "column", number: c + 1 };
  }

  return null;
}

/**
 * Scan the board and find the first empty square with a forced move.
 * Return hint details or null if no hint is available.
 */
export function findHint(squares: readonly Square[]): ColorBinaryHint | null {
  const size = Math.sqrt(squares.length);

  for (let index = 0; index < squares.length; index++) {
    if (squares[index] !== ".") continue;

    const row = Math.floor(index / size) + 1;
    const column = (index % size) + 1;

    const brokenR = brokenRule(squares, index, "R");
    if (brokenR) {
      return {
        row,
        column,
        color: words.colors.B,
        otherColor: words.colors.R,
        reason: brokenR.reason,
        line: brokenR.line,
        number: brokenR.number,
      };
    }

    const brokenB = brokenRule(squares, index, "B");
    if (brokenB) {
      return {
        row,
        column,
        color: words.colors.R,
        otherColor: words.colors.B,
        reason: brokenB.reason,
        line: brokenB.line,
        number: brokenB.number,
      };
    }
  }

  return null;
}
